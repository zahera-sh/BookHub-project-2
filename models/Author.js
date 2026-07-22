const mongoose = require("mongoose");



const authorSchema = new mongoose.Schema({

    authorName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        unique: true,
    },

    fullName: {
        type: String,
        trim: true,
    },

    profilePhoto: {
        type: String,
        default: "default-photo.jpg",
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

    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

}, { timestamps: true });



const Author = mongoose.model("Author", authorSchema);

module.exports = Author;