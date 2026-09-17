const repositoryService = require("../services/repositoryService");

function getRepositories(req, res) {
  try {
    const repositories = repositoryService.getAllRepositories();

    res.status(200).json({
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

function getRepository(req, res) {
  try {
    const { id } = req.params;

    const repository = repositoryService.getRepositoryById(id);

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: "Repository not found",
      });
    }

    res.status(200).json({
      success: true,
      data: repository,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch repository",
    });
  }
}

function createRepository(req, res) {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Repository name is required",
      });
    }

    const repository = repositoryService.createRepository(
      name.trim(),
      description?.trim() || ""
    );

    res.status(201).json({
      success: true,
      message: "Repository created successfully",
      data: repository,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create repository",
    });
  }
}

function updateRepository(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Repository name cannot be empty",
      });
    }

    const repository = repositoryService.updateRepository(
      id,
      name?.trim(),
      description?.trim()
    );

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: "Repository not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Repository updated successfully",
      data: repository,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update repository",
    });
  }
}

function deleteRepository(req, res) {
  try {
    const { id } = req.params;

    const repository = repositoryService.deleteRepository(id);

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: "Repository not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Repository deleted successfully",
      data: repository,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete repository",
    });
  }
}

module.exports = {
  getRepositories,
  getRepository,
  createRepository,
  updateRepository,
  deleteRepository,
};