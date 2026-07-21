const bookRepository = require("../repositories/book.repository");

const findAllBooks = (req, res, next) => {
  return bookRepository.findAll();
};

const createBook = (req, res, next) => {};
const updateBook = (req, res, next) => {};
const deleteBook = (req, res, next) => {};
const findBookByTitle = (req, res, next) => {};
const topRatedBooks = (req, res, next) => {};

module.exports = {
  findAllBooks,
  createBook,
  updateBook,
  deleteBook,
  findBookByTitle,
  topRatedBooks,
};
