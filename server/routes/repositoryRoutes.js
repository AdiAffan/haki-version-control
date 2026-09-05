const express = require("express");

const {
  getRepositories,
  getRepository,
  createRepository,
  updateRepository,
  deleteRepository,
} = require("../controllers/repositoryController");

const router = express.Router();

router.get("/", getRepositories);

router.get("/:id", getRepository);

router.post("/", createRepository);

router.put("/:id", updateRepository);

router.delete("/:id", deleteRepository);

module.exports = router;