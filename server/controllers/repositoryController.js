const repositoryService = require("../services/repositoryService");

function getRepositories(req, res) {
  try {
    const repositories = repositoryService.getAllRepositories();

    res.json({
      success: true,
      data: repositories,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch repositories",
    });
  }
}

module.exports = {
  getRepositories,
};