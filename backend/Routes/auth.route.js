import express from "express"
const router = express.Router()
import {signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth, googleAuth} from "../controllers/auth.controller.js"
import { verifyToken } from "../middlewares/verifyToken.js"

import uploadCloud from "../config/cloudinary.js";

router.post("/signup", signup)
router.post("/login", login)
router.get("/logout", logout)
router.post("/verify-email",verifyEmail)
router.post("/forgot-password",forgotPassword)
router.post("/reset-password/:token",resetPassword)
router.get("/check-auth", verifyToken, checkAuth)
router.post('/google', googleAuth);

export default router