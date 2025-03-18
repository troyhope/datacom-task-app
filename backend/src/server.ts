import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
