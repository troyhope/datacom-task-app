import { Request, Response, NextFunction } from "express";

export const validateTask = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, status } = req.body;
  const errors: string[] = [];

  // Validate title
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    errors.push("Title is required");
  }

  // Validate status if present
  if (status && !["TODO", "IN_PROGRESS", "COMPLETED"].includes(status)) {
    errors.push("Invalid status value");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
};
