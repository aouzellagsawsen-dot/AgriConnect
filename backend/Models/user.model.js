import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
         type:String,
        required:true
    },
    phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Le numéro de téléphone doit contenir exactement 10 chiffres.']
    },
    role: {
        type: String,
        enum: ['farmer', 'buyer', 'transporter'], // Restreint aux rôles de ton Front
        default: 'farmer'
    },
    country: {
        type: String,
        default: ""
    },
    region: {
        type: String,
        default: ""
    },
    lastLogin:{
        type:Date,
        default:Date.now
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:String,
    resetPasswordExpiresAt:Date,
    verificationToken:String,
    verificationTokenExpireAt:Date

},{timestamps:true})
export default mongoose.models.User || mongoose.model("User", userSchema);