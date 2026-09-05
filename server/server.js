const express = require("express");
const cors = require("cors");

const repositoryRoutes = require("./routes/repositoryRoutes");

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/repositories", repositoryRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HAKI Version Control API is running",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`HAKI API running on http://localhost:${PORT}`);
});