const { readJson, writeJson } = require("../utils/jsonDb");
const generateId = require("../utils/idGenerator");

const FILE_NAME = "commits.json";

function getAllCommits(repositoryId) {
  const commits = readJson(FILE_NAME);

  return commits
    .filter((commit) => commit.repositoryId === repositoryId)
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );
}

function getCommitById(repositoryId, commitId) {
  const commits = readJson(FILE_NAME);

  return commits.find(
    (commit) =>
      commit.id === commitId &&
      commit.repositoryId === repositoryId
  );
}

function getLatestCommit(repositoryId) {
  const commits = readJson(FILE_NAME);

  const repositoryCommits = commits
    .filter(
      (commit) =>
        commit.repositoryId === repositoryId
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

  return repositoryCommits[0] || null;
}

function createCommit(
  repositoryId,
  message,
  files,
  parentId = null
) {
  const commits = readJson(FILE_NAME);

  const snapshot = files.map((file) => ({
    fileId: file.id,
    name: file.name,
    path: file.path,
    content: file.content,
  }));

  const commit = {
    id: generateId("commit"),
    repositoryId,
    message,
    parentId,
    snapshot,
    createdAt: new Date().toISOString(),
  };

  commits.push(commit);

  writeJson(FILE_NAME, commits);

  return commit;
}

module.exports = {
  getAllCommits,
  getCommitById,
  getLatestCommit,
  createCommit,
};