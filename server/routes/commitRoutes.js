const express = require("express");

const {
  getCommits,
  getCommit,
  createCommit,
} = require("../controllers/commitController");

const router = express.Router();

router.get("/:repositoryId", getCommits);

router.get(
  "/:repositoryId/:commitId",
  getCommit
);

router.post(
  "/:repositoryId",
  createCommit
);

module.exports = router;