import express from "express";
import Issue from "../models/issueModel.js";
import si from "systeminformation"; // Import systeminformation

const router = express.Router();

// Function to generate a unique ticket number
const generateTicketNumber = () => `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

// ✅ Route to fetch all inventory issues
router.get("/inventory", async (req, res) => {
  try {
    const issues = await Issue.find(); // Fetch all issues from MongoDB

    // ✅ Transform issues to match InventoryList structure
    const formattedIssues = issues.map((issue) => ({
      id: issue._id,
      ticketNumber: issue.ticketNumber,
      issueTitle: issue.title,
      issuerName: issue.userName,
      hardwareDetails: {
        device: issue.hardwareInfo.brand,
        processor: issue.hardwareInfo.CPU,
        ram: issue.hardwareInfo.RAM,
        location: issue.hardwareInfo.location,
        owner: issue.hardwareInfo.owner,
      },
    }));

    res.json(formattedIssues);
  } catch (error) {
    console.error("Error fetching inventory issues:", error);
    res.status(500).json({ error: "Error fetching inventory data" });
  }
});

// ✅ Create a new issue with real-time hardware info
router.post("/", async (req, res) => {
  try {
    const { title, description, userName, userEmail } = req.body;

    if (!title || !description || !userName || !userEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch real-time hardware details
    const cpuInfo = await si.cpu();
    const memInfo = await si.mem();
    const systemInfo = await si.system();

    const ticketNumber = generateTicketNumber(); // Generate a unique ticket number

    const newIssue = new Issue({
      title,
      description,
      userName,
      userEmail,
      ticketNumber,
      status: "Pending",
      hardwareInfo: {
        brand: systemInfo.manufacturer || "Unknown",
        CPU: cpuInfo.brand,
        RAM: `${(memInfo.total / 1e9).toFixed(2)} GB`, // Convert bytes to GB
        location: "Auto-Detected", // Modify if location tracking is needed
        owner: userName, // Assign issue creator as owner
      },
    });

    await newIssue.save();
    res.status(201).json(newIssue);
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ message: "Error creating issue", error });
  }
});

// ✅ Get all issues (For Admin Dashboard)
router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: "Error fetching issues", error });
  }
});

// ✅ Get issues by User Email
router.get("/user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const issues = await Issue.find({ userEmail: email });

    if (issues.length === 0) {
      return res.status(200).json({ message: "No issues reported yet." });
    }

    res.json(issues);
  } catch (error) {
    console.error("Error fetching user issues:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get a single issue by ID
router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json(issue);
  } catch (error) {
    console.error("Error fetching issue:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update an issue by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title.trim() || !description.trim()) {
      return res.status(400).json({ message: "Title and description cannot be empty" });
    }

    const issue = await Issue.findByIdAndUpdate(
      id,
      { title, description }, // ✅ Now updating both fields
      { new: true } // ✅ Ensures updated issue is returned
    );

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json(issue);
  } catch (error) {
    console.error("❌ Error updating issue:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update issue status (For Admin)
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("Received ID:", id);
    console.log("Received Status:", status);

    if (!status || typeof status !== "string" || !status.trim()) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (!["Pending", "Under Processing", "Closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const issue = await Issue.findByIdAndUpdate(id, { status }, { new: true });

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json(issue);
  } catch (error) {
    console.error("Error updating issue status:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
