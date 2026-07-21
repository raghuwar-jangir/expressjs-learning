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

const addBook = (req, res, next) => {};
const updateBookDetails = (req, res, next) => {};
const removeBook = (req, res, next) => {};
const searchBookByTitle = (req, res, next) => {};
const topRatedBooks = (req, res, next) => {};

module.exports = {
  getAllBooks,
  addBook,
  updateBookDetails,
  removeBook,
  searchBookByTitle,
  topRatedBooks,
};
