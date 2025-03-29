import Issue from "../models/issueModel.js";

// ✅ Fetch all issues
export const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find(); // Fetch all issues from MongoDB
    res.status(200).json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ message: "Failed to fetch issues", error: error.message });
  }
};

// Update Issue
export const updateIssue = async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true } // Ensures the updated document is returned
    );

    if (!updatedIssue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(updatedIssue);
  } catch (error) {
    console.error("❌ Error updating issue:", error);
    res.status(500).json({ message: "Server error" });
  }
};
