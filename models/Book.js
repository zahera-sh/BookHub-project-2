const mongoose = require("mongoose");



const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    author: {
        type: String,
        required: true,
        trim: true,
    },

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

    genre: {
        type: String,
        required: true,
    },

    pageCount: {
        type: Number,
        min: 1,
    },

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

}, { timestamps: true });



const Book = mongoose.model("Book", bookSchema);

module.exports = Book;