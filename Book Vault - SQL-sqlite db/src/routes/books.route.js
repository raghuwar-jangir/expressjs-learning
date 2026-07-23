const booksRouter = require("express").Router();

const createHttpError = require("http-errors");
const booksController = require("../controllers/books.controller");
const { validate } = require("../middlewares/validate.middleware");
const { findBookById } = require("../services/books.service");
const { createBookSchema } = require("../validators/book.validator");

booksRouter.param("id", (req, res, next, id) => {
  try {
    const book = findBookById(id);
    if (!book) {
      return next(
        createHttpError(404, "Book not found", {
          code: "NOT_FOUND",
        }),
      );
    }
    req.book = book;
    next();
  } catch (error) {
    next(error);
  }
});

booksRouter.get("/", booksController.getAllBooks);
booksRouter.post("/", validate(createBookSchema), booksController.addBook);
booksRouter.get("/search", booksController.searchBookByTitle);
booksRouter.get("/:id", booksController.getBook);
booksRouter.delete("/:id", booksController.removeBook);

module.exports = booksRouter;
