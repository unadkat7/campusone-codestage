const Problem = require("../models/problem.model.js");
const Submission = require("../models/submission.model.js");



const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select("title difficulty");

    // If user is authenticated, check which problems they have solved
    let solvedProblemIds = new Set();
    if (req.user) {
      const acceptedSubmissions = await Submission.find({
        userId: req.user._id,
        status: "Accepted"
      }).select("problemId");

      solvedProblemIds = new Set(acceptedSubmissions.map(s => s.problemId.toString()));
    }

    const problemsWithSolved = problems.map(p => ({
      ...p.toObject(),
      isSolved: solvedProblemIds.has(p._id.toString())
    }));

    res.status(200).json(problemsWithSolved);
  } catch (error) {
    console.error("Fetch Problems Error:", error);
    res.status(500).json({ message: "Error fetching problems" });
  }
};

const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Filter only visible test cases
    const visibleTestCases = problem.testCases
      .filter(tc => !tc.isHidden)
      .map(tc => ({
        input: tc.input,
        output: tc.output,
      }));

    res.json({
      ...problem.toObject(),
      testCases: visibleTestCases,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching problem" });
  }
};

const getProblemStats = async (req, res) => {
  try {
    const { id } = req.params;

    // Total submissions
    const totalSubmissions = await Submission.countDocuments({
      problemId: id,
    });

    // Accepted submissions
    const acceptedSubmissions = await Submission.countDocuments({
      problemId: id,
      status: "Accepted",
    });

    // Calculate acceptance rate
    const acceptanceRate =
      totalSubmissions === 0
        ? 0
        : ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2);

    return res.status(200).json({
      totalSubmissions,
      acceptedSubmissions,
      acceptanceRate: `${acceptanceRate}%`,
    });

  } catch (error) {
    console.error("Problem Stats Error:", error);
    return res.status(500).json({
      message: "Error fetching problem stats",
      error: error.message,
    });
  }
};
module.exports = {
  getAllProblems,
  getProblemById,
  getProblemStats,
};