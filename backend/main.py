from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import socket
import httpx
from password_analyzer import router as password_router
from port_scanner import router as port_router
import asyncio
import dns.resolver


app = FastAPI()

app.include_router(password_router)
app.include_router(port_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# MODELS
# -----------------------------

class NewTarget(BaseModel):
    host: str
    description: Optional[str] = None

class Target(BaseModel):
    id: int
    host: str
    description: Optional[str] = None
    ports: List[int] = []

class ScanResult(BaseModel):
    host: str
    open_ports: List[int]
    services: List[str]
    risk_score: str

# -----------------------------
# STORAGE
# -----------------------------

targets: List[Target] = []
next_id = 1

PORT_SERVICE_MAP = {
    22: "SSH",
    80: "HTTP",
    443: "HTTPS",
    3306: "MySQL",
    5432: "PostgreSQL",
    8080: "HTTP-Alt",
}

# -----------------------------
# SCANNING FUNCTION
# -----------------------------

def scan_host(host: str, ports: List[int]) -> ScanResult:
    open_ports = []
    services = []

    for port in ports:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.5)
        try:
            s.connect((host, port))
            open_ports.append(port)
            
            banner = ""
            try:
                s.sendall(b"HEAD / HTTP/1.0\r\n\r\n")
                data = s.recv(128)
                banner = data.decode(errors="ignore").strip()
            except Exception:
                banner = PORT_SERVICE_MAP.get(port, "Unknown")

            services.append(banner or PORT_SERVICE_MAP.get(port, "Unknown"))
        except:
            pass
        finally:
            s.close()

    if len(open_ports) == 0:
        risk = "LOW"
    elif len(open_ports) < 5:
        risk = "MEDIUM"
    else:
        risk = "HIGH"

    return ScanResult(
        host=host,
        open_ports=open_ports,
        services=services,
        risk_score=risk,
    )


# -----------------------------
# ROUTES
# -----------------------------

@app.get("/targets", response_model=List[Target])
def get_targets():
    return targets

@app.post("/targets", response_model=Target)
def add_target(new_target: NewTarget):
    global next_id
    t = Target(id=next_id, host=new_target.host, description=new_target.description, ports=[])
    targets.append(t)
    next_id += 1
    return t

@app.delete("/targets/{target_id}")
def delete_target(target_id: int):
    global targets
    targets = [t for t in targets if t.id != target_id]
    return {"status": "ok"}

@app.get("/scan/{host}", response_model=ScanResult)
def scan(host: str):
    ports_to_scan = [22, 80, 443, 3306, 5432, 8080]
    result = scan_host(host, ports_to_scan)

    # Save ports into target
    for t in targets:
        if t.host == host:
            t.ports = result.open_ports
            break
    return result


#----------
# EMAIL
#----------

@app.post("/osint/email/dns")
async def email_dns(payload: dict):
    domain = payload.get("domain", "").strip()
    if not domain:
        return {"mx": [], "spf": None, "dmarc": None}

    result = {"mx": [], "spf": None, "dmarc": None}

    # MX records
    try:
        mx_records = dns.resolver.resolve(domain, "MX")
        result["mx"] = sorted(
            [str(r.exchange).rstrip(".") for r in mx_records],
            key=lambda x: x
        )
    except Exception:
        pass

    # SPF (TXT record containing "v=spf1")
    try:
        txt_records = dns.resolver.resolve(domain, "TXT")
        for r in txt_records:
            txt = b"".join(r.strings).decode("utf-8", errors="ignore")
            if txt.startswith("v=spf1"):
                result["spf"] = txt
                break
    except Exception:
        pass

    # DMARC (TXT record at _dmarc.domain)
    try:
        dmarc_records = dns.resolver.resolve(f"_dmarc.{domain}", "TXT")
        for r in dmarc_records:
            txt = b"".join(r.strings).decode("utf-8", errors="ignore")
            if txt.startswith("v=DMARC1"):
                result["dmarc"] = txt
                break
    except Exception:
        pass

    return result

