const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in");
const User = require("../models/user.js");
const Book = require("../models/book.js");
const Library = require("../models/library.js");


router.get("/", isSignedIn, async (req, res) => {
    const mylibrary = await Library.find({ user: req.session.user._id }).populate("book")
    res.render("mylibrary/index.ejs", { mylibrary })
});

router.post("/:bookId", isSignedIn, async (req, res) => {

    try {

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
    }

    catch (err) {
        console.log("Error:", err);
    }
});

router.get("/:id/edit", isSignedIn, async (req, res) => {
    const myBookEdit = await Library.findById(req.params.id)
        .populate({
            path: "book",
            populate: [
                { path: "authors" },
                { path: "genres" }
            ]
        })

    res.render("mylibrary/edit-my-book.ejs", { myBookEdit })
});

router.put("/:id/edit", isSignedIn, async (req, res) => {
    await Library.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
        dateStarted: req.body.dateStarted,
        dateFinished: req.body.dateFinished,
        notes: req.body.notes,
    })

    res.redirect("/mylibrary");
});

router.delete("/:id", isSignedIn, async (req, res) => {
    await Library.findByIdAndDelete(req.params.id)
    res.redirect("/mylibrary")
});

router.post("/:id/favorite", isSignedIn, async (req, res) => {
    const library = await Library.findById(req.params.id)
    library.isFavorited = !library.isFavorited

    await library.save()

    res.redirect("/mylibrary")
});

router.post("/:id/finish", isSignedIn, async (req, res) => {
    const library = await Library.findById(req.params.id)
    library.isFinished = !library.isFinished

    await library.save()

    res.redirect("/mylibrary")
});


module.exports = router;