const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in.js");
const Author = require("../models/author.js");



router.get("/", async (req, res) => {
    const allAuthors = await Author.find()
    res.render("author/all-authors.ejs", { authors: allAuthors });
});

router.get("/new", isSignedIn, (req, res) => {
    res.render("author/new-author.ejs")
});

router.post("/", isSignedIn, async (req, res) => {
    try {

        const authorInDatabase = await Author.findOne({ authorName: req.body.authorName });
        if (authorInDatabase) {
            return res.send("Author already exist.");
        }

        else {
            const profilePhoto =
                req.body.profilePhoto || undefined;

            const createdAuthor = await Author.create({
                authorName: req.body.authorName,
                profilePhoto,
                birthDate: req.body.birthDate,
                deathDate: req.body.deathDate,
                nationality: req.body.nationality,

            })

            console.log(createdAuthor._id)
            res.redirect("/authors")
        }
    }

    catch (err) {
        console.log("Error", err)
    }
});

router.get("/:id", async (req, res) => {
    console.log(req.params.id)
    const foundAuthor = await Author.findById(req.params.id)
    res.render("author/author-details.ejs", { author: foundAuthor })
});



module.exports = router;