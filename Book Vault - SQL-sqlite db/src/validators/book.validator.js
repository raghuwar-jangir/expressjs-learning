// validators/books.validator.js
const { z } = require("zod");

const createBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  price: z.number().min(0).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  pages: z.number().int().positive(),
  publish_year: z.number().int().positive(),
});

const updateBookSchema = createBookSchema.partial();
// .partial() makes every field optional — update requests may send only the fields changing

module.exports = { createBookSchema, updateBookSchema };
