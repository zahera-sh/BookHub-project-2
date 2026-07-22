const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: "public/images/books",
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage: storage });
const User = require("../models/User.js");
const Book = require("../models/Book.js");
const Author = require("../models/Author.js");
const Genre = require("../models/Genre.js");
const Review = require("../models/Review.js");


router.get("/", async (req, res) => {
    const allBooks = await Book.find().sort({ title: 1 });
    res.render("book/all-books.ejs", { books: allBooks });
});


router.get("/new", isSignedIn, async (req, res) => {

    try {

        const authorsList = await Author.find();
        const genresList = await Genre.find();
        res.render("book/new-book.ejs", {
            authorsList,
            genresList,
        });
    }

    catch (err) {
        console.log("Error:", err);
    }
});


router.post("/", isSignedIn, upload.single("coverPhoto"), async (req, res) => {

    try {

        const bookInDatabase = await Book.findOne({ title: req.body.title });
        if (bookInDatabase) {
            return res.send("Book already exist.");
        }

        else {
            const coverPhoto = req.file
                ? req.file.filename
                : undefined

            const createdBook = await Book.create({
                title: req.body.title,
                authors: req.body.authors,
                publishedDate: req.body.publishedDate,
                description: req.body.description,
                genres: req.body.genres,
                pageCount: req.body.pageCount,
                coverPhoto,
                createdBy: req.session.user._id,
            });

            res.redirect("/valley");
        }
    }

    catch (err) {
        console.log("Error", err);
    }
});


router.get("/:id", async (req, res) => {
    const foundBook = await Book.findById(req.params.id).populate("genres authors");
    const reviews = await Review.find({ book: req.params.id }).populate("user");

    const userReview = req.session.user
        ? await Review.findOne({ user: req.session.user._id, book: req.params.id })
        : null

    const editMode = req.query.edit

    res.render("book/book-details.ejs", { book: foundBook, reviews, user: req.session.user, userReview, editMode, });
});


router.post("/:id/like", isSignedIn, async (req, res) => {
    const foundBook = await Book.findById(req.params.id);

    if (!foundBook.likes.some(id => id.equals(req.session.user._id))) {

        foundBook.likes.push(req.session.user._id);
    }

    await foundBook.save();
    res.redirect(`/valley/${foundBook._id}`);
});


router.post("/:id/dislike", isSignedIn, async (req, res) => {
    const foundBook = await Book.findById(req.params.id);
    const allIdsButMyId = foundBook.likes.filter((oneId) => !oneId.equals(req.session.user._id));

    foundBook.likes = allIdsButMyId

    await foundBook.save();
    res.redirect("/valley/" + foundBook._id);
});


module.exports = router;