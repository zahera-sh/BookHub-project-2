const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^[a-zA-Z0-9]{3,12}$/, "Username must be alphanumeric and 3-16 characters long"],
  },

  password: {
    type: String,
    required: true,
    minLength: 8,
  },

  gender: {
    type: String,
    enum: ["F", "M"],
    required: true,
  },

  profilePhoto: {
    type: String,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });



const User = mongoose.model("User", userSchema);

module.exports = User;