import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import nodemailer from 'nodemailer'
import { generateOtp } from './generateOtp.js'
import OTP from './model.js'

const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json())


app.post("/auth/request-otp", async (req, res) => {
    const { email } = req.body;
    const otp = generateOtp()

    const transporter = nodemailer.createTransport({
        service : 'Gmail',
        auth : {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    });

    try {
        await OTP.deleteMany({ email }) // this is for clearing old generated otp
        await OTP.create({ email, otp })

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP code',
            text: `Your OTP is ${otp}`
        });

        res.status(200).json({ message : 'OTP sent successfully'})
    } catch (error) {
        console.error("❌ Email sending error:", error);
        res.status(500).json({
            error : 'Failed to sent OTP'
        })
    }
})

app.post('/auth/verify-otp', async (req, res) => {
    const { email, otp } = req.body
    const validOtp = await OTP.findOne({ email, otp })

    if(!validOtp) return res.status(400).json({ error: 'Invalid OTP'})
    
    OTP.deleteMany({ email })
    res.status(200).json({ message: 'OTP varified successfully'})
})

app.listen(PORT, () => {
    console.log(`Server is listenning on port ${PORT}.`);
})