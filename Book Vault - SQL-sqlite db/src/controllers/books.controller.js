const booksService = require("../services/books.service");
const { sendResponse } = require("../utils/response.util");

const getAllBooks = (req, res, next) => {
  try {
    const books = booksService.findAllBooks();
    return sendResponse(res, 200, books, "Books found Successfully");
  } catch (error) {
    return next(error);
  }
};

const addBook = (req, res, next) => {
  try {
    const book = booksService.createBook(req.body);
    return sendResponse(res, 201, book, "Book added Successfully");
  } catch (error) {
    return next(error);
  }
};

const searchBookByTitle = (req, res, next) => {
  const title = req.query.title || "";
  try {
    const books = booksService.findBookByTitle(title.trim());
    sendResponse(res, 200, books, "Books found with title containing query");
  } catch (error) {
    return next(error);
  }
};

const getBook = (req, res, next) => {
  sendResponse(res, 200, req.book, "Book Found");
};

const removeBook = (req, res, next) => {
  booksService.deleteBook(req.book.id);
  sendResponse(res, 204, null, "Book deleted Successfully");
};
// const topRatedBooks = (req, res, next) => {};
// const updateBookDetails = (req, res, next) => {};

module.exports = {
  getAllBooks,
  addBook,
  getBook,
  //   updateBookDetails,
  removeBook,
  searchBookByTitle,
  //   topRatedBooks,
};