@app.get("/osint/email/rep")
async def email_reputation(email: str):
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            res = await client.get(
                f"https://emailrep.io/{email}",
                headers={"User-Agent": "AttackDashboard/1.0"}
            )
            return res.json()
        except Exception as e:
            return {"error": str(e)}



@app.get("/intel")
async def get_intel(limit: int = 10, offset: int = 0, target: str = None, severity: str = None):
    async with httpx.AsyncClient(timeout=15) as client:
        params = {
            "resultsPerPage": limit,
            "startIndex": offset,
        }

        if target and target != "all":
            keyword = target.split(".")[0].lower()
            params["keywordSearch"] = keyword

        if severity and severity != "all":
            params["cvssV3Severity"] = severity.upper()

        try:
            res = await client.get(
                "https://services.nvd.nist.gov/rest/json/cves/2.0",
                params=params,
                headers={"User-Agent": "SpectralStrike/1.0"}
            )
            data = res.json()
            vulnerabilities = data.get("vulnerabilities", [])
            total = data.get("totalResults", 0)

            results = []
            for v in vulnerabilities:
                cve = v.get("cve", {})
                cve_id = cve.get("id")
                descriptions = cve.get("descriptions", [])
                summary = next((d["value"] for d in descriptions if d["lang"] == "en"), None)
                published = cve.get("published", "")[:10]
                metrics = cve.get("metrics", {})
                cvss = None
                sev = "INFO"
                if metrics.get("cvssMetricV31"):
                    cvss = metrics["cvssMetricV31"][0]["cvssData"]["baseScore"]
                    sev = metrics["cvssMetricV31"][0]["cvssData"]["baseSeverity"]
                elif metrics.get("cvssMetricV2"):
                    cvss = metrics["cvssMetricV2"][0]["cvssData"]["baseScore"]
                    sev = metrics["cvssMetricV2"][0].get("baseSeverity", "INFO")

                results.append({
                    "id": cve_id,
                    "summary": summary,
                    "cvss": cvss,
                    "severity": sev,
                    "published": published,
                    "href": f"https://nvd.nist.gov/vuln/detail/{cve_id}"
                })

            return {"count": total, "results": results}

        except Exception as e:
            return {"count": 0, "results": [], "error": str(e)}




#-------------
# Network & Infra routes
#-------------


import subprocess
import platform
import re
import dns.resolver
import dns.zone
import dns.query
import httpx


# DNS Enumeration

@app.post("/network/dns")
async def dns_enum(payload: dict):
    domain = payload.get("domain", "").strip()
    if not domain:
        return {"records": {}, "zone_transfer": {"success": False}, "subdomains": []}

    record_types = ["A", "AAAA", "MX", "TXT", "CNAME", "NS"]
    records = {}

    for rtype in record_types:
        try:
            answers = dns.resolver.resolve(domain, rtype)
            if rtype == "MX":
                records[rtype] = [f"{r.preference} {r.exchange}" for r in answers]
            else:
                records[rtype] = [str(r) for r in answers]
        except Exception:
            records[rtype] = []

    # Zone transfer attempt
    zone_transfer = {"success": False, "records": []}
    try:
        ns_records = dns.resolver.resolve(domain, "NS")
        for ns in ns_records:
            ns_host = str(ns).rstrip(".")
            try:
                z = dns.zone.from_xfr(dns.query.xfr(ns_host, domain, timeout=3))
                zone_transfer["success"] = True
                zone_transfer["records"] = [
                    f"{name} {rdataset}"
                    for name, rdataset in z.iterate_rdatasets()
                ]
                break
            except Exception:
                continue
    except Exception:
        pass

    # Passive subdomain enum via crt.sh
    subdomains = []
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            res = await client.get(f"https://crt.sh/?q=%25.{domain}&output=json")
            if res.status_code == 200:
                for entry in res.json():
                    for name in entry.get("name_value", "").split("\n"):
                        name = name.strip().lstrip("*.")
                        if name.endswith(domain) and name not in subdomains:
                            subdomains.append(name)
        subdomains = sorted(list(set(subdomains)))
    except Exception:
        pass

    return {"records": records, "zone_transfer": zone_transfer, "subdomains": subdomains}


# ARP Recon (no root needed)

