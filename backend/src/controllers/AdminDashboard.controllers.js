import { Admin } from "../models/Admin.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Booking } from "../models/booking.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Ground } from "../models/ground.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

let createAdmin = asyncHandler(async (req, res) => {
  let {
    username,
    phoneNumber,
    password,
    groundName,
    description,
    city,
    sportTypes,
    location,
    basePrice,
    availableHours,
    rules,
  } = req.body;
  let coverImage = req.files.coverImage ? req.files.coverImage[0] : null;
  let photos = req.files.photos ? req.files.photos : [];

  if (
    Object.values({
      username,
      phoneNumber,
      password,
      groundName,
      description,
      city,
      sportTypes,
      location,
      basePrice,
      availableHours,
      rules,
    }).some((val) => !val || val.toString().trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  availableHours = JSON.parse(req.body.availableHours);
  if (!coverImage) {
    throw new ApiError(400, "Cover image is required");
  }
  if (await Admin.findOne({ username })) {
    throw new ApiError(409, "Admin with same username already exists");
  }
  if (await Ground.findOne({ name: groundName })) {
    throw new ApiError(409, "Ground with same name already exists");
  }
  try {
    let admin = await Admin.create({
      username,
      phoneNumber,
      password,
    });
    if (!admin) throw new ApiError(500, "Error creating admin");
    let uploadedCoverImage = await uploadOnCloudinary(coverImage.path);
    if (!uploadedCoverImage)
      throw new ApiError(500, "Error uploading cover image");
    let uploadedPhotos = await Promise.all(
      photos.map((photo) => uploadOnCloudinary(photo.path))
    );
    if (!uploadedPhotos) {
      throw new ApiError(500, "Error uploading photos");
    }
    let ground = await Ground.create({
      name: groundName,
      owner: admin._id,
      description,
      city,
      sportTypes,
      location,
      basePrice,
      availableHours,
      rules,
      coverImage: {
        url: uploadedCoverImage.url,
        publicId: uploadedCoverImage.public_id,
      },
      photos: uploadedPhotos.map((photo) => ({
        url: photo.url,
        publicId: photo.public_id,
      })),
    });
    if (!ground) {
      console.log("admin deleted");

      await Admin.findByIdAndDelete(admin._id);
      throw new ApiError(500, "Error creating ground");
    }
    admin.ground = ground._id;
    await admin.save();
    res.status(201).json(new ApiResponse(201, admin, ground, "Admin created"));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      500,
      "Something went wrong while registering Admin",
      error
    );
  }
});

let loginAdmin = asyncHandler(async (req, res) => {
  let { username, password } = req.body;
  if (username.trim() == "" || password.trim() == "") {
    throw new ApiError(400, "All fields are required");
  }

  let admin;
  try {
    admin = await Admin.findOne({ username });
    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }
    let passwordCorrect = await admin.isPasswordCorrect(password);

    if (!passwordCorrect) {
      throw new ApiError(400, "Wrong password");
    }
    let { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      admin._id
    );

    let options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };
    console.log("Access and refresh token generated");

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { admin, accessToken, refreshToken },
          "Admin Loggedin Successfully"
        )
      );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Something went wrong", error);
  }
});

let logoutAdmin = asyncHandler(async (req, res) => {
  let admin = await Admin.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );
  let options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "", "Logout successful"));
});

let refreshAccessToken = async (req, res) => {
  let refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(498, "Refresh token not provided");
  }

  try {
    let decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    let admin = await Admin.findById(decoded?.id);

    if (!admin) {
      throw new ApiError(498, "Invalid refresh token");
    }

    if (refreshToken !== admin?.refreshToken) {
      throw new ApiError(498, "Wrong refresh token");
    }

    let { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(admin._id);

    let options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    req.user = admin;
    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options);
    console.log("Access and Refresh tokens refreshed");
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(400, "error refreshing access token");
  }
};

let generateAccessAndRefreshToken = async function (userId) {
  let admin = await Admin.findById(userId);

  try {
    let accessToken = await admin.generateAccessToken();
    let refreshToken = await admin.generateRefreshToken();
    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

const pendingBookings = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user._id).populate(
    "ground",
    "name location"
  );
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  const pendingBookings = await Booking.find({
    status: "pending",
    groundId: admin.ground._id,
  })
    .populate("userId", "username email")
    .populate("groundId", "name location");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        bookings: pendingBookings,
        ground: admin.ground,
      },
      "Pending bookings retrieved successfully"
    )
  );
});

const confirmedBookings = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user._id).populate(
    "ground",
    "name location"
  );
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  const bookings = await Booking.find({
    groundId: admin.ground._id,
    status: "confirmed",
  })
    .populate("userId", "username email")
    .populate("groundId", "name location")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        bookings,
        "Confirmed bookings retrieved successfully"
      )
    );
});

const confirmBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    throw new ApiError(400, "Booking ID is required");
  }

  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { status: "confirmed" },
    { new: true }
  )
    .populate("userId", "username email")
    .populate("groundId", "name location");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking confirmed successfully"));
});

const rejectBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    throw new ApiError(400, "Booking ID is required");
  }

  let booking = await Booking.findByIdAndDelete(bookingId, { new: true });
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Booking cancelled successfully"));
});

const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    throw new ApiError(400, "Booking ID is required");
  }

  const booking = await Booking.findByIdAndDelete(bookingId);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "Confirmed booking cancelled successfully")
    );
});

export {
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  generateAccessAndRefreshToken,
  pendingBookings,
  confirmedBookings,
  confirmBooking,
  rejectBooking,
  cancelBooking,
  createAdmin,
};
