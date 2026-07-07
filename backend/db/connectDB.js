import mongoose from "mongoose";
export const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connected to mongo DB")
    }catch(error){
         console.error("error connecting to mongo DB:", error.messsage)
         process.exit(1)
    }
}