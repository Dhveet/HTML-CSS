const newsContainer = document.getElementById("newsContainer");
const statusEl = document.getElementById("status");
const timerText = document.getElementById("timerText");
const refreshBtn = document.getElementById("refreshBtn");

const REFRESH_SECONDS = 15;
let countdown = REFRESH_SECONDS;

async function fetchNews() {
    statusEl.textContent = "Fetching latest headlines...";
    const randomSkip = Math.floor(Math.random() * 20);

    try {
        const res = await fetch(`https://dummyjson.com/posts?limit=6&skip=${randomSkip}`);
        if (!res.ok) throw new Error("Failed to load news feed.");
        const data = await res.json();

        newsContainer.innerHTML = "";
        data.posts.forEach(post => {
            const card = document.createElement("article");
            card.className = "news-card";
            card.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.body.substring(0, 120)}...</p>
                <div class="tags">Tags: ${post.tags.join(", ")}</div>
            `;
            newsContainer.appendChild(card);
        });

        statusEl.textContent = `Last updated at: ${new Date().toLocaleTimeString()}`;
        countdown = REFRESH_SECONDS;
    } catch (error) {
        statusEl.textContent = `Error: ${error.message}`;
    }
}

// Auto-refresh timer using setInterval
setInterval(() => {
    countdown--;
    if (countdown <= 0) {
        fetchNews();
    }
    timerText.textContent = `Next refresh in: ${countdown}s`;
}, 1000);

refreshBtn.addEventListener("click", fetchNews);

// Initial load
fetchNews();