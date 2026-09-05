const { readJson, writeJson } = require("../utils/jsonDb");

const FILE_NAME = "repositories.json";

function getAllRepositories() {
  return readJson(FILE_NAME);
}

module.exports = {
  getAllRepositories,
};