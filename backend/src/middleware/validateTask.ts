import { Request, Response, NextFunction } from "express";

export const validateTask = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, status } = req.body;
  const errors: string[] = [];

  // Check if it's a POST request (creating a new task) or a PUT request (updating existing task)
  const isCreating = req.method === "POST";

  // Validate title - only required when creating a new task
  if (
    isCreating &&
    (!title || typeof title !== "string" || title.trim().length === 0)
  ) {
    errors.push("Title is required");
  }

  // If title is present but invalid, validate it even for PUT requests
  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim().length === 0)
  ) {
    errors.push("Title must be a non-empty string");
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