@app.post("/network/arp")
async def arp_recon():
    system = platform.system()

    try:
        if system == "Windows":
            result = subprocess.run(["arp", "-a"], capture_output=True, text=True, timeout=10)
        else:
            result = subprocess.run(["arp", "-a"], capture_output=True, text=True, timeout=10)

        raw = result.stdout
        hosts = []

        if system == "Windows":
            # Windows arp -a format:
            # Interface: 192.168.1.100 --- 0x5
            #   Internet Address      Physical Address      Type
            #   192.168.1.1           aa-bb-cc-dd-ee-ff     dynamic
            current_iface = None
            for line in raw.splitlines():
                iface_match = re.match(r"Interface:\s+([\d.]+)", line)
                if iface_match:
                    current_iface = iface_match.group(1)
                    continue
                entry = re.match(
                    r"\s+([\d.]+)\s+([\w-]+)\s+(\w+)", line
                )
                if entry:
                    ip, mac, etype = entry.groups()
                    if mac != "ff-ff-ff-ff-ff-ff":  # skip broadcast
                        hosts.append({
                            "ip": ip,
                            "mac": mac.replace("-", ":").upper(),
                            "type": etype.capitalize(),
                            "interface": current_iface,
                        })
        else:
            # Linux/Mac arp -a format:
            # hostname (192.168.1.1) at aa:bb:cc:dd:ee:ff [ether] on eth0
            for line in raw.splitlines():
                match = re.match(
                    r"(\S+)\s+\(([\d.]+)\)\s+at\s+([\w:]+).*?on\s+(\S+)", line
                )
                if match:
                    hostname, ip, mac, iface = match.groups()
                    hosts.append({
                        "ip": ip,
                        "mac": mac.upper(),
                        "type": "Dynamic",
                        "interface": iface,
                    })

        return {"hosts": hosts, "raw": raw}

    except Exception as e:
        return {"hosts": [], "raw": "", "error": str(e)}


# Wi-Fi Recon (Windows only via netsh)

@app.post("/network/wifi")
async def wifi_recon():
    if platform.system() != "Windows":
        return {
            "networks": [],
            "error": "Wi-Fi recon via netsh is Windows-only. On Linux use: sudo iwlist scan"
        }

    try:
        result = subprocess.run(
            ["netsh", "wlan", "show", "networks", "mode=bssid"],
            capture_output=True, text=True, timeout=15
        )
        raw = result.stdout
        networks = []
        current = {}

        for line in raw.splitlines():
            line = line.strip()

            if line.startswith("SSID") and "BSSID" not in line:
                if current:
                    networks.append(current)
                ssid_match = re.match(r"SSID\s+\d+\s*:\s*(.*)", line)
                current = {"ssid": ssid_match.group(1).strip() if ssid_match else ""}

            elif line.startswith("BSSID"):
                m = re.match(r"BSSID\s+\d+\s*:\s*(.*)", line)
                if m:
                    current["bssid"] = m.group(1).strip()

            elif line.startswith("Signal"):
                m = re.match(r"Signal\s*:\s*(\d+)%", line)
                if m:
                    current["signal"] = int(m.group(1))

            elif line.startswith("Radio type"):
                m = re.match(r"Radio type\s*:\s*(.*)", line)
                if m:
                    current["band"] = m.group(1).strip()

            elif line.startswith("Channel"):
                m = re.match(r"Channel\s*:\s*(\d+)", line)
                if m:
                    current["channel"] = m.group(1)

            elif line.startswith("Authentication"):
                m = re.match(r"Authentication\s*:\s*(.*)", line)
                if m:
                    current["authentication"] = m.group(1).strip()

            elif line.startswith("Cipher"):
                m = re.match(r"Cipher\s*:\s*(.*)", line)
                if m:
                    current["encryption"] = m.group(1).strip()

            elif line.startswith("Network type"):
                m = re.match(r"Network type\s*:\s*(.*)", line)
                if m:
                    current["networkType"] = m.group(1).strip()

        if current:
            networks.append(current)
            
        networks = [n for n in networks if n.get("ssid") or n.get("bssid")]

        return {"networks": networks, "raw": raw}

    except Exception as e:
        return {"networks": [], "raw": "", "error": str(e)}

    
    
    
