const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ error: "Bad Request", message: "Invalid ID format." });
  }

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(422).json({ error: "Validation Error", details });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      error: "Conflict",
      message: `Duplicate value for field: ${field}`,
    });
  }

  return res
    .status(500)
    .json({ error: "Internal Server Error", message: "Something went wrong." });
};

module.exports = errorHandler;
