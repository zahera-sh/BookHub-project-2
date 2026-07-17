const mongoose = require("mongoose");



const authorSchema = new mongoose.Schema({

    authorName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        unique: true,
    },

    profilePhoto: {
        type: String,
        default: "/images/default-photo.jpg",
    },

    birthDate: {
        type: Date,
    },

    deathDate: {
        type: Date,
    },

    nationality: {
        type: String,
        trim: true,
    },

    booksByAuthor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
    }],

    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

}, { timestamps: true });



const Author = mongoose.model("Author", authorSchema);

module.exports = Author;