# -------------------------
# OSINT Username Scanner
# -------------------------

@app.post("/osint/people")
async def osint_username(payload: dict):
    username = payload.get("username", "").strip()
    if not username:
        return {"username": username, "accounts": [], "breaches": []}

    OSINT_SOURCES = {
    # Mainstream
    "GitHub":       "https://github.com/{}",
    "Reddit":       "https://www.reddit.com/user/{}",
    "Twitter (X)":    "https://x.com/{}",
    "Instagram":    "https://www.instagram.com/{}/",
    "TikTok":       "https://www.tiktok.com/@{}",
    "YouTube":      "https://www.youtube.com/@{}",
    "Facebook":     "https://www.facebook.com/{}",
    "LinkedIn":     "https://www.linkedin.com/in/{}",
    "Snapchat":     "https://www.snapchat.com/add/{}",
    "Pinterest":    "https://www.pinterest.com/{}",
    "Threads":      "https://www.threads.net/@{}",
    "Bluesky":      "https://bsky.app/profile/{}",
    "Mastodon":     "https://mastodon.social/@{}",

    # Gaming
    "Steam":        "https://steamcommunity.com/id/{}",
    "Twitch":       "https://www.twitch.tv/{}",
    "Roblox":       "https://www.roblox.com/user.aspx?username={}",
    "Xbox":         "https://account.xbox.com/en-US/profile?gamertag={}",
    "Battle.net":   "https://battle.net/{}",
    "Chess.com":    "https://www.chess.com/member/{}",

    # Creative / Portfolio
    "Medium":       "https://medium.com/@{}",
    "Behance":      "https://www.behance.net/{}",
    "Dribbble":     "https://dribbble.com/{}",
    "DeviantArt":   "https://www.deviantart.com/{}",
    "ArtStation":   "https://www.artstation.com/{}",
    "Flickr":       "https://www.flickr.com/people/{}",
    "500px":        "https://500px.com/p/{}",
    "Vimeo":        "https://vimeo.com/{}",
    "SoundCloud":   "https://soundcloud.com/{}",
    "Bandcamp":     "https://bandcamp.com/{}",
    "Mixcloud":     "https://www.mixcloud.com/{}",
    "Last.fm":      "https://www.last.fm/user/{}",
    "Substack":     "https://substack.com/@{}",
    "Patreon":      "https://www.patreon.com/{}",

    # Tech / Dev
    "GitLab":       "https://gitlab.com/{}",
    "Bitbucket":    "https://bitbucket.org/{}",
    "Stack Overflow": "https://stackoverflow.com/users/{}",
    "HackerRank":   "https://www.hackerrank.com/{}",
    "LeetCode":     "https://leetcode.com/{}",
    "CodePen":      "https://codepen.io/{}",
    "Replit":       "https://replit.com/@{}",
    "Product Hunt": "https://www.producthunt.com/@{}",
    "DEV.to":       "https://dev.to/{}",
    "Hacker News":  "https://news.ycombinator.com/user?id={}",

    # Forums / Community
    "Quora":        "https://www.quora.com/profile/{}",
    "Tumblr":       "https://www.tumblr.com/{}",
    "WordPress":    "https://{}.wordpress.com",
    "About.me":     "https://about.me/{}",
    "Gravatar":     "https://en.gravatar.com/{}",
    "Linktree":     "https://linktr.ee/{}",

    # Messaging / Chat
    "Telegram":     "https://t.me/{}",
    "Discord":      "https://discord.com/users/{}",
    "Kik":          "https://kik.me/{}",

    # Region / Niche
    "VKontakte":    "https://vk.com/{}",
    "Weibo":        "https://weibo.com/{}",
    "OK.ru":        "https://ok.ru/{}",
    "LiveJournal":  "https://www.livejournal.com/users/{}",
    "Ask.fm":       "https://ask.fm/{}",
    "Wattpad":      "https://www.wattpad.com/user/{}",
    "Goodreads":    "https://www.goodreads.com/{}",
    "Letterboxd":   "https://letterboxd.com/{}",
    "Strava":       "https://www.strava.com/athletes/{}",
    "Duolingo":     "https://www.duolingo.com/profile/{}",
    "Tripadvisor":  "https://www.tripadvisor.com/members/{}",
    "Yelp":         "https://www.yelp.com/user_details?userid={}",
    "Etsy":         "https://www.etsy.com/shop/{}",
    "eBay":         "https://www.ebay.com/usr/{}",
    "Cash App":     "https://cash.app/${}",
    "Venmo":        "https://venmo.com/{}",
}

    headers = {"User-Agent": "Mozilla/5.0"}

    async def check(client, platform, url):
        try:
            res = await client.get(url, timeout=5)
            return {"platform": platform, "url": url, "exists": res.status_code == 200}
        except Exception:
            return {"platform": platform, "url": url, "exists": False}

    async with httpx.AsyncClient(
        follow_redirects=True,
        headers=headers,
        timeout=5
    ) as client:
        tasks = [
            check(client, name, tmpl.format(username))
            for name, tmpl in OSINT_SOURCES.items()
        ]
        raw = await asyncio.gather(*tasks)

    accounts = [r for r in raw if r["exists"]]

    return {
        "username": username,
        "accounts": accounts,   # ← matches what PeopleOSINT.jsx expects
        "breaches": []          # plug in HaveIBeenPwned API here later
    }


