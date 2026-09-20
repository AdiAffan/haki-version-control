const { readJson, writeJson } = require("../utils/jsonDb");
const generateId = require("../utils/idGenerator");

const FILE_NAME = "branches.json";

function getAllBranches(repositoryId) {
  const branches = readJson(FILE_NAME);

  return branches.filter(
    (branch) => branch.repositoryId === repositoryId
  );
}

function getBranchById(repositoryId, branchId) {
  const branches = readJson(FILE_NAME);

  return branches.find(
    (branch) =>
      branch.id === branchId &&
      branch.repositoryId === repositoryId
  );
}

function getBranchByName(repositoryId, name) {
  const branches = readJson(FILE_NAME);

  return branches.find(
    (branch) =>
      branch.repositoryId === repositoryId &&
      branch.name === name
  );
}

function createBranch(repositoryId, name, commitId = null) {
  const branches = readJson(FILE_NAME);

  const existingBranch = branches.find(
    (branch) =>
      branch.repositoryId === repositoryId &&
      branch.name === name
  );

  if (existingBranch) {
    return null;
  }

  const branch = {
    id: generateId("branch"),
    repositoryId,
    name,
    commitId,
    createdAt: new Date().toISOString(),
  };

  branches.push(branch);

  writeJson(FILE_NAME, branches);

  return branch;
}

function updateBranch(repositoryId, branchId, name, commitId) {
  const branches = readJson(FILE_NAME);

  const branchIndex = branches.findIndex(
    (branch) =>
      branch.id === branchId &&
      branch.repositoryId === repositoryId
  );

  if (branchIndex === -1) {
    return null;
  }

  const branch = branches[branchIndex];

  if (name !== undefined) {
    branch.name = name;
  }

  if (commitId !== undefined) {
    branch.commitId = commitId;
  }

  writeJson(FILE_NAME, branches);

  return branch;
}

function deleteBranch(repositoryId, branchId) {
  const branches = readJson(FILE_NAME);

  const branchIndex = branches.findIndex(
    (branch) =>
      branch.id === branchId &&
      branch.repositoryId === repositoryId
  );

  if (branchIndex === -1) {
    return null;
  }

  const deletedBranch = branches.splice(branchIndex, 1)[0];

  writeJson(FILE_NAME, branches);

  return deletedBranch;
}

module.exports = {
  getAllBranches,
  getBranchById,
  getBranchByName,
  createBranch,
  updateBranch,
  deleteBranch,
};