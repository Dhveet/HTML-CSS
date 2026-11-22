const movieForm = document.getElementById("movieForm");
const statusEl = document.getElementById("status");
const movieGrid = document.getElementById("movieGrid");

movieForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = document.getElementById("movieInput").value.trim();
    if (!query) return;

    statusEl.textContent = "Fetching movie data...";
    movieGrid.innerHTML = "";

    try {
        const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const results = await res.json();

        if (results.length === 0) {
            statusEl.textContent = "No matching movies or shows found.";
            return;
        }

        statusEl.textContent = `Found ${results.length} result(s) for "${query}"`;

        results.forEach(item => {
            const show = item.show;
            const poster = show.image ? show.image.medium : "https://via.placeholder.com/240x300?text=No+Poster";
            const rating = show.rating.average ? `★ ${show.rating.average} / 10` : "Rating: N/A";
            // Strip HTML tags from API summary
            const cleanDesc = show.summary ? show.summary.replace(/<[^>]+>/g, "").substring(0, 130) + "..." : "No description available.";

            const card = document.createElement("article");
            card.className = "movie-card";
            card.innerHTML = `
                <img src="${poster}" alt="${show.name}">
                <div class="info">
                    <h3>${show.name}</h3>
                    <p class="rating">${rating}</p>
                    <p class="desc">${cleanDesc}</p>
                </div>
            `;
            movieGrid.appendChild(card);
        });
    } catch (err) {
        statusEl.textContent = `Error: ${err.message}`;
    }
});