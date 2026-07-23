const bookRepository = require("../repositories/book.repository");
const { generateNewId } = require("../utils/id.util");

const findAllBooks = () => {
  return bookRepository.findAll();
};

const createBook = (bookBody) => {
  const id = generateNewId();

  bookRepository.insert(
    id,
    bookBody.title,
    bookBody.author,
    bookBody.price,
    bookBody.rating,
    bookBody.pages,
    bookBody.publish_year,
  );

  return bookRepository.findById(id);
};

const findBookByTitle = (title) => {
  return bookRepository.findByTitle(title);
};

const findBookById = (id) => {
  return bookRepository.findById(id);
};

const deleteBook = (id) => {
  bookRepository.deleteById(id);
};
// const updateBook = (req, res, next) => {};
// const topRatedBooks = (req, res, next) => {};

module.exports = {
  findAllBooks,
  createBook,
  //   updateBook,
  deleteBook,
  findBookByTitle,
  //   topRatedBooks,
  findBookById,
};
