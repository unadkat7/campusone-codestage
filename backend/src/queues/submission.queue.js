const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: {}
});

const submissionQueue = new Queue("submission-queue", {
  connection,
});

module.exports = submissionQueue;