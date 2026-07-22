const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in.js");
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

    res.render("author/author-details.ejs", { author: foundAuthor, booksByAuthor });
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


module.exports = router;