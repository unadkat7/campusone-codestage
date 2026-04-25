const Submission = require("../models/submission.model.js");
const submissionQueue = require("../queues/submission.queue");
const { evaluateRunCode } = require("../services/evaluationService");

const createSubmission = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    const submission = await Submission.create({
      userId: req.user._id,
      problemId,
      code,
      language,
      status: "Pending",
    });

    // Push job to queue
    await submissionQueue.add("evaluate-submission", 
      {submissionId: submission._id},
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 3000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
      
    );

    return res.status(201).json({
      message: "Submission queued successfully",
      submissionId: submission._id,
      status: "Pending",
    });

  } catch (error) {
    console.error("Submission Controller Error:", error);
    return res.status(500).json({
      message: "Error creating submission",
      error: error.message
    });
  }
};

// Get submission history for a problem
const getSubmissionHistory = async (req, res) => {
  try {
    const { problemId } = req.params;

    const submissions = await Submission.find({
        problemId,
        userId: req.user._id,
      })
  .sort({ createdAt: -1 })
  .select("-code -__v");

  return res.status(200).json(submissions);

  } catch (error) {
    console.error("History Fetch Error:", error);
    return res.status(500).json({
      message: "Error fetching submission history",
      error: error.message,
    });
  }
};

const getSubmissionById = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await Submission.findById(submissionId)
      .select("-code -__v");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.status(200).json(submission);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching submission",
      error: error.message
    });
  }
};

const runCode = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const result = await evaluateRunCode(problemId, code, language);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Run Code Controller Error:", error);
    return res.status(500).json({ message: "Error running code", error: error.message });
  }
};

module.exports = {
  createSubmission,
  getSubmissionHistory,
  getSubmissionById,
  runCode
};