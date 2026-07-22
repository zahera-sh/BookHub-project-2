const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const Author = require("../models/Author.js");
const Book = require("../models/Book.js");
const Library = require("../models/Library");
const Review = require("../models/Review");


router.post("/:bookId", isSignedIn, async (req, res) => {

    try {

        const existingReview = await Review.findOne({
            user: req.session.user._id,
            book: req.params.bookId,
        });

        if (existingReview) {
            return res.send("You already reviewed this book.");
        }

        else {

            await Review.create({

                user: req.session.user._id,
                book: req.params.bookId,
                rating: req.body.rating,
                spoilers: req.body.spoilers ? true : false,
                reviewTitle: req.body.reviewTitle,
                reviewBody: req.body.reviewBody,
            });
        }

        res.redirect(`/valley/${req.params.bookId}`);
    }

    catch (err) {
        console.log("Error:", err);
    }
});


router.put("/:id", isSignedIn, async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (
        review.user.toString() !== req.session.user._id.toString()) {

        return res.send("Unauthorized.");
    }

    await Review.findByIdAndUpdate(req.params.id, {

        rating: req.body.rating,
        spoilers: req.body.spoilers ? true : false,
        reviewTitle: req.body.reviewTitle,
        reviewBody: req.body.reviewBody,
    });

    res.redirect(`/valley/${review.book}`);
});


router.delete("/:id", isSignedIn, async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (
        review.user.toString() !== req.session.user._id.toString()) {

        return res.send("Unauthorized.");
    }

    await Review.findByIdAndDelete(req.params.id);

    res.redirect(`/valley/${review.book}`);
});


module.exports = router;