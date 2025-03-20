import dotenv from "dotenv";
// Load environment variables first
dotenv.config();

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes";

const app: Express = express();
const port = process.env.PORT || 3001;

// Log environment variables for debugging
console.log("Environment variables loaded:", {
  NODE_ENV: process.env.NODE_ENV,
  TASKS_TABLE: process.env.TASKS_TABLE,
  AWS_REGION: process.env.AWS_REGION,
  AWS_PROFILE: process.env.AWS_PROFILE,
});

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [
          "http://localhost:3000",
          "http://troystaskbucket.s3-website-ap-southeast-2.amazonaws.com",
        ]
      : true, // Allow all origins in development
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);

// Basic health check route
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error details:", {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  if (process.env.NODE_ENV === "development") {
    res.status(500).json({
      error: "Something went wrong!",
      details: err.message,
      stack: err.stack,
    });
  } else {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// Only start the server if we're not in Lambda
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
