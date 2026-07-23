const booksRouter = require("express").Router();

const createHttpError = require("http-errors");
const booksController = require("../controllers/books.controller");
const {
  validateBody,
  validateQuery,
} = require("../middlewares/validate.middleware");
const { findBookById } = require("../services/books.service");
const {
  createBookSchema,
  updateBookSchema,
  searchQuerySchema,
} = require("../validators/book.validator");

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

// static routes MUST come before /:id
booksRouter.get("/", booksController.getAllBooks);
booksRouter.post("/", validateBody(createBookSchema), booksController.addBook);
booksRouter.get(
  "/search",
  validateQuery(searchQuerySchema),
  booksController.searchBookByTitle,
);
booksRouter.get("/top_rated", booksController.topRatedBooks);
booksRouter.get("/:id", booksController.getBook);
booksRouter.delete("/:id", booksController.removeBook);
booksRouter.patch(
  "/:id",
  validateBody(updateBookSchema),
  booksController.updateBookDetails,
);

module.exports = booksRouter;
