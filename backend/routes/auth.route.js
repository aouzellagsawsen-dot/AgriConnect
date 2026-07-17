import express from "express"
const router = express.Router()
import {signup, login, logout, forgotPassword, resetPassword, checkAuth } from "../controllers/auth.controller.js"
import { verifyToken } from "../middlewares/verifyToken.js"

import uploadCloud from "../config/cloudinary.js";

router.post("/signup", signup)
router.post("/login", login)
router.get("/logout", logout)
router.post("/forgot-password",forgotPassword)
router.post("/reset-password/:token",resetPassword)
router.get("/check-auth", verifyToken, checkAuth)
// router.post('/google', googleAuth);

export default router
