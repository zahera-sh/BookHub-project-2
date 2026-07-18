const router = require("express").Router();
const Author = require("../models/author.js");



router.get("/", async (req, res) => {
    const allAuthors = await Author.find()
    res.render("author/all-authors.ejs", { authors: allAuthors });
});



module.exports = router;