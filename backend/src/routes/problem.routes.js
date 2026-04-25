const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware.js");
const {
  getAllProblems,
  getProblemById,
  getProblemStats,
} = require("../controllers/problem.controller.js");



router.get("/", authMiddleware, getAllProblems);
router.get("/:id/stats", getProblemStats);
router.get("/:id", getProblemById);





module.exports = router;