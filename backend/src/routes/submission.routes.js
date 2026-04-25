const express = require("express");
const router = express.Router();
const { createSubmission, getSubmissionHistory, getSubmissionById, runCode } = require("../controllers/submission.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

router.post("/", authMiddleware, createSubmission);
router.post("/run", authMiddleware, runCode);
router.get("/history/:problemId", authMiddleware, getSubmissionHistory);
router.get("/:submissionId", authMiddleware, getSubmissionById);
module.exports = router;