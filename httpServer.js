import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let books = [
  {
    id: 1,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 350,
  },
  {
    id: 2,
    title: "Wings of Fire",
    author: "A.P.J. Abdul Kalam",
    price: 250,
  },
  {
    id: 3,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    price: 400,
  },
];

const server = http.createServer((req, res) => {
  // Home Route
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome to Library Management System</h1>");
  }

  // Get All Books
  else if (req.method === "GET" && req.url === "/books") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(books));
  }

  // About Route
  else if (req.method === "GET" && req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h2>Library Management Application using Node.js</h2>");
  }

  // Serve HTML using FS Module
  else if (req.method === "GET" && req.url === "/home") {
    const filePath = path.join(__dirname, "public", "index.html");

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error reading HTML file");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  }

  // Add New Book
  else if (req.method === "POST" && req.url === "/add-book") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const newBook = JSON.parse(body);

        if (
          newBook.id === undefined ||
          !newBook.title ||
          !newBook.author ||
          newBook.price === undefined
        ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "All fields are required" }));
          return;
        }

        books.push(newBook);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Book added successfully",
            book: newBook,
          }),
        );
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON data" }));
      }
    });
  }

  // Invalid Route
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Page Not Found");
  }
});

server.listen(3000, () => {
  console.log("HTTP Server running at http://localhost:3000");
});
