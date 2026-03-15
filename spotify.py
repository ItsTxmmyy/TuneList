import os
import time
import httpx
from dotenv import load_dotenv

load_dotenv()

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
TOKEN_URL = "https://accounts.spotify.com/api/token"
SEARCH_URL = "https://api.spotify.com/v1/search"

_token_cache = {"access_token": None, "expires_at": 0}


async def _get_access_token() -> str:
    if _token_cache["access_token"] and time.time() < _token_cache["expires_at"]:
        return _token_cache["access_token"]

    async with httpx.AsyncClient() as client:
        response = await client.post(
            TOKEN_URL,
            data={"grant_type": "client_credentials"},
            auth=(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET),
        )
        response.raise_for_status()
        data = response.json()

    _token_cache["access_token"] = data["access_token"]
    _token_cache["expires_at"] = time.time() + data["expires_in"] - 60
    return _token_cache["access_token"]


async def search_tracks(query: str, limit: int = 10) -> list[dict]:
    token = await _get_access_token()

    async with httpx.AsyncClient() as client:
        response = await client.get(
            SEARCH_URL,
            params={"q": query, "type": "track", "limit": limit},
            headers={"Authorization": f"Bearer {token}"},
        )
        response.raise_for_status()
        data = response.json()

    tracks = []
    for item in data.get("tracks", {}).get("items", []):
        album = item.get("album", {})
        artists = item.get("artists", [])
        images = album.get("images", [])
        release_date = album.get("release_date", "")

        tracks.append({
            "spotify_id": item.get("id"),
            "title": item.get("name"),
            "artist": ", ".join(a.get("name", "") for a in artists),
            "album": album.get("name"),
            "album_art": images[0]["url"] if images else None,
            "year": int(release_date[:4]) if len(release_date) >= 4 else None,
            "preview_url": item.get("preview_url"),
        })

    return tracks
