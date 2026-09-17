const express = require("express");

const {
  getHead,
} = require("../controllers/headController");

const router = express.Router();

router.get("/:repositoryId", getHead);

module.exports = router;