const songForm = document.getElementById("song-form");
const songList = document.getElementById("song-list");
const emptyState = document.getElementById("empty-state");

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
            "bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between shadow-md";

        const listenedBadge = song.listened
            ? `<span class="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Listened</span>`
            : `<span class="text-xs bg-gray-700/50 text-gray-400 px-2 py-0.5 rounded-full">Not listened</span>`;

        card.innerHTML = `
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-base font-semibold text-gray-100 truncate">${song.title}</h3>
                    ${listenedBadge}
                </div>
                <p class="text-sm text-gray-400 truncate">
                    ${song.artist}${song.album ? ` &middot; ${song.album}` : ""} &middot; ${song.year} &middot; ${song.genre}
                </p>
            </div>
            <div class="flex items-center gap-2 ml-4 shrink-0">
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
