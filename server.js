// imports
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const session = require("express-session");
const methodOverride = require("method-override");
const {MongoStore} = require("connect-mongo");
const connectToDB = require("./db.js");


// import middleware
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");


// import controller
const authController = require("./controllers/auth.controllers.js");
const indexController = require("./controllers/index.controllers.js");



// middleware
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
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);

app.use(passUserToView);



// routes
app.use("/auth", authController);
app.use("/", indexController);



// listen on Port 3000
async function startServer() {
    const PORT = process.env.PORT || 3000;
    await connectToDB();

    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
}

startServer();