const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const Author = require("../models/Author.js");
const Book = require("../models/Book.js");
const Library = require("../models/Library");
const Review = require("../models/Review");


router.get("/", isSignedIn, async (req, res) => {

    const user = await User.findById(req.session.user._id);
    const following = await Author.find({ followers: req.session.user._id });
    const liked = await Book.find({ likes: req.session.user._id });
    const booksAdded = await Book.find({ createdBy: req.session.user._id });
    const authorsAdded = await Author.find({ createdBy: req.session.user._id });
    const libraryCount = await Library.find({ user: req.session.user._id });
    const reviewCount = await Review.find({ user: req.session.user._id });

    res.render("user/dashboard.ejs", { user, following, liked, booksAdded, authorsAdded, libraryCount, reviewCount });
});


router.post("/change-password", isSignedIn, async (req, res) => {

    try {

        const user = await User.findById(req.session.user._id);

        const isMatch = bcrypt.compareSync(req.body.currentPassword, user.password);

        if (!isMatch) {
            return res.send("Current password is incorrect.");
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.send("Passwords must match.");
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;

        await User.findByIdAndUpdate
            (req.session.user._id, { password: hashedPassword });

        res.redirect("/dashboard");
    }

    catch (err) {

        res.send(err.message);

    }

});


router.put("/:id/delete", isSignedIn, async (req, res) => {

    if (req.params.id !== req.session.user._id.toString()) {
        return res.send("Unauthorized.");
    }

    await User.findByIdAndUpdate(req.session.user._id, { isDeleted: true, deletedAt: new Date() });
    req.session.destroy();

    res.redirect("/");
});


router.get("/:id/confirm-delete", isSignedIn, async (req, res) => {

    if (req.params.id !== req.session.user._id.toString()) {
        return res.send("Unauthorized.");
    }

    const foundUser = await User.findById(req.params.id);
    res.render("user/delete-user.ejs", { user: foundUser });
});


module.exports = router;