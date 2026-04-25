const User = require("../models/user.model");

/**
 * authMiddleware — Campus One integration with Just-In-Time (JIT) provisioning.
 *
 * 1. Reads the user's MongoDB _id from the `x-user-id` header.
 * 2. If the user exists in the DB, attaches them to the request.
 * 3. If the user does NOT exist, creates a new "placeholder" user
 *    to allow them to start using CodeStage immediately.
 */
const authMiddleware = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    // 1️⃣ Check if userId header exists
    if (!userId) {
      return res.status(401).json({
        message: "No user ID provided (x-user-id header missing)",
      });
    }

    // 2️⃣ Find user in DB
    let user = await User.findById(userId).select("-password");

    // 3️⃣ JIT Provisioning: Create user if they don't exist
    if (!user) {
      console.log(`[AUTH] JIT: Creating new user for ID: ${userId}`);
      try {
        user = await User.create({
          _id: userId,
          name: `User_${userId.slice(-4)}`, // Placeholder name
          role: "candidate"
        });
      } catch (createErr) {
        console.error("[AUTH] Failed to auto-create user:", createErr.message);
        return res.status(401).json({
          message: "Could not initialize user session",
        });
      }
    }

    // 4️⃣ Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error("[AUTH] Middleware Error:", error.message);
    return res.status(401).json({
      message: "Invalid user session",
    });
  }
};

module.exports = authMiddleware;