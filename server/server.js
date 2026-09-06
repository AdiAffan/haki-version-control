const express = require("express");
const cors = require("cors");

const repositoryRoutes = require("./routes/repositoryRoutes");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/repositories", repositoryRoutes);
app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HAKI Version Control API is running",
  });
});

app.listen(PORT, () => {
  console.log(`HAKI API running on http://localhost:${PORT}`);
});