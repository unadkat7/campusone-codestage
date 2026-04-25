const express = require("express");
const cors = require("cors");
const problemRoutes = require("./routes/problem.routes.js");
const submissionRoutes = require("./routes/submission.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");

const path = require("path");
const fs = require("fs");

const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
// Serve static files from 'uploads' directory at root /uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

module.exports = app;