const { readJson, writeJson } = require("../utils/jsonDb");

const FILE_NAME = "heads.json";

function getHead(repositoryId) {
  const heads = readJson(FILE_NAME);

  return (
    heads.find(
      (head) => head.repositoryId === repositoryId
    ) || null
  );
}

function setHead(repositoryId, commitId) {
  const heads = readJson(FILE_NAME);

  const headIndex = heads.findIndex(
    (head) => head.repositoryId === repositoryId
  );

  const now = new Date().toISOString();

  if (headIndex === -1) {
    const head = {
      repositoryId,
      commitId,
      updatedAt: now,
    };

    heads.push(head);

    writeJson(FILE_NAME, heads);

    return head;
  }

  heads[headIndex].commitId = commitId;
  heads[headIndex].updatedAt = now;

  writeJson(FILE_NAME, heads);

  return heads[headIndex];
}

module.exports = {
  getHead,
  setHead,
};