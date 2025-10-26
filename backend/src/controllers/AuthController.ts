import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// Configure nodemailer transport (example: Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

import path from "path";
import fs from "fs";
import multer, { StorageEngine } from "multer";
import { Request as ExpressRequest } from "express";

// Multer storage config for profile photos
const storage: StorageEngine = multer.diskStorage({
  destination: function (_req: ExpressRequest, _file: Express.Multer.File, cb) {
    const uploadDir = path.join(__dirname, "../../uploads/profile-photos");
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (_req: ExpressRequest, file: Express.Multer.File, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

export const profilePhotoUpload = multer({ storage });

const AuthController = {
  /**
   * Upload profile photo for authenticated user
   * Expects: Bearer token, multipart/form-data with 'photo' field
   */
  uploadProfilePhoto: async (
    req: Request & { file?: Express.Multer.File },
    res: Response
  ) => {
    // Auth middleware should set req.user or decode JWT here
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    const userId =
      typeof payload === "object" && "userId" in payload
        ? (payload as any).userId
        : undefined;
    if (!userId) {
      return res.status(400).json({ error: "Invalid token payload" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Save file path relative to /uploads/profile-photos
    const photoPath = `/uploads/profile-photos/${req.file.filename}`;
    await prisma.user.update({
      where: { id: userId },
      data: { profilePhoto: photoPath } as any,
    });
    res.json({ message: "Profile photo uploaded", profilePhoto: photoPath });
  },
  register: async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Name, email and password required" });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    res
      .status(201)
      .json({
        message: "User registered",
        user: { id: user.id, email: user.email, name: user.name },
      });
  },
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Email is incorrect" });
    }
    const valid = await bcrypt.compare(password, user.password || "");
    if (!valid) {
      return res.status(401).json({ error: "Password is incorrect" });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );
    res.json({ message: "Login successful", token });
  },
  me: async (req: Request, res: Response) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
      const payload: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      );
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          profilePhoto: true,
        },
      });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json({ user });
    } catch (err) {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  },
  logout: async (req: Request, res: Response) => {
    // For JWT, logout is handled client-side by deleting the token
    res.json({ message: "Logged out (token deleted on client)" });
  },

  /**
   * Update authenticated user's profile (name, email, optional password)
   * Body: { name, email, newPassword?, currentPassword }
   */
  updateProfile: async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    const userId =
      typeof payload === "object" && "userId" in payload
        ? (payload as any).userId
        : undefined;
    if (!userId)
      return res.status(400).json({ error: "Invalid token payload" });

    const { name, email, newPassword, currentPassword, avatar } = req.body || {};
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // If only avatar is being updated, skip password check
    const onlyAvatar =
      typeof avatar === "string" &&
      !name && !email && !newPassword && !currentPassword;

    if (!onlyAvatar) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Mevcut şifre gerekli" });
      }
      const valid = await bcrypt.compare(currentPassword, user.password || "");
      if (!valid) return res.status(401).json({ error: "Mevcut şifre hatalı" });
      // If email is being changed, check uniqueness
      if (email && email !== user.email) {
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists)
          return res.status(409).json({ error: "Bu email zaten kullanılıyor" });
      }
    }

    const data: any = {};
    if (typeof name === "string" && name.trim()) data.name = name.trim();
    if (typeof email === "string" && email.trim()) data.email = email.trim();
    if (typeof newPassword === "string" && newPassword.trim()) {
      const hashed = await bcrypt.hash(newPassword, 10);
      data.password = hashed;
    }
    if (typeof avatar === "string") data.avatar = avatar;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "Güncellenecek bir alan yok" });
    }

    const updated = await prisma.user.update({ where: { id: userId }, data });
    res.json({
      message: "Profil güncellendi",
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        profilePhoto: updated.profilePhoto,
        avatar: updated.avatar,
      },
    });
  },

  forgotPassword: async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Generate token and expiry
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "15m" }
    );
    // Save token and expiry to user (fields must exist in your Prisma schema)
    // Skipped updating passwordResetToken and passwordResetExpires because fields do not exist and migration is not desired now.
    // Send email with reset link
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 15 minutes.</p>`,
      });
      res.json({ message: "Password reset link sent to email." });
    } catch (err) {
      console.error("Error sending email:", err);
      res.status(500).json({ error: "Failed to send email." });
    }
  },

  resetPassword: async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password required" });
    }
    // Verify token
    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
    } catch (err) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    // Find user by id (handle JwtPayload type)
    const userId =
      typeof payload === "object" && "userId" in payload
        ? (payload as any).userId
        : undefined;
    if (!userId) {
      return res.status(400).json({ error: "Invalid token payload" });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    // Clear token and expiry (simulate)
    // await prisma.user.update({ where: { id: user.id }, data: { passwordResetToken: null, passwordResetExpires: null } });
    res.json({ message: "Password reset successful" });
  },
};

export default AuthController;
