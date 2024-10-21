// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import dbConnect from '@/lib/connectDB';
import {PortfolioModel} from '@/models/User.model';

// Temporary storage with expiration
const tempUsers = new Map<string, { hashedPassword: string; otp: number; expiry: number }>();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function sendOtpEmail(email: string, otp: number) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}. This code will expire in 10 minutes.`,
  };

  return transporter.sendMail(mailOptions);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { step, email, password, otp, username } = await req.json();

  switch (step) {
    case 1:
      return await handleStep1(email, password);
    case 2:
      return await handleStep2(email, otp);
    case 3:
      return await handleStep3(email, username);
    default:
      return NextResponse.json({ message: 'Invalid step' }, { status: 400 });
  }
}

async function handleStep1(email: string, password: string) {
  const existingUser = await PortfolioModel.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otpCode = Math.floor(100000 + Math.random() * 900000);
  const expiry = Date.now() + 600000; // 10 minutes expiration
  tempUsers.set(email, { hashedPassword, otp: otpCode, expiry });

  await sendOtpEmail(email, otpCode);
  console.log(otpCode); // Remove this in production
  return NextResponse.json({ message: 'OTP sent to email' }, { status: 200 });
}

async function handleStep2(email: string, otp: number) {
  console.log('Handling Step 2');
  console.log('Email:', email);
  console.log('Received OTP:', otp);
  console.log('OTP type:', typeof otp);
  
  const tempUser = tempUsers.get(email);
  console.log('Temp user:', tempUser);
  
  if (!tempUser) {
    return NextResponse.json({ message: 'No pending signup for this email' }, { status: 400 });
  }
  
  console.log('Stored OTP:', tempUser.otp);
  console.log('Stored OTP type:', typeof tempUser.otp);
  console.log('OTP expiry:', new Date(tempUser.expiry).toISOString());
  console.log('Current time:', new Date().toISOString());
  
  if (Date.now() > tempUser.expiry) {
    return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
  }
  
  if (tempUser.otp !== parseInt(otp.toString(), 10)) {
    return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
  }
  
  return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });
}

async function handleStep3(email: string, username: string) {
  const existingUsername = await PortfolioModel.findOne({ username });
  if (existingUsername) {
    return NextResponse.json({ message: 'Username is Unavailable' }, { status: 400 });
  }

  const tempUser = tempUsers.get(email);
  if (!tempUser || Date.now() > tempUser.expiry) {
    return NextResponse.json({ message: 'Session expired, please start over' }, { status: 400 });
  }

  const newUser = new PortfolioModel({ email, username, password: tempUser.hashedPassword });
  await newUser.save();
  tempUsers.delete(email); // Clean up temporary storage

  return NextResponse.json({ message: 'User created successfully' }, { status: 200 });
}
