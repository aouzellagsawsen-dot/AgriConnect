import User from "../Models/user.model.js"
import bcryptjs from "bcryptjs"
import { generateTokenAndSetCookie } from "../Utils/generateTokenandsetCookie.js"
import { sendPasswordResetEmail, sendResetSucessEmail, sendWelcomeEmail } from "../nodemailer/email.js"
import crypto from "crypto"
import axios from "axios"
import { OAuth2Client } from 'google-auth-library';

export const signup = async (req, res) => {
  const { email, password, address, name, phone, role, country, region } = req.body
  try {
    if (!email || !password || !name || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    
    const userAlreadyExist = await User.findOne({ email })
    if (userAlreadyExist) return res.status(400).json({ success: false, message: "user already exist" })
    
    const hashedPassword = await bcryptjs.hash(password, 10)
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
    
    const user = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      role,
      country,
      region,
      address,
      isVerified: true
    })
    
    await user.save()
    generateTokenAndSetCookie(res, user._id)
    await sendWelcomeEmail(user.email, user.name)
    
    res.status(201).json({ success: true, message: "user created successfully", user: { ...user._doc, password: undefined } })
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ success: false, message: "invalid credentials" })
    
    const isPasswordValid = await bcryptjs.compare(password, user.password)
    if (!isPasswordValid) return res.status(400).json({ success: false, message: "invalid credentials" })
    
    generateTokenAndSetCookie(res, user._id)

    await User.updateOne(
      { _id: user._id }, 
      { $set: { lastLogin: new Date() } }
    );

    user.lastLogin = new Date();
    
    res.status(200).json({ success: true, message: "logged in successfully", user: { ...user._doc, password: undefined } })
  } catch (error) {
    console.log("error in login", error.message)
    res.status(400).json({ success: false, message: error.message })
  }
}

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true
  });
  res.status(200).json({ success: true, message: "logout successfully" })
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ success: false, message: "user not found" })
    
    const resetToken = crypto.randomBytes(20).toString("hex") 
    const restTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000
    user.resetPasswordToken = resetToken
    user.resetPasswordExpiresAt = restTokenExpiresAt
    await user.save()
    
    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)
    res.status(200).json({ success: true, message: "password reset link sent to your email" })
  } catch (error) {
    console.log("error in forgot password", error)
    res.status(400).json({ success: false, message: error.message })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpiresAt: { $gt: Date.now() } })
    if (!user) return res.status(400).json({ success: false, message: "invalid or expired reset token" })
    
    const hashedPassword = await bcryptjs.hash(password, 10)
    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpiresAt = undefined
    await user.save()
    
    await sendResetSucessEmail(user.email)
    res.status(200).json({ success: true, message: "password reset successfully" })
  } catch (error) {
    console.log("error in reset password", error)
    res.status(400).json({ success: false, message: error.message })
  }
}

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    if (!user) return res.status(400).json({ success: false, message: "user not found" })
    res.status(200).json({ success: true, user })
  } catch (error) {
    console.log("error in check auth", error)
    res.status(400).json({ success: false, message: error.message })
  }
}

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  const { credential } = req.body; 
  
  try {
    // 1. On interroge l'API Google avec l'access_token pour récupérer le profil utilisateur
    const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${credential}`
      }
    });
    
    // 2. On extrait les données envoyées par Google
    const { email, name, email_verified } = googleResponse.data;

    if (!email_verified) {
      return res.status(400).json({ success: false, message: "L'email Google n'est pas vérifié." });
    }

    // 3. On regarde s'il existe déjà dans notre base de données
    let user = await User.findOne({ email });

    if (!user) {
      // 4. S'il n'existe pas, on le crée automatiquement
      // On génère un mot de passe aléatoire très complexe (car il se connectera toujours via Google)
      const generatedPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);

      user = new User({
        email,
        name,
        password: hashedPassword,
        isVerified: true, 
      });
      await user.save();
      await sendWelcomeEmail(user.email, user.name); 
    }

    // 5. On le connecte en lui donnant notre cookie JWT (comme une connexion classique)
    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Connexion Google réussie", 
      user: { ...user._doc, password: undefined } 
    });

  } catch (error) {
    console.error("Erreur dans googleAuth:", error);
    res.status(400).json({ success: false, message: "Échec de l'authentification Google." });
  }
};