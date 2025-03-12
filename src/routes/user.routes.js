import { Router } from "express";
import { changePassword, loginUser, logoutUser, profile, registerUser } from "../controller/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerUser)
router.post("/login", loginUser)

// Protected Routes
router.post("/logout", isLoggedIn, logoutUser)
router.get("/profile", isLoggedIn, profile)
router.post("/change-password", isLoggedIn, changePassword)

export default router;