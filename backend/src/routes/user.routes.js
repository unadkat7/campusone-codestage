const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { getUserProfile, updateUserProfile, uploadAvatar } = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

// ── Multer Configuration ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Parent directory 'uploads'
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `avatar-${req.user._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
  },
});

router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.post("/upload-avatar", authMiddleware, upload.single("avatar"), uploadAvatar);

module.exports = router;
