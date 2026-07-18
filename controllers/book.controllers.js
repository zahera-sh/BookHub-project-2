const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in");
const User = require("../models/user.js");
const Book = require("../models/book.js");



router.get("/", async (req, res) => {
    const allBooks = await Book.find()
    res.render("book/all-books.ejs", {books: allBooks});
});

router.get("/:id", async (req, res) => {
    console.log(req.params.id)
    const foundBook = await Book.findById(req.params.id)
    res.render("book/book-details.ejs", {book: foundBook})
});

router.get("/new", isSignedIn, (req, res) => {
    res.render("book/new-book.ejs")
})



module.exports = router;