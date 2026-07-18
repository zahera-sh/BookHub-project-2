const router = require("express").Router();
const Author = require("../models/author.js");



router.get("/", async (req, res) => {
    const allAuthors = await Author.find()
    res.render("author/all-authors.ejs", { authors: allAuthors });
});

router.get("/:id", async (req, res) => {
    console.log(req.params.id)
    const foundAuthor = await Author.findById(req.params.id)
    res.render("author/author-details.eejs", { author: foundAuthor })
});





module.exports = router;