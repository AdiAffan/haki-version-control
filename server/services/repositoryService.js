const { readJson, writeJson } = require("../utils/jsonDb");
const generateId = require("../utils/idGenerator");

const FILE_NAME = "repositories.json";

function getAllRepositories() {
  return readJson(FILE_NAME);
}

function getRepositoryById(id) {
  const repositories = readJson(FILE_NAME);

  return repositories.find((repository) => repository.id === id);
}

function createRepository(name, description = "") {
  const repositories = readJson(FILE_NAME);

  const repository = {
    id: generateId("repo"),
    name,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  repositories.push(repository);

  writeJson(FILE_NAME, repositories);

  return repository;
}

function updateRepository(id, name, description) {
  const repositories = readJson(FILE_NAME);

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex === -1) {
    return null;
  }

  const repository = repositories[repositoryIndex];

  if (name !== undefined) {
    repository.name = name;
  }

  if (description !== undefined) {
    repository.description = description;
  }

  repository.updatedAt = new Date().toISOString();

  writeJson(FILE_NAME, repositories);

  return repository;
}

function deleteRepository(id) {
  const repositories = readJson(FILE_NAME);

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex === -1) {
    return null;
  }

  const deletedRepository = repositories.splice(
    repositoryIndex,
    1
  )[0];

  writeJson(FILE_NAME, repositories);

  return deletedRepository;
}

module.exports = {
  getAllRepositories,
  getRepositoryById,
  createRepository,
  updateRepository,
  deleteRepository,
};