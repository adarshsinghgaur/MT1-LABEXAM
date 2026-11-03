import express from "express";

const app = express();

app.use(express.json());

// Sample Books
let books = [
  {
    id: 1,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 350,
    category: "Fiction",
  },
  {
    id: 2,
    title: "Wings of Fire",
    author: "A.P.J. Abdul Kalam",
    price: 250,
    category: "Biography",
  },
  {
    id: 3,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    price: 400,
    category: "Finance",
  },
];

// GET - All Books
app.get("/books", (req, res) => {
  res.status(200).json(books);
});

// GET - Book by ID
app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.json(book);
});

// POST - Add New Book
app.post("/books", (req, res) => {
  const { title, author, price, category } = req.body;
  const id = books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1;

  if (
    !title ||
    !author ||
    price === undefined ||
    !category
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (books.some((b) => b.id === Number(id))) {
    return res.status(400).json({
      message: "Book ID already exists",
    });
  }

  const newBook = {
    id: Number(id),
    title,
    author,
    price: Number(price),
    category,
  };

  books.push(newBook);

  res.status(201).json({
    message: "Book added successfully",
    book: newBook,
  });
});

// PUT - Update Book
app.put("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const { title, author, price, category } = req.body;

  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (price !== undefined) book.price = Number(price);
  if (category !== undefined) book.category = category;

  res.json({
    message: "Book updated successfully",
    book,
  });
});

// DELETE - Delete Book
app.delete("/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  const deletedBook = books.splice(index, 1);

  res.json({
    message: "Book deleted successfully",
    book: deletedBook[0],
  });
});

// Start Server
app.listen(4000, () => {
  console.log("Express Server running at http://localhost:4000");
});
