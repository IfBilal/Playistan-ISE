import { Ground } from "../models/ground.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const allGrounds = asyncHandler(async (req, res) => {
  const grounds = await Ground.find().populate("owner", "username phoneNumber");

  res
    .status(200)
    .json(new ApiResponse(200, grounds, "All grounds retrieved successfully"));
});

const filterGroundByCity = asyncHandler(async (req, res) => {
  const { city } = req.body;

  if (!city) {
    throw new ApiError(400, "City is required");
  }

  const grounds = await Ground.find({ city }).populate(
    "owner",
    "username phoneNumber"
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, grounds, `Grounds in ${city} retrieved successfully`)
    );
});

const sortAscending = asyncHandler(async (req, res) => {
  const grounds = await Ground.find()
    .sort({ basePrice: 1 })
    .populate("owner", "username phoneNumber");

  res
    .status(200)
    .json(
      new ApiResponse(200, grounds, "Grounds sorted by price (low to high)")
    );
});

const sortDescending = asyncHandler(async (req, res) => {
  const grounds = await Ground.find()
    .sort({ basePrice: -1 })
    .populate("owner", "username phoneNumber");

  res
    .status(200)
    .json(
      new ApiResponse(200, grounds, "Grounds sorted by price (high to low)")
    );
});

export { allGrounds, filterGroundByCity, sortAscending, sortDescending };
