const songForm = document.getElementById("song-form");
const songList = document.getElementById("song-list");
const emptyState = document.getElementById("empty-state");
const spotifySearch = document.getElementById("spotify-search");
const searchResults = document.getElementById("search-results");
const manualToggle = document.getElementById("manual-toggle");
const toggleArrow = document.getElementById("toggle-arrow");

// --- Spotify Search ---

let searchTimeout = null;

spotifySearch.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();

    if (query.length < 2) {
        searchResults.classList.add("hidden");
        searchResults.innerHTML = "";
        return;
    }

    searchTimeout = setTimeout(() => searchSpotify(query), 300);
});

async function searchSpotify(query) {
    const res = await fetch(`/search?q=${encodeURIComponent(query)}`);
    const tracks = await res.json();
    renderSearchResults(tracks);
}

function renderSearchResults(tracks) {
    searchResults.innerHTML = "";

    if (tracks.length === 0) {
        searchResults.innerHTML = `<p class="text-sm text-gray-500">No results found.</p>`;
        searchResults.classList.remove("hidden");
        return;
    }

    searchResults.classList.remove("hidden");

    tracks.forEach((track) => {
        const card = document.createElement("div");
        card.className =
            "flex items-center gap-4 bg-gray-800/50 border border-gray-700/50 rounded-xl p-3 hover:bg-gray-800 transition cursor-pointer group";

        const albumArt = track.album_art
            ? `<img src="${track.album_art}" alt="Album art" class="w-12 h-12 rounded-lg object-cover shrink-0">`
            : `<div class="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center shrink-0">
                   <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                   </svg>
               </div>`;

        card.innerHTML = `
            ${albumArt}
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-100 truncate">${track.title}</p>
                <p class="text-xs text-gray-400 truncate">${track.artist}${track.album ? ` \u00b7 ${track.album}` : ""}${track.year ? ` \u00b7 ${track.year}` : ""}</p>
            </div>
            <button class="text-xs px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium opacity-0 group-hover:opacity-100 transition shrink-0">
                Add
            </button>
        `;

        const addBtn = card.querySelector("button");
        addBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            addSpotifyTrack(track);
        });

        searchResults.appendChild(card);
    });
}

async function addSpotifyTrack(track) {
    const song = {
        title: track.title,
        artist: track.artist,
        album: track.album || null,
        year: track.year || new Date().getFullYear(),
        genre: "Spotify",
        listened: false,
        album_art: track.album_art || null,
        spotify_id: track.spotify_id || null,
        preview_url: track.preview_url || null,
    };

    await fetch("/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(song),
    });

    spotifySearch.value = "";
    searchResults.classList.add("hidden");
    searchResults.innerHTML = "";
    fetchSongs();
}

// --- Manual Add Toggle ---

let manualOpen = false;

manualToggle.addEventListener("click", () => {
    manualOpen = !manualOpen;
    songForm.classList.toggle("hidden", !manualOpen);
    toggleArrow.style.transform = manualOpen ? "rotate(90deg)" : "rotate(0deg)";
});

// --- Song CRUD ---

async function fetchSongs() {
    const res = await fetch("/songs");
    const songs = await res.json();
    renderSongs(songs);
}

function renderSongs(songs) {
    songList.innerHTML = "";

    if (songs.length === 0) {
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");

    songs.forEach((song) => {
        const card = document.createElement("div");
        card.className =
            "bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4 shadow-md";

        const albumArt = song.album_art
            ? `<img src="${song.album_art}" alt="Album art" class="w-14 h-14 rounded-lg object-cover shrink-0">`
            : `<div class="w-14 h-14 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                   <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                   </svg>
               </div>`;

        const listenedBadge = song.listened
            ? `<span class="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Listened</span>`
            : `<span class="text-xs bg-gray-700/50 text-gray-400 px-2 py-0.5 rounded-full">Not listened</span>`;

        card.innerHTML = `
            ${albumArt}
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-base font-semibold text-gray-100 truncate">${song.title}</h3>
                    ${listenedBadge}
                </div>
                <p class="text-sm text-gray-400 truncate">
                    ${song.artist}${song.album ? ` \u00b7 ${song.album}` : ""} \u00b7 ${song.year} \u00b7 ${song.genre}
                </p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <button onclick="toggleListened(${song.id}, ${!song.listened})"
                    class="text-xs px-3 py-1.5 rounded-lg border transition
                    ${song.listened
                        ? "border-gray-600 text-gray-400 hover:border-gray-500"
                        : "border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                    }">
                    ${song.listened ? "Mark Unlistened" : "Mark Listened"}
                </button>
                <button onclick="deleteSong(${song.id})"
                    class="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition">
                    Delete
                </button>
            </div>
        `;

        songList.appendChild(card);
    });
}

songForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const song = {
        title: document.getElementById("title").value,
        artist: document.getElementById("artist").value,
        album: document.getElementById("album").value || null,
        year: parseInt(document.getElementById("year").value),
        genre: document.getElementById("genre").value,
        listened: document.getElementById("listened").checked,
    };

    await fetch("/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(song),
    });

    songForm.reset();
    fetchSongs();
});

async function toggleListened(id, listened) {
    const res = await fetch("/songs");
    const songs = await res.json();
    const song = songs.find((s) => s.id === id);
    if (!song) return;

    await fetch(`/songs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...song, listened }),
    });

    fetchSongs();
}

async function deleteSong(id) {
    await fetch(`/songs/${id}`, { method: "DELETE" });
    fetchSongs();
}

fetchSongs();
