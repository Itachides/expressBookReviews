const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return username && username.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validUser = users.find((user) => user.username === username);
    if (validUser) {
        if (validUser.password === password) {
          return true; // Both username and password match
        }
      }
      return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ username: username }, "fingerprint_customer", { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful", token: accessToken });
} else {
    return res.status(401).json({ message: "Invalid username or password." });
}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewText = req.query.review;
  
  const username = req.user.username; 

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found for ISBN: " + isbn });
  }

  if (!reviewText) {
    return res.status(400).json({ message: "Review text is required in query parameters." });
  }

  books[isbn].reviews[username] = reviewText;

  // 4. Send a success response
  return res.status(200).json({ 
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews 
  });
 
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found for ISBN: " + isbn });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({ message: `Review for ISBN ${isbn} posted by ${username} deleted.` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
