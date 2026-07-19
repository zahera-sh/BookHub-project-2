const connectToDB = require('./db.js');
const dotenv = require("dotenv").config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const genre = require("./models/genre.js");



const genres = [
    { genre: "Action" },
    { genre: "Adventure" },
    { genre: "Art" },
    { genre: "Autobiography" },
    { genre: "Biography" },
    { genre: "Business" },
    { genre: "Children" },
    { genre: "Classic" },
    { genre: "Comic" },
    { genre: "Contemporary" },
    { genre: "Cookbook" },
    { genre: "Crime" },
    { genre: "Drama" },
    { genre: "Dystopian" },
    { genre: "Education" },
    { genre: "Fantasy" },
    { genre: "Fiction" },
    { genre: "Graphic Novel" },
    { genre: "Health" },
    { genre: "Historical Fiction" },
    { genre: "History" },
    { genre: "Horror" },
    { genre: "Humor" },
    { genre: "Literary Fiction" },
    { genre: "Magic Realism" },
    { genre: "Memoir" },
    { genre: "Mystery" },
    { genre: "Mythology" },
    { genre: "Non-Fiction" },
    { genre: "Paranormal" },
    { genre: "Philosophy" },
    { genre: "Poetry" },
    { genre: "Politics" },
    { genre: "Psychology" },
    { genre: "Religion" },
    { genre: "Romance" },
    { genre: "Satire" },
    { genre: "Science" },
    { genre: "Science Fiction" },
    { genre: "Self-Help" },
    { genre: "Short Stories" },
    { genre: "Spirituality" },
    { genre: "Sports" },
    { genre: "Suspense" },
    { genre: "Technology" },
    { genre: "Thriller" },
    { genre: "Travel" },
    { genre: "True Crime" },
    { genre: "War" },
    { genre: "Western" },
    { genre: "Young Adult" }
];



async function seed() {
    await connectToDB()
    await genre.insertMany(genres)
    console.log("DB Seeded")
}

seed()