import math
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class PasswordRequest(BaseModel):
    password: str

class PasswordResponse(BaseModel):
    strength: str
    score: int
    entropy_bits: float
    crack_time: str
    breached_count: int
    suggestions: list[str]

def estimate_entropy(pw: str) -> float:
    length = len(pw)
    charset_size = 0

    has_lower = any(c.islower() for c in pw)
    has_upper = any(c.isupper() for c in pw)
    has_digit = any(c.isdigit() for c in pw)
    has_symbol = any(not c.isalnum() for c in pw)

    if has_lower:
        charset_size += 26
    if has_upper:
        charset_size += 26
    if has_digit:
        charset_size += 10
    if has_symbol:
        charset_size += 32

    if charset_size == 0:
        return 0.0

    return round(length * math.log2(charset_size), 2)

def classify_strength(entropy: float, length: int) -> tuple[str, int]:
    if length == 0:
        return "Empty", 0
    if entropy < 28:
        return "Very Weak", 1
    if entropy < 40:
        return "Weak", 2
    if entropy < 60:
        return "Moderate", 3
    if entropy < 80:
        return "Strong", 4
    return "Military-Grade", 5

def estimate_crack_time(entropy: float) -> str:
    guesses = 2 ** entropy
    guesses_per_second = 1e10  # aggressive GPU rig
    seconds = guesses / guesses_per_second

    if seconds < 60:
        return "Less than a minute"
    minutes = seconds / 60
    if minutes < 60:
        return f"{minutes:.1f} minutes"
    hours = minutes / 60
    if hours < 24:
        return f"{hours:.1f} hours"
    days = hours / 24
    if days < 365:
        return f"{days:.1f} days"
    years = days / 365
    return f"{years:.1f} years"

def fake_breach_count(pw: str) -> int:
    if len(pw) < 8:
        return 120
    if pw.lower() in {"password", "123456", "qwerty", "letmein"}:
        return 5000
    return 0

def build_suggestions(pw: str, entropy: float) -> list[str]:
    suggestions = []
    if len(pw) < 12:
        suggestions.append("Increase length to at least 12–16 characters.")
    if not any(c.islower() for c in pw):
        suggestions.append("Add lowercase letters.")
    if not any(c.isupper() for c in pw):
        suggestions.append("Add uppercase letters.")
    if not any(c.isdigit() for c in pw):
        suggestions.append("Include digits.")
    if not any(not c.isalnum() for c in pw):
        suggestions.append("Include special characters.")
    if pw.lower() in {"password", "123456", "qwerty", "letmein"}:
        suggestions.append("Avoid common passwords and patterns.")
    if entropy > 80:
        suggestions.append("This password is very strong. Consider using a password manager to store it.")
    return suggestions

@router.post("/password/analyze", response_model=PasswordResponse)
def analyze_password(req: PasswordRequest):
    pw = req.password
    entropy = estimate_entropy(pw)
    strength, score = classify_strength(entropy, len(pw))
    crack_time = estimate_crack_time(entropy)
    breached = fake_breach_count(pw)
    suggestions = build_suggestions(pw, entropy)

    return PasswordResponse(
        strength=strength,
        score=score,
        entropy_bits=entropy,
        crack_time=crack_time,
        breached_count=breached,
        suggestions=suggestions,
    )
