const mongoose = require("mongoose");



const librarySchema = new mongoose.Schema({

    Username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    title: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
    },

    status: {
        type: String,
        enum: [
            "Want to Read",
            "Reading",
            "Finished",
            "Dropped"
        ],
    },

    dateAdded: {
        type: Date,
    },

    dateStarted: {
        type: Date,
    },

    dateFinished: {
        type: Date,
    },

    notes: {
        type: String,
        trim: true,
    },

    isFavorited: {
        type: Boolean,
        default: true,
    },

    isFinished: {
        type: Boolean,
    },

}, { timestamps: true });



const Library = mongoose.model("Library", librarySchema);

module.exports = Library;