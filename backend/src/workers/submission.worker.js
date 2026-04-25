const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const mongoose = require("mongoose");
require("dotenv").config();

const Submission = require("../models/submission.model");
const { evaluateSubmission } = require("../services/evaluationService");

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Worker MongoDB Connected"))
  .catch(err => console.error(err));

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: {}
});

const worker = new Worker(
  "submission-queue",
  async (job) => {
    console.log("Processing job:", job.name);

    const { submissionId } = job.data;

    const submission = await Submission.findById(submissionId);

    if (!submission) {
      console.log("Submission not found");
      return;
    }

    let result;

    try {
      result = await evaluateSubmission(submission);
    } catch (err) {
      console.error("Worker Error:", err.message);

      result = {
        status: "Error",
        message: "Internal worker error",
        executionTime: null,
        memoryUsed: null,
        failedTestCase: null,
      };
    }

    submission.status = result.status;
    submission.executionTime = result.executionTime;
    submission.memoryUsed = result.memoryUsed;
    submission.failedTestCase = result.failedTestCase || null;
    submission.output = result.message || result.output || null;

    await submission.save();

    console.log("Submission evaluated:", submissionId);
  },
  {
    connection,
    concurrency: 5
  }
);

console.log("Submission worker running...");