const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in");
const User = require("../models/user.js");
const Book = require("../models/book.js");
const Library = require("../models/library.js");


router.get("/", isSignedIn, async (req, res) => {
    const mylibrary = await Library.find({ user: req.session.user._id }).populate("book")
    console.log(mylibrary);

    res.render("mylibrary/index.ejs", { mylibrary })
});

router.post("/:bookId", isSignedIn, async (req, res) => {
    const existingBook = await Library.findOne({
        user: req.session.user._id,
        book: req.params.bookId,
    })

    if (existingBook) {
        return res.send("Book already exists in your library.")
    }

    await Library.create({
        user: req.session.user._id,
        book: req.params.bookId,
    })

    res.redirect("/mylibrary")
});


module.exports = router;