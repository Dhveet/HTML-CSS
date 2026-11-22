const genreSelect = document.getElementById("genreSelect");
const movieGrid = document.getElementById("movieGrid");
const statusEl = document.getElementById("status");

let allShows = [];

function renderShows(genre) {
    movieGrid.innerHTML = "";

    const filtered = genre === "All"
        ? allShows.slice(0, 12)
        : allShows.filter(show => show.genres.includes(genre)).slice(0, 12);

    if (filtered.length === 0) {
        statusEl.textContent = "No movies found for this genre.";
        return;
    }

    statusEl.textContent = `Showing ${filtered.length} titles for "${genre}"`;

    filtered.forEach(show => {
        const card = document.createElement("article");
        card.className = "movie-card";
        const imgUrl = show.image ? show.image.medium : "https://via.placeholder.com/210x280?text=No+Image";
        const rating = show.rating.average || "N/A";

        card.innerHTML = `
            <img src="${imgUrl}" alt="${show.name}">
            <div class="movie-info">
                <h3>${show.name}</h3>
                <p class="rating">★ ${rating}</p>
                <p>${show.genres.join(", ")}</p>
            </div>
        `;
        movieGrid.appendChild(card);
    });
}

async function loadMovies() {
    statusEl.textContent = "Loading movies from API...";
    try {
        const res = await fetch("https://api.tvmaze.com/shows");
        if (!res.ok) throw new Error("API request failed.");
        allShows = await res.json();

        // Retrieve saved genre from Local Storage
        const savedGenre = localStorage.getItem("preferredGenre") || "All";
        genreSelect.value = savedGenre;
        renderShows(savedGenre);
    } catch (error) {
        statusEl.textContent = `Error: ${error.message}`;
    }
}

genreSelect.addEventListener("change", () => {
    const selectedGenre = genreSelect.value;
    localStorage.setItem("preferredGenre", selectedGenre);
    renderShows(selectedGenre);
});

loadMovies();