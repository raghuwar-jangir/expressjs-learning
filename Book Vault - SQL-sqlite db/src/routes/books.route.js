const booksRouter = require("express").Router();

const booksController = require("../controllers/books.controller");

booksRouter.get("/", booksController.getAllBooks);

module.exports = booksRouter;
