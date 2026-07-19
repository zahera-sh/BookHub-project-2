const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");



router.get("/", isSignedIn, async (req, res) => {
    const user = await User.findById(req.session.user._id);
    res.render("user/dashboard.ejs", { user });
});


router.post("/change-password", isSignedIn, async (req, res) => {

    try {

        if (req.body.password !== req.body.confirmPassword) {
            return res.send("Passwords must match.");
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;

        const user = await User.findByIdAndUpdate
            (req.session.user._id, { password: hashedPassword, });

        res.redirect("/dashboard");
    }

    catch (err) {

        res.send(err.message);

    }

});

router.put("/updateIsDeleted/:id", isSignedIn, async (req, res) => {
    await User.findByIdAndUpdate(req.session.user._id, { isDeleted: true });
        req.session.destroy();

    res.redirect("/");
});

router.get("/:id/confirm-delete", isSignedIn, async (req, res) => {
    console.log(req.params.id)
    const foundUser = await User.findById(req.params.id)
    res.render("user/delete-user.ejs")
});



module.exports = router;