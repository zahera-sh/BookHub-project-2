const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in");
const multer = require("multer")
const path = require("path");
const storage = multer.diskStorage({
    destination: "public/images",
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage: storage });
const User = require("../models/user.js");
const Book = require("../models/book.js");
const Author = require("../models/author.js");
const Genre = require("../models/genre.js");



router.get("/", async (req, res) => {
    const allBooks = await Book.find()
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
                : undefined;

            const createdBook = await Book.create({
                title: req.body.title,
                authors: req.body.authors,
                publishedDate: req.body.publishedDate,
                description: req.body.description,
                genres: req.body.genres,
                pageCount: req.body.pageCount,
                coverPhoto,
            })

            console.log(createdBook._id)
            res.redirect("/valley")
        }
    }

    catch (err) {
        console.log("Error", err)
    }
});

router.get("/:id", async (req, res) => {
    console.log(req.params.id)
    const foundBook = await Book.findById(req.params.id).populate('genres authors')
    res.render("book/book-details.ejs", { book: foundBook })
});

router.post("/like/:id", isSignedIn, async (req, res) => {
    const foundBook = await Book.findById(req.params.id)
    foundBook.likes.push(req.session.user._id)
    foundBook.save()
    res.redirect(`/valley/${foundBook._id}`)
});

router.post("/:id/dislike", isSignedIn, async (req, res) => {
    const foundBook = await Book.findById(req.params.id)
    const allIdsButMyId = foundBook.likes.filter((oneId) => !oneId.equals(req.session.user._id))
    foundBook.likes = allIdsButMyId
    foundBook.save()
    res.redirect("/valley/" + foundBook._id)
});



module.exports = router;