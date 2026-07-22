const mongoose = require("mongoose");



const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    authors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
    }],

    publishedDate: {
        type: Date,
        required: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
        minLength: 30,
        maxLength: 500,
    },

    genres: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
    }],

    pageCount: {
        type: Number,
        min: 1,
    },

    coverPhoto: {
        type: String,
        default: "default-cover.jpg",
    },

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

}, { timestamps: true });



const Book = mongoose.model("Book", bookSchema);

module.exports = Book;