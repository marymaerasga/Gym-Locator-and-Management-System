import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import validator from "validator";
import Admin from "../models/adminModel.js";
import GymOwner from "../models/gymOwnerModel.js";
import createToken from "../utils/createToken.js";

// desc     Auth user/set token
// route    POST /api/users/auth
// @access  Public
const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await Admin.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = createToken(user._id);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      message: "Login Successful!",
      token,
    });
  } else {
    res.status(401).json({ error: "Invalid email or password" });
  }
});

// desc     Logout user
// route    POST /api/users/logout
// @access  Public
const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Admin logged out" });
});

// desc     Get user profile
// route    GET /api/users/profile
// @access  Private
const getOwners = asyncHandler(async (req, res) => {
  const user = await GymOwner.find({});

  res.status(200).json(user);
});

// desc     Update user profile
// route    PUT /api/users/profile
// @access  Private
const approveGymStatus = asyncHandler(async (req, res) => {
  const id = req.body.id;

  const user = await GymOwner.findById(id);

  if (user) {
    try {
      user.gym.isApproved = "approved";

      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        status: updatedUser.gym.isApproved,
        message: "Gym Status Successfully Changed!!",
      });
    } catch (error) {
      res.status(400).json({ error: "Failed to update gym status" });
    }
  } else {
    res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({ user, message: "Gym Status Successful Changed!!" });
});

const rejectGymStatus = asyncHandler(async (req, res) => {
  const id = req.body.id;

  const user = await GymOwner.findById(id);

  if (user) {
    try {
      user.gym.isApproved = "rejected";

      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        status: updatedUser.gym.isApproved,
        message: "Gym Status Successfully Changed!!",
      });
    } catch (error) {
      res.status(400).json({ error: "Failed to update gym status" });
    }
  } else {
    res.status(404);

    throw new Error("User not found");
  }

  res.status(200).json({ user, message: "Gym Status Successful Changed!!" });
});

export { authAdmin, logoutAdmin, getOwners, approveGymStatus, rejectGymStatus };
