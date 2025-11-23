import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "video"],
      default: "text",
      required: true,
    },
    content: {
      type: String,
      required: function () {
        return this.messageType === "text";
      },
    },
    mediaUrl: {
      type: String,
      required: function () {
        return this.messageType === "image" || this.messageType === "video";
      },
    },
    mediaPublicId: {
      type: String, // Cloudinary public_id for deletion
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    readBy: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Index for faster queries
messageSchema.index({ createdAt: -1 });
messageSchema.index({ sender: 1 });

export const Message = mongoose.model("Message", messageSchema);
