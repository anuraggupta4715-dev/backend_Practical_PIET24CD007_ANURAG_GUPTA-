
const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Book");

const router = express.Router();

// POST - Add Book
router.post("/", async (req, res, next) => {
    try {
        const book = await Book.create(req.body);

        res.status(201).json({
            message: "Book added successfully",
            book
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }
        next(error);
    }
});

// GET - All Books
router.get("/", async (req, res, next) => {
    try {
        const books = await Book.find();

        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
});

// GET - Book by ID
router.get("/:id", async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid Book ID"
            });
        }

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
});

// PUT - Update Book
router.put("/:id", async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid Book ID"
            });
        }

        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Book updated successfully",
            book
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }
        next(error);
    }
});

// DELETE - Delete Book
router.delete("/:id", async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid Book ID"
            });
        }

        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Book deleted successfully"
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
