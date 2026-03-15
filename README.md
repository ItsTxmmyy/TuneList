# TuneList

A music playlist tracker built with FastAPI and vanilla JavaScript. Search for songs on Spotify or add them manually, track what you've listened to, and manage your collection.

## Features

- **Spotify Search** — Search Spotify's catalog and add songs with album art in one click
- **Manual Add** — Add songs manually as a fallback
- **Listened Tracking** — Mark songs as listened/unlistened
- **CRUD Operations** — Add, update, and delete songs from your list

## Tech Stack

- **Backend:** FastAPI, Pydantic, httpx
- **Frontend:** Jinja2 templates, vanilla JavaScript
- **API:** Spotify Web API (Client Credentials Flow)

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/ItsTxmmyy/TuneList.git
cd TuneList
```

### 2. Create a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up Spotify credentials

Create a `.env` file in the project root:

```
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

Get your credentials from the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

### 5. Run the server

```bash
uvicorn main:app --reload
```

Visit [http://127.0.0.1:8000](http://127.0.0.1:8000)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Homepage |
| GET | `/search?q=` | Search Spotify tracks |
| GET | `/songs` | Get all songs |
| POST | `/songs` | Add a song |
| PUT | `/songs/{id}` | Update a song |
| DELETE | `/songs/{id}` | Delete a song |
