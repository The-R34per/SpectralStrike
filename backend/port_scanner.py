import socket
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ScanRequest(BaseModel):
    target: str
    ports: List[int]

class ScanResult(BaseModel):
    port: int
    status: str

class ScanResponse(BaseModel):
    target: str
    results: List[ScanResult]

def scan_port(target: str, port: int) -> bool:
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.5)
        result = sock.connect_ex((target, port))
        sock.close()
        return result == 0
    except:
        return False

@router.post("/scan/ports", response_model=ScanResponse)
def scan_ports(req: ScanRequest):
    results = []

    for port in req.ports:
        is_open = scan_port(req.target, port)
        results.append(
            ScanResult(
                port=port,
                status="open" if is_open else "closed"
            )
        )

    return ScanResponse(target=req.target, results=results)
