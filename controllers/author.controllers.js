const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in.js");
const isAdmin = require("../middleware/is-admin");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: "public/images/authors",
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage: storage });
const Author = require("../models/Author.js");
const Book = require("../models/Book.js");
const Review = require("../models/Review");
const Library = require("../models/Library");
const User = require("../models/User");


router.get("/", async (req, res) => {
    const allAuthors = await Author.find().sort({ authorName: 1 });
    res.render("author/all-authors.ejs", { authors: allAuthors });
});


router.get("/new", isSignedIn, (req, res) => {
    res.render("author/new-author.ejs");
});


router.post("/", isSignedIn, upload.single("profilePhoto"), async (req, res) => {

    try {

        const authorInDatabase = await Author.findOne({ authorName: req.body.authorName });
        if (authorInDatabase) {
            return res.send("Author already exist.");
        }

        else {
            const profilePhoto = req.file
                ? req.file.filename
                : undefined

            const createdAuthor = await Author.create({
                authorName: req.body.authorName,
                fullName: req.body.fullName,
                profilePhoto,
                birthDate: req.body.birthDate,
                deathDate: req.body.deathDate,
                nationality: req.body.nationality,
                createdBy: req.session.user._id,
            });

            res.redirect("/authors");;
        }
    }

    catch (err) {
        console.log("Error", err);
    }
});


router.get("/:id", async (req, res) => {
    const foundAuthor = await Author.findById(req.params.id);
    const booksByAuthor = await Book.find({ authors: req.params.id });
    
    const user = req.session.user
    ? await User.findById(req.session.user._id)
    : null;

    res.render("author/author-details.ejs", { author: foundAuthor, booksByAuthor, user });
});


router.post("/:id/follow", isSignedIn, async (req, res) => {
    const foundAuthor = await Author.findById(req.params.id);

    if (!foundAuthor.followers.some(id => id.equals(req.session.user._id))) {

        foundAuthor.followers.push(req.session.user._id);
    }

    await foundAuthor.save();
    res.redirect(`/authors/${foundAuthor._id}`);
});


router.post("/:id/unfollow", isSignedIn, async (req, res) => {
    const foundAuthor = await Author.findById(req.params.id);
    const allIdsButMyId = foundAuthor.followers.filter((oneId) => !oneId.equals(req.session.user._id));

    foundAuthor.followers = allIdsButMyId

    await foundAuthor.save();
    res.redirect("/authors/" + foundAuthor._id);
});


router.delete("/:id", isSignedIn, isAdmin, async (req, res) => {

    try {

        await Book.updateMany(
            { authors: req.params.id },
            { $pull: { authors: req.params.id } }
        );

        const booksWithoutAuthors = await Book.find({
            authors: { $size: 0 }
        });

        const bookIds = booksWithoutAuthors.map(
            (book) => book._id
        );

        await Review.deleteMany({
            book: { $in: bookIds }
        });

        await Library.deleteMany({
            book: { $in: bookIds }
        });

        await Book.deleteMany({
            _id: { $in: bookIds }
        });

        await Author.findByIdAndDelete(req.params.id);

        res.redirect("/authors");
    }

    catch (err) {
        console.log("Error", err);
    }
});


module.exports = router;