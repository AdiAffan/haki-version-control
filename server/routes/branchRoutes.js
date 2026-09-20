const express = require("express");

const {
  getBranches,
  getBranch,
  createBranch,
  updateBranch,
  deleteBranch,
} = require("../controllers/branchController");

const router = express.Router();

router.get("/:repositoryId", getBranches);

router.get(
  "/:repositoryId/:branchId",
  getBranch
);

router.post(
  "/:repositoryId",
  createBranch
);

router.put(
  "/:repositoryId/:branchId",
  updateBranch
);

router.delete(
  "/:repositoryId/:branchId",
  deleteBranch
);

module.exports = router;