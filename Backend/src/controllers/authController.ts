import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/User";
import {
  RegisterRequest,
  LoginRequest,
  VerifyOTPRequest,
} from "../types";
import {
  generateOTP,
  storeOTP,
  verifyOTP,
  sendOTPEmail,
} from "../utils/otpService";
import config from "../utils/config";
import { AuthRequest } from "../middleware/auth";

const pendingRegistrations = new Map<
  string,
  RegisterRequest & { hashedPassword: string }
>();


export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password }: RegisterRequest = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ success: false, error: "All fields are required" });
      return;
    }

    if (username.length < 3) {
      res
        .status(400)
        .json({ success: false, error: "Username must be at least 3 characters" });
      return;
    }

    if (!email.includes("@")) {
      res.status(400).json({ success: false, error: "Invalid email format" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ success: false, error: "Password must be at least 6 characters" });
      return;
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    pendingRegistrations.set(email, {
      username,
      email,
      password,
      hashedPassword,
    });

    const otp = generateOTP();
    storeOTP(email, otp);

    const sent = await sendOTPEmail(email, otp);

    if (!sent) {
      res
        .status(500)
        .json({ success: false, error: "Failed to send OTP email" });
      return;
    }

    res.json({ success: true, message: `OTP sent to ${email}` });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ================= VERIFY OTP =================

export const verifyRegistrationOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { identifier, otp }: VerifyOTPRequest = req.body;

    if (!identifier || !otp) {
      res.status(400).json({ success: false, error: "Email and OTP required" });
      return;
    }

    const isValid = verifyOTP(identifier, otp);

    if (!isValid) {
      res.status(400).json({ success: false, error: "Invalid or expired OTP" });
      return;
    }

    const pending = pendingRegistrations.get(identifier);

    if (!pending) {
      res.status(400).json({ success: false, error: "Registration expired" });
      return;
    }

    // Save user in MongoDB
    const newUser = await UserModel.create({
      username: pending.username,
      email: identifier,
      password: pending.hashedPassword,
      isVerified: true,
    });

    pendingRegistrations.delete(identifier);

    const token = jwt.sign(
      { username: newUser.username, identifier: newUser.email },
      config.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Registration successful",
      token,
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ================= RESEND OTP =================

export const resendOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, error: "Email is required" });
      return;
    }

    const pending = pendingRegistrations.get(email);

    if (!pending) {
      res
        .status(400)
        .json({ success: false, error: "No pending registration found" });
      return;
    }

    const otp = generateOTP();
    storeOTP(email, otp);

    const sent = await sendOTPEmail(email, otp);

    if (!sent) {
      res.status(500).json({ success: false, error: "Failed to resend OTP" });
      return;
    }

    res.json({ success: true, message: "OTP resent successfully" });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ================= LOGIN =================

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, error: "Email and password required" });
      return;
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      res
        .status(400)
        .json({ success: false, error: "Invalid email or password" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ success: false, error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { username: user.username, identifier: user.email },
      config.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ================= LOGOUT =================

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};

// ================= VERIFY TOKEN =================

export const verify = (req: AuthRequest, res: Response): void => {
  if (req.user) {
    res.json({
      success: true,
      username: req.user.username,
      identifier: req.user.identifier,
    });
  } else {
    res.status(401).json({ success: false, error: "Not authenticated" });
  }
};

// ================= GET ALL USERS =================

export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await UserModel.find({}, "-password");

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};