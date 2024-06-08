import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const regiterUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { username, password, fullName, email } = req.body;

  if (
    [username, password, fullName, email].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if the user already exissts
  if (await User.findOne({ username })) {
    throw new ApiError(409, "user with this username already exists");
  }
  if (await User.findOne({ email })) {
    throw new ApiError(409, "user with this email already exists");
  }

  // both conditions can be checked by :
  // if (
  //   await User.findOne({
  //     $or: [{ username }, { email }],
  //   })
  // ) {
  //   throw new ApiError(409, "user with email or username exists");
  // } // but cannot have custom messages for each

  // Check for avatar and coverImage
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.lenght > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    email,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
  });

  // Check the user is created , and remove pass & refreshToken before sending it to frontend
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" //Remove these columns
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created "));
});
