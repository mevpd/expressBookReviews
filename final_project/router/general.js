import { Router } from 'express';
import books from "./booksdb.js";
import { isValid } from "./auth_users.js";
import { users } from "./auth_users.js";
const public_users = Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) return res.status(400).json({"message": "invalid username/password"});
  if (isValid(username)) return res.status(403).json({"message": "user already registered"});
  users.push({"username": username, "password": password});
  return res.status(200).json({"message": "registered"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) return res.status(200).json(books[isbn]);
  else return res.status(404).json({"message": "book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const books_found = Object.values(books).filter(value => value["author"] === author);
  if (books_found.length >= 1) return res.status(200).json(books_found);
  else return res.status(404).json({"message": "invalid author"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const books_found = Object.values(books).filter(value => value["title"] === title);
  if (books_found.length >= 1) return res.status(200).json(books_found);
  else return res.status(404).json({"message": "invalid title"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) return res.status(200).json(book["reviews"]);
  else return res.status(400).json({"message": "invalid isbn"});
});

export const general = public_users;
