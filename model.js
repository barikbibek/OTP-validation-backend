import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

mongoose.connect(process.env.MONGO_URI).then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

const otpSchema = new mongoose.Schema({
    email : String,
    otp : String,
    createdAt: {type: Date, default: Date.now, index: {expires: 300}}
})

export default mongoose.model('OTP', otpSchema)