const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");



router.get("/", isSignedIn, async (req, res) => {
    const user = await User.findById(req.session.user._id);
    res.render("user/dashboard.ejs", {user});
});

router.post("/change-password", async (req, res) => {

    if (req.body.password !== req.body.confirmPassword) {
      return res.send("Passwords must match.");
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    const user = await User.findByIdAndUpdate
    (req.session.user._id, {password: hashedPassword,});

    res.redirect("/dashboard");

});

router.delete("/", async (req, res) => {
    await User.findByIdAndDelete(req.session.user._id);
    req.session.destroy();
    res.redirect("/");
});



module.exports = router;