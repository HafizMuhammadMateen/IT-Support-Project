import mongoose from "mongoose";

const issueSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    ticketNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Under Processing", "Closed"],
      default: "Pending",
    },
    hardwareInfo: {
      brand: { type: String, required: true },
      CPU: { type: String, required: true },
      RAM: { type: String, required: true },
      location: { type: String, required: true },
      owner: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;
