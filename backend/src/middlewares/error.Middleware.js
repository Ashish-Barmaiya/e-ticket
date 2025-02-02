import { ApiError } from "../utils/apiError.js";

const errorHandler = (err, req, res) => {
  // Default error
  let error = err;

  // If error is not an instance of ApiError, create one
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || []);
  }

  // Send error response
  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };
