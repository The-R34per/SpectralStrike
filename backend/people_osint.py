from fastapi import APIRouter
import httpx
import asyncio

router = APIRouter()

SOCIAL_MEDIA = [
    {"url": "https://www.facebook.com/{}", "name": "Facebook"},
    {"url": "https://www.twitter.com/{}", "name": "Twitter"},
    {"url": "https://www.instagram.com/{}", "name": "Instagram"},
    {"url": "https://www.linkedin.com/in/{}", "name": "LinkedIn"},
    {"url": "https://www.github.com/{}", "name": "GitHub"},
    {"url": "https://www.pinterest.com/{}", "name": "Pinterest"},
    {"url": "https://www.tumblr.com/{}", "name": "Tumblr"},
    {"url": "https://www.youtube.com/@{}", "name": "Youtube"},
    {"url": "https://soundcloud.com/{}", "name": "SoundCloud"},
    {"url": "https://www.snapchat.com/add/{}", "name": "Snapchat"},
    {"url": "https://www.tiktok.com/@{}", "name": "TikTok"},
    {"url": "https://www.behance.net/{}", "name": "Behance"},
    {"url": "https://www.medium.com/@{}", "name": "Medium"},
    {"url": "https://www.quora.com/profile/{}", "name": "Quora"},
    {"url": "https://www.flickr.com/people/{}", "name": "Flickr"},
    {"url": "https://www.twitch.tv/{}", "name": "Twitch"},
    {"url": "https://www.dribbble.com/{}", "name": "Dribbble"},
    {"url": "https://www.telegram.me/{}", "name": "Telegram"},
]

async def check_platform(client: httpx.AsyncClient, name: str, url: str):
    try:
        res = await client.get(url, timeout=5)
        if res.status_code == 200:
            return {"platform": name, "url": url}
    except Exception:
        pass
    return None
