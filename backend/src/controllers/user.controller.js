const User = require("../models/user.model");
const Submission = require("../models/submission.model");
const Problem = require("../models/problem.model");

/**
 * GET /api/users/profile
 * Returns full profile with aggregated stats, heatmap, language breakdown.
 */
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // ── Core user data ──
    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ── All submissions by this user ──
    const submissions = await Submission.find({ userId })
      .sort({ createdAt: -1 })
      .populate("problemId", "title difficulty");

    // ── Stats: totals ──
    const totalSubmissions = submissions.length;
    const acceptedSubmissions = submissions.filter(
      (s) => s.status === "Accepted"
    );
    const totalAccepted = acceptedSubmissions.length;

    // Unique solved problem IDs
    const solvedProblemIds = [
      ...new Set(acceptedSubmissions.map((s) => s.problemId?._id?.toString())),
    ];
    const totalSolved = solvedProblemIds.length;

    // Accuracy
    const accuracy =
      totalSubmissions > 0
        ? Math.round((totalAccepted / totalSubmissions) * 100)
        : 0;

    // ── Difficulty breakdown (unique solved) ──
    const difficultyMap = { easy: 0, medium: 0, hard: 0 };
    const seen = new Set();
    for (const s of acceptedSubmissions) {
      const pid = s.problemId?._id?.toString();
      const diff = s.problemId?.difficulty?.toLowerCase();
      if (pid && diff && !seen.has(pid)) {
        seen.add(pid);
        if (difficultyMap[diff] !== undefined) {
          difficultyMap[diff]++;
        }
      }
    }

    // Total problems per difficulty (for progress bars)
    const totalProblems = await Problem.countDocuments();
    const totalEasy = await Problem.countDocuments({ difficulty: "easy" });
    const totalMedium = await Problem.countDocuments({ difficulty: "medium" });
    const totalHard = await Problem.countDocuments({ difficulty: "hard" });

    // ── Language distribution ──
    const langCount = {};
    for (const s of submissions) {
      const lang = s.language || "unknown";
      langCount[lang] = (langCount[lang] || 0) + 1;
    }
    // Convert to sorted array of { language, count, percentage }
    const languages = Object.entries(langCount)
      .map(([language, count]) => ({
        language,
        count,
        percentage:
          totalSubmissions > 0 ? Math.round((count / totalSubmissions) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // ── Activity heatmap (last 365 days) ──
    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const heatmapAgg = await Submission.aggregate([
      {
        $match: {
          userId: user._id,
          createdAt: { $gte: oneYearAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const heatmap = {};
    for (const entry of heatmapAgg) {
      heatmap[entry._id] = entry.count;
    }

    // ── Current streak ──
    let streak = 0;
    const nowUtc = new Date();
    // Start of "today" in UTC
    for (let i = 0; i < 365; i++) {
      const d = new Date(nowUtc);
      d.setUTCDate(d.getUTCDate() - i);
      const key = d.toISOString().split("T")[0];
      if (heatmap[key]) {
        streak++;
      } else {
        // If we haven't found a submission for today yet, 
        // don't break the streak if there was one yesterday.
        if (i === 0) continue; 
        break;
      }
    }

    // ── Recent activity (last 15) ──
    const recentActivity = submissions.slice(0, 15).map((s) => ({
      _id: s._id,
      problemTitle: s.problemId?.title || "Unknown",
      problemDifficulty: s.problemId?.difficulty || "unknown",
      language: s.language,
      status: s.status,
      executionTime: s.executionTime,
      memoryUsed: s.memoryUsed,
      createdAt: s.createdAt,
    }));

    // ── Badges ──
    const badges = [];
    if (totalSolved >= 1)   badges.push({ id: "first_blood",   label: "FIRST_BLOOD",   desc: "Solved your first problem" });
    if (totalSolved >= 10)  badges.push({ id: "deca_kill",     label: "DECA_KILL",     desc: "Solved 10 problems" });
    if (totalSolved >= 25)  badges.push({ id: "quarter_cent",  label: "25_CLEAR",      desc: "Solved 25 problems" });
    if (totalSolved >= 50)  badges.push({ id: "half_cent",     label: "50_CLEAR",      desc: "Solved 50 problems" });
    if (streak >= 3)        badges.push({ id: "streak_3",      label: "3_DAY_STREAK",  desc: "Coded 3 days in a row" });
    if (streak >= 7)        badges.push({ id: "streak_7",      label: "WEEK_WARRIOR",  desc: "Coded 7 days in a row" });
    if (streak >= 30)       badges.push({ id: "streak_30",     label: "MONTHLY_GRIND", desc: "Coded 30 days in a row" });
    if (difficultyMap.hard >= 1)  badges.push({ id: "hard_first",    label: "HARD_MODE",     desc: "Solved a hard problem" });
    if (difficultyMap.hard >= 10) badges.push({ id: "hard_hunter",   label: "BUG_HUNTER",    desc: "Solved 10 hard problems" });
    if (accuracy >= 80 && totalSubmissions >= 10) badges.push({ id: "precision",     label: "PRECISION",     desc: "80%+ accuracy with 10+ submissions" });

    return res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        location: user.location,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        websiteUrl: user.websiteUrl,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
      },
      stats: {
        totalSolved,
        totalSubmissions,
        totalAccepted,
        accuracy,
        streak,
        totalProblems,
        difficulty: {
          easy:   { solved: difficultyMap.easy,   total: totalEasy },
          medium: { solved: difficultyMap.medium, total: totalMedium },
          hard:   { solved: difficultyMap.hard,   total: totalHard },
        },
      },
      languages,
      heatmap,
      badges,
      recentActivity,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

/**
 * PUT /api/users/profile
 * Update editable profile fields.
 */
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bio, location, githubUrl, linkedinUrl, websiteUrl, profilePicture } = req.body;

    const updated = await User.findByIdAndUpdate(
      userId,
      {
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(websiteUrl !== undefined && { websiteUrl }),
        ...(profilePicture !== undefined && { profilePicture }),
      },
      { new: true, runValidators: true }
    ).select("-password -__v");

    return res.status(200).json({
      message: "Profile updated",
      user: updated,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
};

/**
 * POST /api/users/upload-avatar
 * Handles file upload and updates user's profilePicture path.
 */
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user._id;
    // We store the relative path for serving
    const avatarPath = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: avatarPath },
      { new: true }
    ).select("-password -__v");

    return res.status(200).json({
      message: "Avatar uploaded successfully",
      profilePicture: avatarPath,
      user,
    });
  } catch (error) {
    console.error("Upload Avatar Error:", error);
    return res.status(500).json({
      message: "Error uploading avatar",
      error: error.message,
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
};
