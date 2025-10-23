import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json());
// Serve uploaded profile photos statically (must be after app is declared)
app.use(
  "/uploads/profile-photos",
  express.static(path.join(__dirname, "../uploads/profile-photos"))
);

// Log every incoming request path and method
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Homepage route
app.get("/", (req, res) => {
  res.send("Erasmus Exam API is running");
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "OK",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "ERROR", database: "disconnected", error: error });
  }
});

// TODO: Add more routes for users, exams, questions, etc.

import apiRoutes from "./routes";
import prisma from "./prismaClient";

app.use("/api", apiRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log("Server shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

// Bind to 0.0.0.0 so hosts like Render can detect the open port.
app.listen(PORT, "0.0.0.0", async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");
    console.log(`🚀 Server running on port ${PORT} (bound to 0.0.0.0)`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
});
