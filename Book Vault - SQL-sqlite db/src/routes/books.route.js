const booksRouter = require("express").Router();

const booksController = require("../controllers/books.controller");
const { validate } = require("../middlewares/validate.middleware");
const { createBookSchema } = require("../validators/book.validator");

booksRouter.get("/", booksController.getAllBooks);
booksRouter.post("/", validate(createBookSchema), booksController.addBook);

module.exports = booksRouter;
