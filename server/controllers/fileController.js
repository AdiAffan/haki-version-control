const fileService = require("../services/fileService");

function getFiles(req, res) {
  try {
    const { repositoryId } = req.params;

    const files = fileService.getAllFiles(repositoryId);

    res.status(200).json({
      success: true,
      data: files,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch files",
    });
  }
}

function getFile(req, res) {
  try {
    const { repositoryId, fileId } = req.params;

    const file = fileService.getFileById(
      repositoryId,
      fileId
    );

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.status(200).json({
      success: true,
      data: file,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch file",
    });
  }
}

function createFile(req, res) {
  try {
    const { repositoryId } = req.params;
    const { name, path, content } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "File name is required",
      });
    }

    if (!path || !path.trim()) {
      return res.status(400).json({
        success: false,
        message: "File path is required",
      });
    }

    const file = fileService.createFile(
      repositoryId,
      name.trim(),
      path.trim(),
      content || ""
    );

    res.status(201).json({
      success: true,
      message: "File created successfully",
      data: file,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create file",
    });
  }
}

function updateFile(req, res) {
  try {
    const { repositoryId, fileId } = req.params;
    const { name, path, content } = req.body;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "File name cannot be empty",
      });
    }

    if (path !== undefined && !path.trim()) {
      return res.status(400).json({
        success: false,
        message: "File path cannot be empty",
      });
    }

    const file = fileService.updateFile(
      repositoryId,
      fileId,
      name?.trim(),
      path?.trim(),
      content
    );

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "File updated successfully",
      data: file,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update file",
    });
  }
}

function deleteFile(req, res) {
  try {
    const { repositoryId, fileId } = req.params;

    const file = fileService.deleteFile(
      repositoryId,
      fileId
    );

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
      data: file,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete file",
    });
  }
}

module.exports = {
  getFiles,
  getFile,
  createFile,
  updateFile,
  deleteFile,
};