from pydantic import BaseModel
from typing import Optional


class SongCreate(BaseModel):
    title: str
    artist: str
    album: Optional[str] = None
    year: int
    genre: str
    listened: bool = False


class Song(SongCreate):
    id: int
