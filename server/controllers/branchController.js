const branchService = require("../services/branchService");

function getBranches(req, res) {
  try {
    const { repositoryId } = req.params;

    const branches =
      branchService.getAllBranches(repositoryId);

    res.status(200).json({
      success: true,
      data: branches,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch branches",
    });
  }
}

function getBranch(req, res) {
  try {
    const { repositoryId, branchId } = req.params;

    const branch =
      branchService.getBranchById(
        repositoryId,
        branchId
      );

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    res.status(200).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch branch",
    });
  }
}

function createBranch(req, res) {
  try {
    const { repositoryId } = req.params;
    const { name, commitId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Branch name is required",
      });
    }

    const branch =
      branchService.createBranch(
        repositoryId,
        name.trim(),
        commitId || null
      );

    if (!branch) {
      return res.status(409).json({
        success: false,
        message: "Branch with this name already exists",
      });
    }

    res.status(201).json({
      success: true,
      message: "Branch created successfully",
      data: branch,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create branch",
    });
  }
}

function updateBranch(req, res) {
  try {
    const { repositoryId, branchId } = req.params;
    const { name, commitId } = req.body;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Branch name cannot be empty",
      });
    }

    const branch =
      branchService.updateBranch(
        repositoryId,
        branchId,
        name !== undefined ? name.trim() : undefined,
        commitId
      );

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      data: branch,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update branch",
    });
  }
}

function deleteBranch(req, res) {
  try {
    const { repositoryId, branchId } = req.params;

    const branch =
      branchService.deleteBranch(
        repositoryId,
        branchId
      );

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Branch deleted successfully",
      data: branch,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete branch",
    });
  }
}

module.exports = {
  getBranches,
  getBranch,
  createBranch,
  updateBranch,
  deleteBranch,
};