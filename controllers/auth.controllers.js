const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");


router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {

  try {

    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.send("Username already taken.");
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.send("Passwords must match.");
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    const profilePhoto =
      req.body.gender === "M"
        ? "/images/main/profile-photo-male.png"
        : "/images//main/profile-photo-female.png";

    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      gender: req.body.gender,
      profilePhoto,
    });

    res.redirect("/auth/sign-in");

  }

  catch (err) {

    res.send(err.message);
    
  }

});


router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});

router.post("/sign-in", async (req, res) => {

  const userInDatabase = await User.findOne({ username: req.body.username });
  if (!userInDatabase || userInDatabase.isDeleted) {
    return res.send("Login failed. Please try again.");
  }

  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  );

  if (!validPassword) {
    return res.send("Login failed. Please try again.");
  }

  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  };

  res.redirect("/dashboard");
});

router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});


module.exports = router;