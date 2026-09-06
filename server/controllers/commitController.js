const commitService = require("../services/commitService");
const fileService = require("../services/fileService");

function getCommits(req, res) {
  try {
    const { repositoryId } = req.params;

    const commits =
      commitService.getAllCommits(repositoryId);

    res.status(200).json({
      success: true,
      data: commits,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch commits",
    });
  }
}

function getCommit(req, res) {
  try {
    const { repositoryId, commitId } = req.params;

    const commit =
      commitService.getCommitById(
        repositoryId,
        commitId
      );

    if (!commit) {
      return res.status(404).json({
        success: false,
        message: "Commit not found",
      });
    }

    res.status(200).json({
      success: true,
      data: commit,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch commit",
    });
  }
}

function createCommit(req, res) {
  try {
    const { repositoryId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Commit message is required",
      });
    }

    const files =
      fileService.getAllFiles(repositoryId);

    const latestCommit =
      commitService.getLatestCommit(repositoryId);

    const commit =
      commitService.createCommit(
        repositoryId,
        message.trim(),
        files,
        latestCommit?.id || null
      );

    res.status(201).json({
      success: true,
      message: "Commit created successfully",
      data: commit,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create commit",
    });
  }
}

module.exports = {
  getCommits,
  getCommit,
  createCommit,
};