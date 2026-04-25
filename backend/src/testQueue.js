const submissionQueue = require("./queues/submission.queue");

async function testQueue() {
  try {
    await submissionQueue.add("test-job", {
      message: "Hello Queue",
    });

    console.log("Job added successfully!");
  } catch (error) {
    console.error("Queue error:", error);
  }
}

testQueue();