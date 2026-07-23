// validators/books.validator.js
const { z } = require("zod");

const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  price: z.number().min(0, "Price must be at least 0").optional(),
  rating: z.number().int().min(1).max(5).optional(),
  pages: z.number().int().positive("Pages must be greater than 0"),
  publish_year: z
    .number()
    .int()
    .positive("Publish year must be greater than 0"),
});

const updateBookSchema = createBookSchema.partial();
// .partial() makes every field optional — update requests may send only the fields changing

module.exports = { createBookSchema, updateBookSchema };
