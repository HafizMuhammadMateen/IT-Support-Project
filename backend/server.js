import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/usersRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";  // Import email route
import si from "systeminformation"; // System information library

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" })); // Allow all origins

// Routes
app.use("/api/users", userRoutes);
app.use("/api/issues", issueRoutes); // ✅ This correctly registers issue routes
app.use("/api", emailRoutes);  // Use the email route
app.use("/uploads", express.static("uploads"));

// Hardware info API
app.get("/api/hardware", async (req, res) => {
  try {
    const cpu = await si.cpu();
    const memory = await si.mem();
    const system = await si.system();

    const hardwareList = [
      { id: 1, name: `${system.manufacturer} ${system.model}`, specs: `BIOS: ${system.version}` },
      { id: 2, name: `CPU - ${cpu.manufacturer}`, specs: `${cpu.brand}, ${cpu.speed}GHz, ${cpu.cores} Cores` },
      { id: 3, name: "Memory", specs: `${(memory.total / 1e9).toFixed(2)} GB RAM` },
    ];

    res.json(hardwareList);
  } catch (error) {
    console.error("Error fetching hardware info:", error);
    res.status(500).json({ error: "Failed to fetch hardware details" });
  }
});

app.get("/", (req, res) => {
  res.send("IT Support Pulse API is running...");
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`.bgGreen.black);
});
