import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema({
  groundId: {
    type: Schema.Types.ObjectId,
    ref: "Ground",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  screenshot: {
    type: String,
    required: true,
  },
  screenshotPublicId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Booking = mongoose.model("Booking", bookingSchema);
