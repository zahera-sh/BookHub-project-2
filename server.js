const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const session = require("express-session");
const methodOverride = require("method-override");
const {MongoStore} = require("connect-mongo");
const connectToDB = require("./db.js");


const dns = require("dns");
const console = require("console");
dns.setServers(["8.8.8.8", "1.1.1.1"]);


const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");


const authController = require("./controllers/auth.controllers.js");
const userController = require("./controllers/user.controllers.js");
const indexController = require("./controllers/index.controllers.js");
const bookController = require("./controllers/book.controllers.js");
const authorController = require("./controllers/author.controllers.js");
const mylibraryController = require("./controllers/mylibrary.controllers.js");
const reviewController = require("./controllers/review.controllers.js");


app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,

    store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions"
    }),

    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use(passUserToView);


app.use("/auth", authController);
app.use("/dashboard", userController);
app.use("/valley", bookController);
app.use("/authors", authorController);
app.use("/mylibrary", mylibraryController);
app.use("/reviews", reviewController);
app.use("/", indexController);

app.use((req, res, next) => {
    res.status(404)
    res.render("404.ejs")
});


async function startServer() {
    const PORT = process.env.PORT || 3000;
    await connectToDB();

    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
}

startServer();