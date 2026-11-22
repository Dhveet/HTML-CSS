const bookForm = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");

// Load all books from REST API
async function loadBooks() {
  const response = await fetch("/api/books");
  const books = await response.json();

  bookList.innerHTML = "";

  books.forEach((book) => {
    const row = document.createElement("tr");

    // Using textContent prevents XSS attacks
    const titleCell = document.createElement("td");
    titleCell.textContent = book.title;

    const authorCell = document.createElement("td");
    authorCell.textContent = book.author;

    const yearCell = document.createElement("td");
    yearCell.textContent = book.year;

    const actionCell = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-danger btn-sm";
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteBook(book.id);
    actionCell.appendChild(delBtn);

    row.appendChild(titleCell);
    row.appendChild(authorCell);
    row.appendChild(yearCell);
    row.appendChild(actionCell);

    bookList.appendChild(row);
  });
}

// Add a new book
bookForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const year = document.getElementById("year").value;

  // Client-side validation
  if (!title || !author || !year) {
    alert("Please fill in all fields.");
    return;
  }

  await fetch("/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, year })
  });

  bookForm.reset();
  loadBooks();
});

// Delete a book
async function deleteBook(id) {
  await fetch("/api/books/" + id, {
    method: "DELETE"
  });
  loadBooks();
}

// Load books when page opens
loadBooks();