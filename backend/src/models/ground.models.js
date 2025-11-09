import mongoose, { Schema } from "mongoose";

const groundSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner:{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    description: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    ownerPassword: {
      type: String,
      required: true,
    },
    sportTypes: {
      type: [String],
      required: true,
      default: [],
    },
    location: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    availableHours: {
      start: { type: String, required: true },
      end: { type: String, required: true },
      slotDuration: 60,
    },
    photos: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    rules: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Ground = mongoose.model("Ground", groundSchema);
