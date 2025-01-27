import mongoose from "mongoose";

const failedNotificationSchema = new mongoose.Schema(
  {
    originalMessage: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    error: {
      type: String,
      required: true,
    },
    retryCount: {
      type: Number,
      required: true,
    },
    diedAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["failed", "resolved", "investigating"],
      default: "failed",
    },
    resolution: {
      type: String,
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("failed_notifications", failedNotificationSchema);
