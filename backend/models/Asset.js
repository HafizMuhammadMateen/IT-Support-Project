import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "assigned", "maintenance"],
      default: "available",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    purchaseDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Asset = mongoose.model("Asset", AssetSchema);
export default Asset;
