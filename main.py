from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from models import Song, SongCreate
import database

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/songs")
def get_songs():
    return database.songs


@app.post("/songs")
def add_song(song: SongCreate):
    database.id_counter += 1
    new_song = Song(id=database.id_counter, **song.model_dump())
    database.songs.append(new_song)
    return {"message": "Song added", "song": new_song}


@app.put("/songs/{song_id}")
def update_song(song_id: int, updated_song: SongCreate):
    for i, song in enumerate(database.songs):
        if song.id == song_id:
            database.songs[i] = Song(id=song_id, **updated_song.model_dump())
            return {"message": "Song updated"}
    raise HTTPException(status_code=404, detail="Song not found")


@app.delete("/songs/{song_id}")
def delete_song(song_id: int):
    for i, song in enumerate(database.songs):
        if song.id == song_id:
            database.songs.pop(i)
            return {"message": "Song deleted"}
    raise HTTPException(status_code=404, detail="Song not found")
