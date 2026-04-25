# Core Functionality & Architecture Guide

This document explains how **CodeStage** handles code execution, the integration with **Judge0**, and why we use **Redis** with **BullMQ** for background processing.

---

## 1. Code Execution Flow (Step-by-Step)

The project has two main flows for executing code: **Run Code** (synchronous/immediate) and **Submit Code** (asynchronous/queued).

### A. Run Code (Testing phase)
When a user clicks "Run", they want instant feedback on visible test cases.

1.  **Frontend Request:** The frontend sends the `problemId`, `code`, and `language` to `/api/submissions/run`.
2.  **Controller:** `submission.controller.js` receives the request and calls `evaluateRunCode`.
3.  **Evaluation Service:** 
    - Fetches the problem from MongoDB.
    - Filters for **visible test cases** only.
    - Sequentially calls the **Judge0 API** for each test case using the `runCode` helper.
4.  **Judge0 API:** Compiles and executes the code in a sandbox.
5.  **Response:** The backend waits for all visible test cases to finish and sends the combined result (Accepted/Wrong Answer/Error) back to the frontend immediately.

### B. Submit Code (Final submission)
When a user clicks "Submit", the system needs to check **all** test cases (including hidden ones). This can take time, so we process it in the background.

1.  **Frontend Request:** Sends data to `/api/submissions/create`.
2.  **Controller:** 
    - Creates a new `Submission` record in MongoDB with `status: "Pending"`.
    - Adds a **Job** to the `submission-queue`.
    - **Immediate Response:** Returns the `submissionId` and "Pending" status to the user. The user is NOT blocked.
3.  **Queue (Redis):** The job sits in Redis until a worker is free.
4.  **Worker:** `submission.worker.js` (a background process) picks up the job.
    - It calls `evaluateSubmission` in the service.
    - It runs the code against **every single test case** (Visible + Hidden).
    - **Update MongoDB:** Once finished, it updates the original `Submission` record with the final results (Accepted, TLE, WA, etc.).
5.  **Frontend Polling/Socket:** The frontend then fetches the status of that specific `submissionId` to show the final result to the user.

---

## 2. Redis, Queues, Jobs, and Workers

### 🛠️ What is what?
| Component | Description |
| :--- | :--- |
| **Redis** | A super-fast, in-memory database. In this project, it's used as the "storage engine" for our queue. It keeps track of which jobs are waiting, which are running, and which failed. |
| **Queue** | A "To-Do List" for our backend. We use **BullMQ** to manage this list. It ensures jobs are processed in order and don't get lost if the server restarts. |
| **Job** | A single unit of work. For us, one "Job" = "Evaluate Submission #12345". |
| **Worker** | The "employee" that actually does the work. It constantly checks the Queue, takes a Job, executes it (calls Judge0 and updates DB), and then goes to the next Job. |

### ❓ Why do we use this? (The "Optimization")
If we didn't use Redis/Queues, your project would have these problems:
1.  **User Frustration:** If Judge0 takes 10 seconds to run 50 test cases, the user's browser would just show a "loading" spinner for 10 seconds. They couldn't do anything else.
2.  **Server Crashes:** If 100 users submit code at the same exact second, your backend would try to make 1,000+ API calls to Judge0 simultaneously, likely crashing your server or getting you banned from Judge0.
3.  **Reliability:** If the server restarts while evaluating a submission, that submission is lost forever. With a queue, Redis remembers the job and restarts it when the server comes back up.

---

## 3. How it Optimizes Your Project

1.  **Decoupling:** The "Web Server" (Express) is separated from the "Execution Logic" (Worker). Even if the Worker is busy, the Web Server remains fast and responsive.
2.  **Scalability:** You can run **one** Express server and **five** Workers on different machines. This allows your project to handle thousands of submissions concurrently.
3.  **Rate Limiting Control:** We can tell the Worker to only process 5 submissions at a time (Concurrency) to stay within Judge0's free tier limits.
4.  **Retries:** If the Judge0 API is temporarily down, BullMQ can automatically retry the job 3 times with "exponential backoff" (waiting longer between each try).

---

## 4. Where is it in the Code?

*   **Queue Definition:** `backend/src/queues/submission.queue.js`
*   **Job Creation:** `backend/src/controllers/submission.controller.js` (inside `createSubmission`)
*   **Worker Logic:** `backend/src/workers/submission.worker.js`
*   **Judge0 Logic:** `backend/src/services/evaluationService.js` (specifically the `runCode` function)

---

> [!TIP]
> Always ensure your Redis server is running (`redis-server`) before starting the backend, otherwise the submission queue will fail!
