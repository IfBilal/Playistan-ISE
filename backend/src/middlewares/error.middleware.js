import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Determine statusCode safely
  const isMongooseError = error instanceof mongoose.Error;
  const statusCode =
    error.statuscode !== undefined
      ? error.statuscode
      : isMongooseError
      ? 400
      : 500;

  // Create new ApiError if it's not already an instance of ApiError
  if (!(error instanceof ApiError)) {
    error = new ApiError(
      statusCode,
      error.message || "Something went wrong",
      error?.errors || [],
      error.stack
    );
  }

  const response = {
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode || statusCode).json(response);
};

export { errorHandler };
