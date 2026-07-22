const mongoose = require("mongoose");



const reviewSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },

    spoilers: {
        type: Boolean,
        default: false,
    },

    reviewTitle: {
        type: String,
        minlength: 5,
        maxlength: 100,
        trim: true,
        required: true,
    },

    reviewBody: {
        type: String,
        minlength: 10,
        maxlength: 500,
        trim: true,
        required: true,
    },

}, { timestamps: true });


reviewSchema.index(
    { user: 1, book: 1 },
    { unique: true }
);


const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;