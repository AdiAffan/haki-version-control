const { readJson, writeJson } = require("../utils/jsonDb");
const generateId = require("../utils/idGenerator");

const FILE_NAME = "repositoryFiles.json";

function getAllFiles(repositoryId) {
  const files = readJson(FILE_NAME);

  return files.filter(
    (file) => file.repositoryId === repositoryId
  );
}

function getFileById(repositoryId, fileId) {
  const files = readJson(FILE_NAME);

  return files.find(
    (file) =>
      file.id === fileId &&
      file.repositoryId === repositoryId
  );
}

function createFile(repositoryId, name, path, content = "") {
  const files = readJson(FILE_NAME);

  const file = {
    id: generateId("file"),
    repositoryId,
    name,
    path,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  files.push(file);

  writeJson(FILE_NAME, files);

  return file;
}

function updateFile(repositoryId, fileId, name, path, content) {
  const files = readJson(FILE_NAME);

  const fileIndex = files.findIndex(
    (file) =>
      file.id === fileId &&
      file.repositoryId === repositoryId
  );

  if (fileIndex === -1) {
    return null;
  }

  const file = files[fileIndex];

  if (name !== undefined) {
    file.name = name;
  }

  if (path !== undefined) {
    file.path = path;
  }

  if (content !== undefined) {
    file.content = content;
  }

  file.updatedAt = new Date().toISOString();

  writeJson(FILE_NAME, files);

  return file;
}

function deleteFile(repositoryId, fileId) {
  const files = readJson(FILE_NAME);

  const fileIndex = files.findIndex(
    (file) =>
      file.id === fileId &&
      file.repositoryId === repositoryId
  );

  if (fileIndex === -1) {
    return null;
  }

  const deletedFile = files.splice(fileIndex, 1)[0];

  writeJson(FILE_NAME, files);

  return deletedFile;
}

module.exports = {
  getAllFiles,
  getFileById,
  createFile,
  updateFile,
  deleteFile,
};