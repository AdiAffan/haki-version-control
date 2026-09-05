const express = require("express");

const {
  getRepositories,
} = require("../controllers/repositoryController");

const router = express.Router();

router.get("/", getRepositories);

module.exports = router;