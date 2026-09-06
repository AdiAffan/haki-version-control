const express = require("express");

const {
  getFiles,
  getFile,
  createFile,
  updateFile,
  deleteFile,
} = require("../controllers/fileController");

const router = express.Router();

router.get("/:repositoryId", getFiles);

router.get(
  "/:repositoryId/:fileId",
  getFile
);

router.post(
  "/:repositoryId",
  createFile
);

router.put(
  "/:repositoryId/:fileId",
  updateFile
);

router.delete(
  "/:repositoryId/:fileId",
  deleteFile
);

module.exports = router;