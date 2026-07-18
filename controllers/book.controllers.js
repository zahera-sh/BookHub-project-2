const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in");
const User = require("../models/user.js");
const Book = require("../models/book.js");



router.get("/", async (req, res) => {
    const allBooks = await Book.find()
    res.render("book/all-books.ejs", { books: allBooks });
});

router.get("/new", isSignedIn, (req, res) => {
    res.render("book/new-book.ejs")
});

router.post("/", isSignedIn, async (req, res) => {

    try {

        const bookInDatabase = await Book.findOne({ title: req.body.title });
        if (bookInDatabase) {
            return res.send("Book already exist.");
        }

        else {
            const coverPhoto =
                req.body.coverPhoto || undefined;

            const createdBook = await Book.create({
                title: req.body.title,
                authors: req.body.authors,
                publishedDate: req.body.publishedDate,
                description: req.body.description,
                genres: req.body.genres,
                pageCount: req.body.pageCount,
                coverPhoto,
                likes,
            })

            console.log(createdBook._id)
            res.redirect("/valley")
        }
    }

    catch (err) {
        console.log("Error", err)
    }
})

router.get("/:id", async (req, res) => {
    console.log(req.params.id)
    const foundBook = await Book.findById(req.params.id)
    res.render("book/book-details.ejs", { book: foundBook })
});



module.exports = router;