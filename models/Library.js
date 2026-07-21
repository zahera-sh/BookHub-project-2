const mongoose = require("mongoose");



const librarySchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
    },

    status: {
        type: String,
        enum: [
            "Want to Read",
            "Reading",
            "Finished",
            "Dropped",
        ],
        default: "Reading",
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
        default: false,
    },

    isFinished: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true });


librarySchema.index(
    { user: 1, book: 1 },
    { unique: true }
);


const Library = mongoose.model("Library", librarySchema);

module.exports = Library;