from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GOOGLE_MAPS_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
