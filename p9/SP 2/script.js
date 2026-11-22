const bookForm = document.getElementById("bookForm");
const statusEl = document.getElementById("status");
const bookGrid = document.getElementById("bookGrid");

bookForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = document.getElementById("queryInput").value.trim();
    if (!query) return;

    statusEl.textContent = "Searching Open Library API...";
    bookGrid.innerHTML = "";

    try {
        const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12`);
        if (!res.ok) throw new Error(`API returned status ${res.status}`);
        const data = await res.json();

        if (!data.docs || data.docs.length === 0) {
            statusEl.textContent = "No books found for your search.";
            return;
        }

        statusEl.textContent = `Showing top ${data.docs.length} results for "${query}"`;

        data.docs.forEach(book => {
            const coverUrl = book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : "https://via.placeholder.com/120x175?text=No+Cover";
            const author = book.author_name ? book.author_name[0] : "Unknown Author";
            const year = book.first_publish_year || "N/A";

            const card = document.createElement("article");
            card.className = "book-card";
            card.innerHTML = `
                <img src="${coverUrl}" alt="${book.title}">
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${author}</p>
                <p><strong>First Published:</strong> ${year}</p>
            `;
            bookGrid.appendChild(card);
        });
    } catch (err) {
        statusEl.textContent = `Error: ${err.message}`;
    }
});