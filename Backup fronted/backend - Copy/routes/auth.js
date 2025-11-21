import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import fs from "fs";
import { OAuth2Client } from "google-auth-library";
const router = express.Router();

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





export default router;
