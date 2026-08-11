import { Router } from 'express';
import jwt from 'jsonwebtoken';
import books from "./booksdb.js";
const regd_users = Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(user => user.username === username && user.password == password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(users);
  if (!username || !password) return res.status(400).json({"message": "invalid username/password"});
  if (!isValid(username)) return res.status(403).json({"message": "user not registered"});
  if (!authenticatedUser(username, password)) return res.status(403).json({"message": "invalid password"});
  const token = jwt.sign({
    data: password
  }, "access", {expiresIn: 60 * 60});

  req.session.authorization = {
    token, username
  }
  return res.status(200).json({"message": "login success"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const book = books[isbn];
  if (!book) return res.status(404).json({message: "book not found"});
  if (!review) return res.status(400).json({"message": "invalid review"});
  book.reviews[req.session.authorization.username] = review;
  return res.status(200).json({message: "review posted"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  const username = req.session.authorization.username;

  if (!book) return res.status(404).json({message: "book not found"});
  const review = book.reviews[username];
  if (!review) return res.status(404).json({message: "no review"});

  delete book.reviews[username];
  return res.status(200).json({message: "review deleted", "reviews": book.reviews});
});

export const authenticated = regd_users;
const _isValid = isValid;
export { _isValid as isValid };
const _users = users;
export { _users as users };
