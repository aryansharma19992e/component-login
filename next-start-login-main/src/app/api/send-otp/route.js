import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const otpStore = new Map(); // temporary storage

export async function POST(req) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 })
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expiry = Date.now() + 5 * 60 * 1000 // 5 minutes

  otpStore.set(email, { otp, expires: expiry })

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,     // your Gmail address
        pass: process.env.EMAIL_PASS,     // your Gmail app password
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: 'OTP sent' })
  } catch (err) {
    console.error('Error sending email:', err)
    return NextResponse.json({ message: 'Failed to send OTP' }, { status: 500 })
  }
}

// To export OTP store for use in registration route
export { otpStore }