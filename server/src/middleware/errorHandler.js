export function notFound(req, res, _next) {
  res.status(404).json({
    success: false,
    message: `Resource not found at ${req.originalUrl}`,
  });
}

export function errorHandler(err, _req, res, _next) {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "An unexpected server error occurred.";

  if (
    err.name === "MulterError" ||
    message.startsWith("Only JPEG, PNG, and WebP")
  ) {
    statusCode = 400;
  }

  // Mongoose Bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ID format for parameter: ${err.path}`;
  }

  // Mongoose Duplicate Key (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `A record with that ${field} already exists.`;
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid security token.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Security token has expired.";
  }

  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
}
