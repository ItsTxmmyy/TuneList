from pydantic import BaseModel
from typing import Optional


class SongCreate(BaseModel):
    title: str
    artist: str
    album: Optional[str] = None
    year: int
    genre: str
    listened: bool = False
    album_art: Optional[str] = None
    spotify_id: Optional[str] = None
    preview_url: Optional[str] = None


class Song(SongCreate):
    id: int
