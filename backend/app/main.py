from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import neighborhood

app = FastAPI(
    title="Neighborhood Vibe API",
    description="Check the vibe of any Toronto neighborhood",
    version="1.0.0"
)

# CORS - allow frontend (web + mobile) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production: specify your domains
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(neighborhood.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
