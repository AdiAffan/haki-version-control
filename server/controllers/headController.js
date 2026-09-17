const headService = require("../services/headService");
const commitService = require("../services/commitService");

function getHead(req, res) {
  try {
    const { repositoryId } = req.params;

    const head = headService.getHead(repositoryId);

    if (!head) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    const commit = commitService.getCommitById(
      repositoryId,
      head.commitId
    );

    res.status(200).json({
      success: true,
      data: {
        ...head,
        commit,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch HEAD",
    });
  }
}

module.exports = {
  getHead,
};