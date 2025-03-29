import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js"; // ✅ Import User model
import multer from "multer";
import path from "path";

const router = express.Router();
router.use(express.json()); // Enable JSON parsing

// Register, Login & Profile Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

// Set up storage for uploaded images
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});
  
const upload = multer({ storage });
  
  // Upload profile picture API
router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
  
    const imageUrl = `http://localhost:8080/uploads/${req.file.filename}`;
    res.json({ imageUrl }); // Return the image URL
});

// ✅ Update user profile by ID (Correct Placement)
router.put("/:id", async (req, res) => {
    const userId = req.params.id;
    const { name, email } = req.body;
    
    try {
        const user = await User.findByIdAndUpdate(userId, { name, email }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
