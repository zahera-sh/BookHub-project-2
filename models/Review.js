const mongoose = require("mongoose");



const reviewSchema = new mongoose.Schema({

    Username: {
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
        min: 10,
        max: 100,
        required: true,
    },

    reviewBody: {
        type: String,
        min: 10,
        max: 500,
        required: true,
    },

}, { timestamps: true });



const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;