# -------------------------
# Directory Brute Forcing
# -------------------------

import httpx

COMMON_DIRS = [
    "admin", "login", "dashboard", "backup", "api", "uploads",
    "images", "css", "js", "server-status", "phpmyadmin",
    "test", "dev", "old", "private", "config"
]

@app.post("/web/dirbust")
async def dirbust(payload: dict):
    url = payload.get("url")
    wordlist = payload.get("wordlist", COMMON_DIRS)

    if not url.startswith("http"):
        url = "http://" + url

    results = []

    async with httpx.AsyncClient(follow_redirects=False, timeout=5) as client:
        for word in wordlist:
            target = url.rstrip("/") + "/" + word

            try:
                res = await client.get(target)
                results.append({
                    "path": word,
                    "url": target,
                    "status": res.status_code,
                    "length": len(res.content),
                    "redirect": res.headers.get("Location")
                })
            except Exception:
                results.append({
                    "path": word,
                    "url": target,
                    "status": "error",
                    "length": 0,
                    "redirect": None
                })

    return {"url": url, "results": results}



# -------------------------
# Subdomain Enumeration
# -------------------------

import httpx
import socket

SUBDOMAIN_WORDLIST = [
    "www", "mail", "dev", "test", "api", "staging", "beta", "vpn",
    "portal", "admin", "internal", "secure", "m", "blog", "shop"
]

async def resolve_domain(domain: str):
    try:
        return socket.gethostbyname(domain)
    except:
        return None

@app.post("/recon/subdomains")
async def subdomain_enum(payload: dict):
    domain = payload.get("domain")
    brute = payload.get("brute", True)
    wordlist = payload.get("wordlist", SUBDOMAIN_WORDLIST)

    found = []

    try:
        async with httpx.AsyncClient(timeout=5) as client:
            res = await client.get(
                f"https://crt.sh/?q=%25.{domain}&output=json"
            )
            if res.status_code == 200:
                for entry in res.json():
                    name = entry.get("name_value", "")
                    for sub in name.split("\n"):
                        if sub.endswith(domain) and sub not in found:
                            found.append(sub.strip())
    except:
        pass

    if brute:
        for word in wordlist:
            sub = f"{word}.{domain}"
            ip = await resolve_domain(sub)
            if ip:
                found.append(sub)

    found = sorted(list(set(found)))

    results = []
    async with httpx.AsyncClient(follow_redirects=False, timeout=5) as client:
        for sub in found:
            url = f"http://{sub}"
            try:
                r = await client.get(url)
                results.append({
                    "subdomain": sub,
                    "status": r.status_code,
                    "ip": await resolve_domain(sub)
                })
            except:
                results.append({
                    "subdomain": sub,
                    "status": "unreachable",
                    "ip": await resolve_domain(sub)
                })

    return {"domain": domain, "results": results}
