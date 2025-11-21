import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";   // ✅ NEW
import crypto from "crypto";           // ✅ NEW
import fs from "fs";
import { OAuth2Client } from "google-auth-library";
const router = express.Router();
const otpStore = new Map(); // temporary in-memory OTP store

// Load keys once (not inside routes)
const PRIVATE_KEY = fs.readFileSync("./private.key", "utf8");
const PUBLIC_KEY = fs.readFileSync("./public.key", "utf8");

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    // ✅ Sign JWT using RSA private key
    const token = jwt.sign({ id: newUser._id }, PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: "7d",
    });

    // ✅ Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    res.json({
      message: "Signup successful",
      user: { name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    // ✅ Use the same private key for signing
    const token = jwt.sign({ id: user._id }, PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: "7d",
    });

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });

    res.json({
      message: "Login successful",
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Google Login/Signup Route

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body; // token from frontend Google login

    // ✅ Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    // ✅ Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      // new signup via Google
      user = await User.create({
        name,
        email,
        password: "google_auth", // dummy, not used
        picture,
      });
    }

    // ✅ Issue JWT
    const jwtToken = jwt.sign({ id: user._id }, PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: "7d",
    });

    // ✅ Send cookie
    res.cookie("token", jwtToken, {
      httpOnly: true,
      sameSite: "strict",
    });

    res.json({
      message: "Google login successful",
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
});





// ✅ Step 1: Send OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "No user found with that email" });

    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // store OTP temporarily (5 mins expiry)
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    // send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS, // your app password (not your real Gmail password)
      },
    });

    const mailOptions = {
      from: `"Beauty AuthApp" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Password Reset Request</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 3px;">${otp}</h1>
          <p>This code will expire in <strong>5 minutes</strong>.</p>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    // console.log(`✅ OTP ${otp} sent to ${email}`);

    res.json({ message: "Verification code sent to your email" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Error sending OTP" });
  }
});


// ✅ Step 2: Verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const stored = otpStore.get(email);
  if (!stored)
    return res.status(400).json({ message: "OTP not found or expired" });

  if (stored.expiresAt < Date.now())
    return res.status(400).json({ message: "OTP expired" });

  if (stored.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  // mark verified and allow password reset
  otpStore.set(email, { ...stored, verified: true });
  res.json({ message: "OTP verified successfully" });
});


// ✅ Step 3: Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, password } = req.body;
    const stored = otpStore.get(email);

    if (!stored || !stored.verified)
      return res.status(400).json({ message: "OTP not verified" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ email }, { password: hashedPassword });

    // cleanup OTP
    otpStore.delete(email);

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ message: "Server error" });
  }
});




export default router;
