const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  console.log("INCOMING REQUEST:", { username, password });
  console.log("CURRENT USERS ARRAY:", users);

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (isValid(username) == false) {
    return res.status(400).json({ message: "Invalid username" })
  }
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already taken" })
  }

  users.push({ username, password });
  return res.status(201).json({ message: `${username} registered successfully` })

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  isbn = req.params.isbn;
  return res.status(200).send(JSON.stringify(books[isbn],null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorName = req.params.author;
    let booksByAuthor = [];
    const allISBNs = Object.keys(books);
    allISBNs.forEach(isbn => {
        if (books[isbn].author === authorName) {
            booksByAuthor.push({
                isbn: isbn,
                title: books[isbn].title,
                reviews: books[isbn].reviews
            });
        }
    });
    if (booksByAuthor.length > 0) {
        return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
      } else {
        return res.status(404).json({ message: "No books found for author: " + authorName });
      }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const bookName = req.params.title;
  
    let booksByTitle = [];
  
    const allISBNs = Object.keys(books);
  
    allISBNs.forEach(isbn => {
      if (books[isbn].title === bookName) {
        booksByTitle.push({
          isbn: isbn,
          author: books[isbn].author,
          reviews: books[isbn].reviews
        });
      }
    });
  
    if (booksByTitle.length > 0) {
      return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
    } else {
      return res.status(404).json({ message: "No books found for title: " + bookName });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "No books found for isbn: " + isbn});
  }
});

module.exports.general = public_users;