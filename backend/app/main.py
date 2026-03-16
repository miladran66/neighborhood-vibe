from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.routers import neighborhood

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Neighborhood Vibe API")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS — فقط vibemap.ca مجاز
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://vibemap.ca",
        "https://www.vibemap.ca",
        "http://vibemap.ca",
        "http://www.vibemap.ca",
    ],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(neighborhood.router)

@app.get("/api/health")
def health():
    return {"status": "ok"}