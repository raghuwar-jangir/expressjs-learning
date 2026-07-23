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
    return sendResponse(
      res,
      200,
      books,
      "Books found with title containing query",
    );
  } catch (error) {
    return next(error);
  }
};

const getBook = (req, res, next) => {
  try {
    return sendResponse(res, 200, req.book, "Book Found");
  } catch (error) {
    return next(error);
  }
};

const removeBook = (req, res, next) => {
  try {
    booksService.deleteBook(req.book.id);
    return sendResponse(res, 204, null, "Book deleted Successfully");
  } catch (error) {
    return next(error);
  }
};

const updateBookDetails = (req, res, next) => {
  try {
    const book = booksService.updateBook(req.book.id, req.body);
    return sendResponse(res, 200, book, "Book details updated success fully");
  } catch (error) {
    return next(error);
  }
};
const topRatedBooks = (req, res, next) => {
  try {
    const books = booksService.topRatedBooks();
    return sendResponse(res, 200, books, "There are the top rated books");
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllBooks,
  addBook,
  getBook,
  updateBookDetails,
  removeBook,
  searchBookByTitle,
  topRatedBooks,
};
