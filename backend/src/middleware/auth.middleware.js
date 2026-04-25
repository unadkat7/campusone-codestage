const User = require("../models/user.model");

/**
 * authMiddleware — Campus One integration.
 *
 * Instead of verifying a JWT, we now read the user's MongoDB _id
 * from the `x-user-id` header. Campus One is responsible for
 * authenticating the user and passing the userId to CodeStage.
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
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // 3️⃣ Attach user to request
    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid user ID",
    });
  }
};

module.exports = authMiddleware;