const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      // Removed required/unique for Campus One integration compatibility
      // as we might only have a userId initially.
    },
    password: {
      type: String,
      // Removed required for Campus One integration.
    },
    role: {
      type: String,
      enum: ["candidate", "interviewer", "admin"],
      default: "candidate",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },
    location: {
      type: String,
      default: "",
    },
    githubUrl: {
      type: String,
      default: "",
    },
    linkedinUrl: {
      type: String,
      default: "",
    },
    websiteUrl: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);