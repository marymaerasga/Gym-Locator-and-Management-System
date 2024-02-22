import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import validator from "validator";
import GymOwner from "../models/gymOwnerModel.js";
import Class from "../models/classModel.js";
import User from "../models/userModel.js";
import Trainer from "../models/trainerModel.js";
import calculateEndTime from "../utils/calculateEndTime.js";
import createPreset from "../utils/createPreset.js";
import cloudinary from "../utils/cloudinary.js";

import createToken from "../utils/createToken.js";
import isValid24HourTime from "../utils/validateTime.js";
import fs from "fs";
import path from "path";

// import mongoose from "mongoose";
import { ObjectId } from "mongodb";

// desc     Auth user/set token
// route    POST /api/users/auth
// @access  Public
const authOwner = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await GymOwner.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ error: "Email is not yet registered." });
  }

  if (user?.gym.isApproved !== "approved") {
    res.status(401).json({
      error: `${user?.gym.gymname} is ${
        user?.gym.isApproved === "rejected"
          ? "rejected by admin."
          : "still for admin approval."
      }`,
    });

    throw new Error(
      `${user?.gym.gymname} is ${
        user?.gym.isApproved === "rejected"
          ? "rejected by admin."
          : "still for admin approval."
      }`
    );
  }

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

    throw new Error("Invalid email or password.");
  }
});

const registerOwner = asyncHandler(async (req, res) => {
  const newMongoDbUserId = new ObjectId();
  const {
    firstname,
    middlename,
    lastname,
    email,
    password,
    gymname,
    contact,
    address,
    gymLocation,
    gcashNumber,
    description,
    startday,
    endday,
    opentime,
    closetime,
    gymImage,
    permitImage,
  } = req.body;

  const trimmedFirstName = validator.trim(firstname);
  const trimmedMiddleName = validator.trim(middlename);
  const trimmedLastName = validator.trim(lastname);
  const trimmedPassword = validator.trim(password);
  const trimmedGymName = validator.trim(gymname);
  const trimmedContact = validator.trim(contact);
  const trimmedGCashNumber = validator.trim(gcashNumber);
  const trimmedDesc = validator.trim(description);
  const trimmedAddress = validator.trim(address);

  if (!validator.isLength(trimmedFirstName, { min: 1 })) {
    return res.status(400).json({ error: "First name is required." });
  }

  if (!validator.isLength(trimmedMiddleName, { min: 1 })) {
    return res.status(400).json({ error: "Middle name is required." });
  }

  if (!validator.isLength(trimmedLastName, { min: 1 })) {
    return res.status(400).json({ error: "Last name is required." });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  if (!validator.isLength(trimmedGymName, { min: 1 })) {
    return res.status(400).json({ error: "Gym name is required." });
  }

  if (!validator.isLength(trimmedContact, { min: 1 })) {
    return res.status(400).json({ error: "Contact number is required" });
  }

  if (!validator.isLength(trimmedGCashNumber, { min: 1 })) {
    return res.status(400).json({ error: "GCash number is required" });
  }

  if (!validator.isLength(trimmedAddress, { min: 1 })) {
    return res.status(400).json({ error: "Gym Address is required." });
  }

  if (!Array.isArray(gymLocation) && gymLocation.length === 0) {
    return res.status(400).json({ error: "Location is invalid" });
  }

  if (!validator.isLength(trimmedDesc, { min: 1 })) {
    return res.status(400).json({ error: "Gym Description is required." });
  }

  if (!validator.isLength(startday, { min: 1 })) {
    return res.status(400).json({ error: "Opening day is required." });
  }

  if (!validator.isLength(endday, { min: 1 })) {
    return res.status(400).json({ error: "Closing day is required." });
  }

  if (!validator.isLength(opentime, { min: 1 })) {
    return res.status(400).json({ error: "Opening time is required." });
  }

  if (!validator.isLength(closetime, { min: 1 })) {
    return res.status(400).json({ error: "Closing time is required." });
  }

  const hasUpperCase = /[A-Z]/.test(trimmedPassword);
  const hasLowerCase = /[a-z]/.test(trimmedPassword);
  const hasDigit = /\d/.test(trimmedPassword);

  if (
    !validator.isLength(trimmedPassword, { min: 8 }) ||
    !(hasUpperCase && hasLowerCase && hasDigit)
  ) {
    return res.status(400).json({
      error:
        "Password must be atleast 8 characters and contain at least one uppercase letter, one lowercase letter, and one digit.",
    });
  }

  const userExists = await GymOwner.findOne({ email: email.toLowerCase() });

  if (userExists) {
    res.status(400).json({ error: "User already exists." });
    throw new Error("User already exists.");
  }

  if (permitImage && gymImage) {
    const [uploadPermitImage, uploadGymImage] = await Promise.all([
      cloudinary.uploader.upload(permitImage, {
        upload_preset: "business-permits",
      }),
      cloudinary.uploader.upload(gymImage, { upload_preset: "gym-image" }),
    ]);

    if (!uploadPermitImage || !uploadGymImage) {
      throw new Error("Failed to upload one or more images");
    }

    const newUser = await GymOwner.create({
      firstname: trimmedFirstName,
      middlename: trimmedMiddleName,
      lastname: trimmedLastName,
      email: email.toLowerCase(),
      password: trimmedPassword,
      gym: {
        gymname: trimmedGymName,
        contact: trimmedContact,
        gcashNumber: trimmedGCashNumber,
        description: trimmedDesc,
        address: trimmedAddress,
        gymLocation: gymLocation,
        permitImage: uploadPermitImage,
        gymImage: uploadGymImage,
        schedule: {
          startday: startday,
          endday: endday,
          opentime: opentime,
          closetime: closetime,
        },
      },
    });

    return res.status(201).json({
      message: "Successfully created new account",
      gymname: newUser.gym.gymname,
    });
  } else {
    res.status(400).json({
      message: "Missing image files",
    });
  }
});

// desc     Logout user
// route    POST /api/users/logout
// @access  Public
const logoutOwner = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User logged out" });
});

// GYM OWNER DASHBOARD  //

const getOwnerDashboard = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    throw new Error("User not found");
  }

  res.status(200).json(user.gym.members);
});

// GYM OWNER PROFILE //

const getOwnerProfile = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    firstname: user.firstname,
    middlename: user.middlename,
    lastname: user.lastname,
    email: user.email,
  });
});

const updateOwnerProfile = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const trimmedFirstName = validator.trim(req.body.firstname);
  const trimmedMiddleName = validator.trim(req.body.middlename);
  const trimmedLastName = validator.trim(req.body.lastname);

  if (!trimmedFirstName || !trimmedLastName || !trimmedMiddleName) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  if (user) {
    user.firstname = trimmedFirstName || user.firstname;
    user.middlename = trimmedMiddleName || user.middlename;
    user.lastname = trimmedLastName || user.lastname;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.status(200).json({
      firstname: updatedUser.firstname,
      middlename: updatedUser.middlename,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      message: "Successfuly updated owner profile!",
    });
  } else {
    res.status(404);

    throw new Error("User not found");
  }
});

// GYM DETAILS //

const getGymDetails = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    gymname: user.gym.gymname,
    address: user.gym.address,
    contact: user.gym.contact,
    description: user.gym.description,
    schedule: user.gym.schedule,
    time: user.gym.time,
  });
});

const updateGymDetails = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const {
    // gymname,
    address,
    contact,
    description,
    startday,
    endday,
    opentime,
    closetime,
  } = req.body;

  // const trimmedGymName = validator.trim(gymname);
  const trimmedAddress = validator.trim(address);
  const trimmedContact = validator.trim(contact);
  const trimmedDescription = validator.trim(description);

  // if (!validator.isLength(trimmedGymName, { min: 1 })) {
  //   return res.status(400).json({ error: "Gym name is required." });
  // }

  if (!validator.isLength(trimmedAddress, { min: 1 })) {
    return res.status(400).json({ error: "Gym address is required." });
  }

  if (!validator.isLength(trimmedContact, { min: 1 })) {
    return res.status(400).json({ error: "Gym contact is required." });
  }

  if (!validator.isLength(trimmedDescription, { min: 1 })) {
    return res.status(400).json({ error: "Gym description is required." });
  }

  if (!isValid24HourTime(opentime)) {
    res.status(400).json({ message: `${opentime} is not a valid time.` });
  }

  if (!isValid24HourTime(closetime)) {
    res.status(400).json({ message: `${closetime} is not a valid time.` });
  }

  if (user) {
    // user.gym.gymname = trimmedGymName || user.gym.gymname;
    user.gym.address = trimmedAddress || user.gym.address;
    user.gym.contact = trimmedContact || user.gym.contact;
    user.gym.description = trimmedDescription || user.gym.description;
    user.gym.schedule.startday = startday || user.gym.schedule.startday;
    user.gym.schedule.endday = endday || user.gym.schedule.endday;
    user.gym.schedule.opentime = opentime || user.gym.schedule.opentime;
    user.gym.schedule.closetime = closetime || user.gym.schedule.closetime;

    const updatedUser = await user.save();

    res.status(200).json({
      gymname: updatedUser.gym.gymname,
      address: updatedUser.gym.address,
      contact: updatedUser.gym.contact,
      description: updatedUser.gym.description,
      startday: updatedUser.gym.schedule.startday,
      endday: updatedUser.gym.schedule.endday,
      opentime: updatedUser.gym.schedule.opentime,
      closetime: updatedUser.gym.schedule.closetime,
      message: "Successfuly updated gym details!",
    });
  } else {
    res.status(404);

    throw new Error("User not found");
  }
});

// SERVICES //

const getGymServices = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    throw new Error("User not found");
  }

  res.status(200).json(user.gym.services);
});

const addGymServices = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { serviceName, description, serviceImage } = req.body;

  const trimmedServiceName = validator.trim(serviceName);
  const trimmedDescription = validator.trim(description);

  if (!validator.isLength(trimmedServiceName, { min: 1 })) {
    return res.status(400).json({ error: "Service name is required." });
  }

  if (!validator.isLength(trimmedDescription, { min: 1 })) {
    return res.status(400).json({ error: "Service description is required." });
  }

  if (!validator.isLength(serviceImage, { min: 1 })) {
    return res.status(400).json({ error: "Service image is required." });
  }

  if (serviceImage) {
    const uploadRes = await cloudinary.uploader.upload(serviceImage, {
      upload_preset: "service",
    });

    if (uploadRes) {
      const newService = {
        serviceName: trimmedServiceName,
        description: trimmedDescription,
        serviceImage: uploadRes,
      };

      user.gym.services.push(newService);

      await user.save();

      return res.status(200).json({
        message: "Successfully added new service",
      });
    } else {
      res.status(400).json({
        message: "Failed to add new service",
      });
      throw new Error("Failed to add new service");
    }
  }
});

const updateGymServices = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    throw new Error("User not found");
  }

  const { id, serviceName, description, serviceImage, publicId } = req.body;

  const trimmedServiceName = validator.trim(serviceName);
  const trimmedServiceDescription = validator.trim(description);

  if (!validator.isLength(trimmedServiceName, { min: 1 })) {
    return res.status(400).json({ error: "Service name is required." });
  }

  if (!validator.isLength(trimmedServiceDescription, { min: 1 })) {
    return res.status(400).json({ error: "Service description is required." });
  }

  const index = user.gym.services.findIndex((service) => service.id === id);

  if (index !== -1) {
    // Update the service at the found index
    if (serviceImage.length > 0 && typeof serviceImage === "string") {
      const uploadRes = await cloudinary.uploader.upload(serviceImage, {
        upload_preset: "service",
      });

      user.gym.services[index] = {
        ...user.gym.services[index],
        serviceName: trimmedServiceName,
        description: trimmedServiceDescription,
        serviceImage: uploadRes,
      };

      // Save the updated user
      await user.save();

      await cloudinary.uploader.destroy(publicId);

      return res.status(200).json({ message: "Successfully updated service!" });
    } else {
      user.gym.services[index] = {
        ...user.gym.services[index],
        serviceName: trimmedServiceName,
        description: trimmedServiceDescription,
        serviceImage: user.gym.services[index].serviceImage,
      };

      // Save the updated user
      await user.save();

      await cloudinary.uploader.destroy(publicId);

      return res.status(200).json({ message: "Successfully updated service!" });
    }
  } else {
    res.status(404).json({ error: "Failed to update service" });
    throw new Error("Failed to update service");
  }
});

const deleteGymServices = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);
  const { id, publicId } = req.body;

  if (!user) {
    res.status(404).json({ error: "User not found." });
  }

  const serviceToRemove = user.gym.services.find(
    (service) => service.id === id
  );

  if (!serviceToRemove) {
    res.status(404).json({ error: "Service not found." });
  }

  const remainingServices = user.gym.services.filter(
    (service) => service.id !== id
  );

  user.gym.services = [...remainingServices];

  const deleteImage = await cloudinary.uploader.destroy(publicId);

  if (deleteImage) {
    await user.save();
    return res.status(200).json({ message: "Successfully deleted service" });
  } else {
    res.status(400).json({ message: "Failed to delete service" });
    throw new Error("Failed to delete service");
  }
});

// AMENITIES //

const getGymAmenities = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    throw new Error("User not found");
  }

  res.status(200).json(user.gym.amenities);
});

const addGymAmenities = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Extract the new equipment data from the request body
  const { amenityName, description, amenityImage } = req.body;

  const trimmedAmenity = validator.trim(amenityName);
  const trimmedDescription = validator.trim(description);

  if (!validator.isLength(trimmedAmenity, { min: 1 })) {
    return res.status(400).json({ error: "Amenity name is required." });
  }

  if (!validator.isLength(trimmedDescription, { min: 1 })) {
    return res.status(400).json({ error: "Amenity description is required." });
  }

  if (!validator.isLength(amenityImage, { min: 1 })) {
    return res.status(400).json({ error: "Amenity image is required." });
  }

  if (amenityImage) {
    const uploadRes = await cloudinary.uploader.upload(amenityImage, {
      upload_preset: "amenity",
    });

    if (uploadRes) {
      const newAmenity = {
        amenityName: trimmedAmenity,
        description: trimmedDescription,
        amenityImage: uploadRes,
      };

      user.gym.amenities.push(newAmenity);

      await user.save();

      return res.status(200).json({
        message: "Successfully added new amenity",
      });
    } else {
      res.status(400).json({
        message: "Failed to add new amenity",
      });
      throw new Error("Failed to add new amenity");
    }
  }
});

const updateGymAmenities = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    throw new Error("User not found");
  }

  const { id, amenityName, description, amenityImage, publicId } = req.body;

  // return console.log(id, amenityName, description, amenityImage, publicId);

  const trimmedAmenityName = validator.trim(amenityName);
  const trimmedAmenityDescription = validator.trim(description);

  if (!validator.isLength(trimmedAmenityName, { min: 1 })) {
    return res.status(400).json({ error: "Amenity name is required." });
  }

  if (!validator.isLength(trimmedAmenityDescription, { min: 1 })) {
    return res.status(400).json({ error: "Amenity description is required." });
  }

  const index = user.gym.amenities.findIndex((amenity) => amenity.id === id);

  if (index !== -1) {
    // Update the service at the found index
    if (amenityImage.length > 0 && typeof amenityImage === "string") {
      const uploadRes = await cloudinary.uploader.upload(amenityImage, {
        upload_preset: "amenity",
      });

      user.gym.amenities[index] = {
        ...user.gym.amenities[index],
        amenityName: trimmedAmenityName,
        description: trimmedAmenityDescription,
        amenityImage: uploadRes,
      };

      // Save the updated user
      await user.save();

      await cloudinary.uploader.destroy(publicId);

      return res.status(200).json({ message: "Successfully updated amenity!" });
    } else {
      user.gym.amenities[index] = {
        ...user.gym.amenities[index],
        amenityName: trimmedAmenityName,
        description: trimmedAmenityDescription,
        amenityImage: user.gym.amenities[index].amenityImage,
      };

      // Save the updated user
      await user.save();

      await cloudinary.uploader.destroy(publicId);

      return res.status(200).json({ message: "Successfully updated amenity!" });
    }
  } else {
    res.status(404).json({ error: "Failed to update amenity" });
    throw new Error("Failed to update amenity");
  }
});

const deleteGymAmenities = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);
  const { id, publicId } = req.body;

  if (!user) {
    res.status(404).json({ error: "User not found." });
  }

  const amenityToRemove = user.gym.amenities.find(
    (amenity) => amenity.id === id
  );

  if (!amenityToRemove) {
    res.status(404).json({ error: "Amenity not found." });
  }

  const remainingAmenities = user.gym.amenities.filter(
    (amenity) => amenity.id !== id
  );

  user.gym.amenities = [...remainingAmenities];

  const deleteImage = await cloudinary.uploader.destroy(publicId);

  if (deleteImage) {
    await user.save();
    return res.status(200).json({ message: "Successfully deleted amenity" });
  } else {
    res.status(400).json({ message: "Failed to delete amenity" });
    throw new Error("Failed to delete amenity");
  }
});

// EQUIPMENTS //

const getGymEquipments = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    throw new Error("User not found");
  }

  res.status(200).json(user.gym.equipments);
});

const addGymEquipments = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Extract the new equipment data from the request body
  const { equipmentName, description, equipmentImage } = req.body;

  const trimmedEquipmentName = validator.trim(equipmentName);
  const trimmedDescription = validator.trim(description);

  if (!validator.isLength(trimmedEquipmentName, { min: 1 })) {
    return res.status(400).json({ error: "Equipment name is required." });
  }

  if (!validator.isLength(trimmedDescription, { min: 1 })) {
    return res
      .status(400)
      .json({ error: "Equipment description is required." });
  }

  if (!validator.isLength(equipmentImage, { min: 1 })) {
    return res.status(400).json({ error: "Equipment image is required." });
  }

  if (equipmentImage) {
    const uploadRes = await cloudinary.uploader.upload(equipmentImage, {
      upload_preset: "equipment",
    });

    if (uploadRes) {
      const newEquipment = {
        equipmentName: trimmedEquipmentName,
        description: trimmedDescription,
        equipmentImage: uploadRes,
      };

      user.gym.equipments.push(newEquipment);

      await user.save();

      return res.status(200).json({
        message: "Successfully added new equipment",
      });
    } else {
      res.status(400).json({
        message: "Failed to add new equipment",
      });
      throw new Error("Failed to add new equipment");
    }
  }
});

const updateGymEquipments = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    throw new Error("User not found");
  }

  const { id, equipmentName, description, equipmentImage, publicId } = req.body;

  const trimmedEquipmentName = validator.trim(equipmentName);
  const trimmedEquipmentDescription = validator.trim(description);

  if (!validator.isLength(trimmedEquipmentName, { min: 1 })) {
    return res.status(400).json({ error: "Equipment name is required." });
  }

  if (!validator.isLength(trimmedEquipmentDescription, { min: 1 })) {
    return res
      .status(400)
      .json({ error: "Equipment description is required." });
  }

  const index = user.gym.equipments.findIndex(
    (equipment) => equipment.id === id
  );

  if (index !== -1) {
    // Update the service at the found index
    if (equipmentImage.length > 0 && typeof equipmentImage === "string") {
      const uploadRes = await cloudinary.uploader.upload(equipmentImage, {
        upload_preset: "equipment",
      });

      user.gym.equipments[index] = {
        ...user.gym.equipments[index],
        equipmentName: trimmedEquipmentName,
        description: trimmedEquipmentDescription,
        equipmentImage: uploadRes,
      };

      // Save the updated user
      await user.save();

      await cloudinary.uploader.destroy(publicId);

      return res
        .status(200)
        .json({ message: "Successfully updated equipment!" });
    } else {
      user.gym.equipments[index] = {
        ...user.gym.equipments[index],
        equipmentName: trimmedEquipmentName,
        description: trimmedEquipmentDescription,
        equipmentImage: user.gym.equipments[index].equipmentImage,
      };

      // Save the updated user
      await user.save();

      await cloudinary.uploader.destroy(publicId);

      return res
        .status(200)
        .json({ message: "Successfully updated equipment!" });
    }
  } else {
    res.status(404).json({ error: "Failed to update equipment" });
    throw new Error("Failed to update equipment");
  }
});

const deleteGymEquipment = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);
  const { id, publicId } = req.body;

  if (!user) {
    res.status(404).json({ error: "User not found." });
  }

  const equipmentToRemove = user.gym.equipments.find(
    (equipment) => equipment.id === id
  );

  if (!equipmentToRemove) {
    res.status(404).json({ error: "Equipment not found." });
  }

  const remainingEquipments = user.gym.equipments.filter(
    (equipment) => equipment.id !== id
  );

  user.gym.equipments = [...remainingEquipments];

  const deleteImage = await cloudinary.uploader.destroy(publicId);

  if (deleteImage) {
    await user.save();
    return res.status(200).json({ message: "Successfully deleted equipment" });
  } else {
    res.status(400).json({ message: "Failed to delete equipment" });
    throw new Error("Failed to delete equipment");
  }
});

// Gym Plans

const getGymPlans = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    throw new Error("User not found");
  }

  res.status(200).json(user.gym.plans);
});

const addGymPlans = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Extract the new equipment data from the request body
  const { planName, duration, amount } = req.body;

  const trimmedPlanName = validator.trim(planName);

  if (!validator.isLength(trimmedPlanName, { min: 1 })) {
    return res.status(400).json({ error: "Plan name is required." });
  }

  if (!validator.isNumeric(duration)) {
    return res.status(400).json({ error: "Duration must be a valid number." });
  }

  const numericDuration = parseFloat(duration);

  if (numericDuration === 0) {
    return res.status(400).json({ error: "Duration must not be zero." });
  }

  if (!validator.isNumeric(amount)) {
    return res.status(400).json({ error: "Amount must be a valid number." });
  }

  const numericAmount = parseFloat(amount);

  if (numericAmount === 0) {
    return res.status(400).json({ error: "Amount must not be zero." });
  }

  // const validPlans = ["annual", "semi-annual", "monthly"];
  // if (!validPlans.includes(plan)) {
  //   return res.status(400).json({
  //     error: "Invalid plan. Valid plans are: annual, semi-annual, monthly",
  //   });
  // }

  // const isPlanAlreadyAdded = user.gym.plans.some(
  //   (existingPlan) => existingPlan.plan === plan
  // );

  // if (isPlanAlreadyAdded) {
  //   return res.status(400).json({ error: "Plan is already present." });
  // }

  const newOwnerPlan = {
    planName: trimmedPlanName,
    duration: duration,
    amount: amount,
  };

  // Add the new plan to the existing equipment list
  user.gym.plans.push(newOwnerPlan);

  // Save the updated user with the new equipment
  await user.save();

  // Respond with the updated user profile
  res.status(200).json({
    message: "Successfully added new plan",
  });
});

const updateGymPlans = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    throw new Error("User not found");
  }

  const { id, planName, duration, amount } = req.body;

  const trimmedPlanName = validator.trim(planName);

  if (!validator.isLength(trimmedPlanName, { min: 1 })) {
    return res.status(400).json({ error: "Plan name is invalid." });
  }

  if (!validator.isInt(String(duration))) {
    return res.status(400).json({ error: "Duration must be a valid number." });
  }

  if (duration === 0) {
    return res.status(400).json({ error: "Duration must not be zero." });
  }

  if (!validator.isInt(String(amount))) {
    return res.status(400).json({ error: "Amount must be a valid number." });
  }

  if (amount === 0) {
    return res.status(400).json({ error: "Amount must not be zero." });
  }

  const index = user.gym.plans.findIndex((plan) => plan.id === id);

  if (index !== -1) {
    // Update the service at the found index
    user.gym.plans[index] = {
      id: id,
      planName: trimmedPlanName,
      duration: duration,
      amount: amount,
    };

    await user.save();

    res.status(200).json({ message: "Successfully updated plan!" });
  } else {
    res.status(404).json({ error: "Plan not found" });
  }
});

const deleteGymPlan = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);
  const { id } = req.body;

  if (!user) {
    res.status(404).json({ error: "User not found." });
  }

  const planToRemove = user.gym.plans.find((plan) => plan.id === id);

  if (!planToRemove) {
    res.status(404).json({ error: "Plan not found." });
  }

  const remainingPlans = user.gym.plans.filter((plan) => plan.id !== id);

  user.gym.plans = [...remainingPlans];

  await user.save();

  res.status(200).json({ message: "Successfully deleted plan" });
});

// GYM TRAINERS

const getGymTrainers = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    throw new Error("User not found");
  }

  res.status(200).json(user.gym.trainers);
});

const addGymTrainers = asyncHandler(async (req, res) => {
  const newTrainerId = new ObjectId();
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const {
    firstname,
    middlename,
    lastname,
    email,
    contact,
    address,
    dateOfBirth,
    gender,
    certifications,
    specialties,
    yearsOfExperience,
    biography,
    password,
  } = req.body;

  const trimmedFirstname = validator.trim(firstname);
  const trimmedMiddlename = validator.trim(middlename);
  const trimmedLastname = validator.trim(lastname);
  const trimmedAddress = validator.trim(address);
  const trimmedContact = validator.trim(contact);
  const trimmedExperience = validator.trim(yearsOfExperience);
  const trimmedBiography = validator.trim(biography);
  const trimmedPassword = validator.trim(password);

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const userEmailExists = await Trainer.findOne({ email: email.toLowerCase() });

  if (userEmailExists) {
    res.status(400);
    throw new Error("Email already exists.");
  }

  if (!validator.isLength(trimmedFirstname, { min: 1 })) {
    return res.status(400).json({ error: "First name is required." });
  }

  if (!validator.isLength(trimmedMiddlename, { min: 1 })) {
    return res.status(400).json({ error: "Middle name is required." });
  }

  if (!validator.isLength(trimmedLastname, { min: 1 })) {
    return res.status(400).json({ error: "Last name is required." });
  }

  if (!validator.isLength(trimmedAddress, { min: 1 })) {
    return res.status(400).json({ error: "Address is required." });
  }

  if (dateOfBirth === null) {
    return res.status(400).json({ error: "Date of birth is required." });
  }

  if (!validator.isLength(trimmedContact, { min: 1 })) {
    return res.status(400).json({ error: "Contact is required." });
  }

  if (!validator.isNumeric(trimmedExperience, { min: 1 })) {
    return res.status(400).json({ error: "Experience is required." });
  }

  if (!validator.isLength(trimmedBiography, { min: 1 })) {
    return res.status(400).json({ error: "Biography is required." });
  }

  if (!validator.isLength(trimmedPassword, { min: 8, max: 16 })) {
    return res
      .status(400)
      .json({ error: "Password must be between 8 and 16 characters" });
  }

  const newTrainer = {
    _id: newTrainerId,
    gymOwnerId: user._id,
    firstname: trimmedFirstname,
    middlename: trimmedMiddlename,
    lastname: trimmedLastname,
    email: email.toLowerCase(),
    contact: trimmedContact,
    address: trimmedAddress,
    dateOfBirth: dateOfBirth,
    gender: gender,
    certifications: certifications.map((item) => ({
      certificateName: item.certificateName,
    })),
    specialties: specialties.map((item) => ({
      specialtyName: item.specialtyName,
    })),
    yearsOfExperience: yearsOfExperience,
    biography: trimmedBiography,
    password: trimmedPassword,
  };

  const newUser = await Trainer.create(newTrainer);

  if (newUser) {
    user.gym.trainers.push(newUser);

    await user.save();

    return res.status(200).json({
      message: "Successfully added new trainer",
    });
  } else {
    res.status(400).json({ message: "Failed to add new trainer" });
    throw new Error("Failed to add new trainer");
  }
});

const deleteGymTrainer = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);
  const { id } = req.body;

  if (!user) {
    res.status(404).json({ error: "User not found." });
  }

  // const isTrainerAssigneds = await Class.find({
  //   instructorId: id,
  // });

  const trainerToRemove = user.gym.trainers.find(
    (trainer) => trainer._id.toString() === id
  );

  if (!trainerToRemove) {
    res.status(404).json({ error: "Trainer not found." });
  }

  const isTrainerAssigned = await Class.find({
    instructorId: id,
  });

  if (isTrainerAssigned.length > 0) {
    res.status(400).json({
      error: "Failed to delete trainer. Please remove assignment from a class.",
    });
    throw new Error(
      "Failed to delete trainer. Please remove assignment from a class."
    );
  }

  const deleteTrainer = await Trainer.findByIdAndDelete(id);

  const remainingTrainers = user.gym.trainers.filter(
    (item) => item._id.toString() !== id
  );

  user.gym.trainers = [...remainingTrainers];

  if (deleteTrainer) {
    await user.save();

    return res.status(200).json({ message: "Successfully deleted trainer" });
  } else {
    res.status(400).json({ error: "Failed to delete trainer" });
    throw new Error("Failed to delete trainer");
  }
});

// GYM ANNOUNCEMENTS

const getGymAnnouncement = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    throw new Error("User not found");
  }

  res.status(200).json(user.gym.announcements);
});

const addGymAnnouncement = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Extract the new equipment data from the request body
  const { announcement } = req.body;

  const trimmedAnnouncement = validator.trim(announcement);

  if (!validator.isLength(trimmedAnnouncement, { min: 1 })) {
    return res
      .status(400)
      .json({ error: "Announcement description is required." });
  }

  const newAnnoucement = {
    announcement: trimmedAnnouncement,
  };

  // Add the new service to the existing service list
  user.gym.announcements.push(newAnnoucement);

  // Save the updated user with the new service
  await user.save();

  // Respond with the updated user profile
  res.status(200).json({
    message: "Successfully added new announcement",
  });
});

const updateGymAnnouncement = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { id, announcement } = req.body;

  const trimmedAnnouncement = validator.trim(announcement);

  if (!validator.isLength(trimmedAnnouncement, { min: 1 })) {
    return res.status(400).json({ error: "Announcement is required." });
  }

  const index = user.gym.announcements.findIndex(
    (announcement) => announcement.id === id
  );

  if (index !== -1) {
    // Update the service at the found index
    user.gym.announcements[index] = {
      id: id,
      announcement: trimmedAnnouncement,
    };

    // Save the updated user
    // const updatedService = await user.save();
    await user.save();

    res.status(200).json({ message: "Successfully updated announcement!" });
  } else {
    res.status(404).json({ error: "Announcement not found" });
  }
});

const deleteGymAnnouncement = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);
  const { id } = req.body;

  if (!user) {
    res.status(404).json({ error: "User not found." });
  }

  const announcementToRemove = user.gym.announcements.find(
    (announcement) => announcement.id === id
  );

  if (!announcementToRemove) {
    res.status(404).json({ error: "Announcement not found." });
  }

  const remainingAnnouncements = user.gym.announcements.filter(
    (announcement) => announcement.id !== id
  );

  user.gym.announcements = [...remainingAnnouncements];

  await user.save();

  res.status(200).json({ message: "Successfully deleted announcement" });
});

// GYM CLASSES

const getGymClasses = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    throw new Error("User not found");
  }

  const myClasses = await Class.find({ gymOwnerId: req.user._id });

  res.status(200).json(myClasses);
});

const addGymClasses = asyncHandler(async (req, res) => {
  const newClassId = new ObjectId();
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Extract the new equipment data from the request body
  const {
    classname,
    instructor,
    instructorId,
    date,
    starttime,
    endtime,
    capacity,
    description,
    equipment,
  } = req.body;

  const trimmedClassName = validator.trim(classname);
  const trimmedDescription = validator.trim(description);
  const trimmedEquipment = validator.trim(equipment);
  const trimmedInstructorId = validator.trim(instructorId);

  if (!validator.isLength(trimmedDescription, { min: 1 })) {
    return res.status(400).json({ error: "Class description is required." });
  }

  if (!validator.isLength(trimmedInstructorId, { min: 1 })) {
    return res.status(400).json({ error: "Instructor is required." });
  }

  if (
    !validator.isNumeric(capacity) ||
    !validator.isInt(capacity, { min: 1 })
  ) {
    return res.status(400).json({ error: "Capacity is cannot be 0." });
  }

  const trainer = await Trainer.findById(trimmedInstructorId);

  const newClass = await Class.create({
    _id: newClassId,
    gymname: user.gym.gymname,
    gymOwnerId: user._id,
    classname: trimmedClassName,
    description: trimmedDescription,
    equipment: trimmedEquipment,
    instructorId: trimmedInstructorId,
    instructor: instructor,
    date: date,
    starttime: starttime,
    endtime: endtime,
    capacity: capacity,
  });

  if (newClass) {
    user.gym.classes.push(newClassId);
    trainer.classes.push(newClassId);

    await user.save();
    await trainer.save();

    res.status(200).json({
      message: "Successfully added new class",
    });
  } else {
    res.status(400).json({ error: "Failed to add class" });
  }
});

const updateGymClass = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Extract the new equipment data from the request body
  const {
    id,
    classname,
    instructor,
    instructorId,
    date,
    starttime,
    endtime,
    capacity,
    description,
    equipment,
  } = req.body;

  // return console.log(req.body) && console.log("Hello");

  const specificClass = await Class.findById(id);

  const trimmedClassName = validator.trim(classname);
  const trimmedDescription = validator.trim(description);
  const trimmedEquipment = validator.trim(equipment);

  if (!validator.isLength(date, { min: 1 })) {
    return res.status(400).json({ error: "Date is required." });
  }

  if (!validator.isLength(starttime, { min: 1 })) {
    return res.status(400).json({ error: "Start Time is required." });
  }

  if (!validator.isLength(endtime, { min: 1 })) {
    return res.status(400).json({ error: "End Time is required." });
  }

  if (!validator.isLength(trimmedDescription, { min: 1 })) {
    return res.status(400).json({ error: "Class description is required." });
  }

  if (
    !validator.isNumeric(capacity.toString()) ||
    !validator.isInt(capacity.toString(), { min: 1 })
  ) {
    return res.status(400).json({ error: "Capacity is cannot be 0." });
  }

  if (capacity < specificClass.joinedMember.length) {
    return res
      .status(400)
      .json({ error: "Capacity cannot be less than joined members" });
  }

  specificClass.classname = trimmedClassName;
  specificClass.instructor = instructor;
  specificClass.instructorId = instructorId;
  specificClass.date = date;
  specificClass.starttime = starttime;
  specificClass.endtime = endtime;
  specificClass.capacity = capacity;
  specificClass.description = trimmedDescription;
  specificClass.equipment = trimmedEquipment;

  try {
    await specificClass.save();

    res.status(200).json({
      message: "Successfully edited class",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const deleteGymClass = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);
  const { classId, instructorId } = req.body;

  if (!user) {
    res.status(404).json({ error: "User not found." });
  }

  const deletedClass = await Class.deleteOne({ _id: classId });

  const removeClassOnTrainer = await Trainer.updateOne(
    { _id: new ObjectId(instructorId) },
    {
      $pull: {
        classes: new ObjectId(classId),
      },
    }
  );

  if (deletedClass && removeClassOnTrainer) {
    try {
      const remainingClasses = user.gym.classes.filter(
        (item) => item.toString() !== classId
      );

      user.gym.classes = [...remainingClasses];

      await user.save();

      res.status(200).json({ message: "Successfully deleted class" });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete class" });
      throw new Error("Failed to delete class");
    }
  }
});

// GYM Members

const getGymMembers = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    throw new Error("User not found");
  }

  res.status(200).json(user.gym.members);
});

const addNewMember = asyncHandler(async (req, res) => {
  const newUserId = new ObjectId();

  const verifiedGymOwner = await GymOwner.findById(req.user._id);

  const {
    firstname,
    middlename,
    lastname,
    email,
    contact,
    address,
    dateOfBirth,
    plan,
    gender,
    password,
  } = req.body;

  if (!verifiedGymOwner) {
    res.status(404);
    throw new Error("User not found");
  }

  if (verifiedGymOwner?.gym.isApproved !== "approved") {
    res.status(404).json({ error: "Gym is not approved by Admin" });
    throw new Error("Gym is not approved by Admin");
  }

  const isPlanIdValid = verifiedGymOwner?.gym.plans.some(
    (gymPlan) => gymPlan._id.toString() === plan._id
  );

  if (!isPlanIdValid) {
    res.status(400);
    throw new Error("Gym plan doesn't exists to your chosen gym");
  }

  const userEmailExists = await User.findOne({ email: email.toLowerCase() });

  if (userEmailExists) {
    res.status(400).json({ error: "Email already exists." });
    throw new Error("Email already exists.");
  }

  const trimmedFirstname = firstname.trim();
  const trimmedMiddlename = middlename.trim();
  const trimmedLastname = lastname.trim();
  const trimmedAddress = address.trim();
  const trimmedContact = contact.trim();

  function isValidDate(dateString) {
    return validator.isDate(dateString);
  }

  function isValidGender(gender) {
    const validGenders = ["Male", "Female"];
    return validGenders.includes(gender);
  }

  if (!validator.isLength(trimmedFirstname, { min: 1 })) {
    return res.status(400).json({ error: "First name is required." });
  }

  if (!validator.isLength(trimmedMiddlename, { min: 1 })) {
    return res.status(400).json({ error: "Middle name is required." });
  }

  if (!validator.isLength(trimmedLastname, { min: 1 })) {
    return res.status(400).json({ error: "Last name is required." });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  if (!validator.isLength(trimmedContact, { min: 1 })) {
    return res.status(400).json({ error: "Contact is required." });
  }

  if (!validator.isLength(trimmedAddress, { min: 1 })) {
    return res.status(400).json({ error: "Address is required." });
  }

  if (!isValidDate(dateOfBirth)) {
    return res.status(400).json({ error: "Invalid date of birth." });
  }

  if (!isValidGender(gender)) {
    return res
      .status(400)
      .json({ error: "Invalid gender. Valid values are 'Male' or 'Female'." });
  }

  if (!validator.isLength(password, { min: 8, max: 16 })) {
    return res
      .status(400)
      .json({ error: "Password must be between 8 and 16 characters" });
  }

  const membershipPlan = [
    {
      gym: {
        gymname: verifiedGymOwner.gym.gymname,
        ownerId: verifiedGymOwner._id,
      },
      myPlan: {
        planName: plan.planName,
        amount: plan.amount,
        duration: plan.duration,
        startTime: Date.now(),
        endTime: calculateEndTime(plan.duration),
        planStatus: "active",
        paymentStatus: "paid",
        // proofOfPayment: "",
      },
    },
  ];

  const user = await User.create({
    _id: newUserId,
    firstname: trimmedFirstname,
    middlename: trimmedMiddlename,
    lastname: trimmedLastname,
    email: email.toLowerCase(),
    contact: trimmedContact,
    address: trimmedAddress,
    dateOfBirth: dateOfBirth,
    memberships: membershipPlan,
    gender: gender,
    password: password,
    reviews: [...reviews.map((review) => ({ ...review, isJoined: true }))],
  });

  if (user) {
    const serializedUser =
      // JSON.parse(
      //   stringifySafe({
      {
        _id: user._id,
        firstname: user.firstname,
        middlename: user.middlename,
        lastname: user.lastname,
        address: user.address,
        email: user.email,
        contact: user.contact,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
      };
    //   })
    // );

    await verifiedGymOwner.gym.members.push({
      user: serializedUser,
      plan: {
        planName: plan.planName,
        amount: plan.amount,
        duration: plan.duration,
        startTime: Date.now(),
        endTime: calculateEndTime(plan.duration),
        planStatus: "active",
        paymentStatus: "paid",
        // proofOfPayment: "",
      },
    });
    await verifiedGymOwner.save();

    res.status(201).json({
      message: "Account Created",
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data.");
  }
});

// GYM Complete Info

const getMyGym = asyncHandler(async (req, res) => {
  const user = await GymOwner.findById(req.user._id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

const updatePendingMemberStatus = asyncHandler(async (req, res) => {
  const owner = await GymOwner.findById(req.user._id);

  if (!owner) {
    res.status(404).json({ error: "Gym not found" });
    throw new Error("Gym not found");
  }

  const { userId, action } = req.body;

  const member = await User.findById(userId);

  if (!member) {
    res.status(404).json({ error: "User not found" });
    throw new Error("User not found");
  }

  const memberIndex = member.memberships.findIndex(
    (member) => member.gym.ownerId.toString() === owner._id.toString()
  );

  const ownerIndex = owner.gym.members.findIndex(
    (owner) => owner.user._id.toString() === member._id.toString()
  );

  // console.log("memberIndex", memberIndex);
  // console.log("ownerIndex", ownerIndex);

  try {
    if (action === "reject") {
      member.memberships[memberIndex].myPlan.planStatus = "rejected";
      member.memberships[memberIndex].myPlan.paymentStatus = "rejected";

      owner.gym.members[ownerIndex].plan.planStatus = "rejected";
      owner.gym.members[ownerIndex].plan.paymentStatus = "rejected";

      await member.save();
      await owner.save();

      return res
        .status(200)
        .json({ message: "Successfully updated member status" });
    } else if (action === "approve") {
      member.memberships[memberIndex].myPlan.planStatus = "active";
      member.memberships[memberIndex].myPlan.paymentStatus = "paid";
      member.memberships[memberIndex].myPlan.startTime = new Date();
      member.memberships[memberIndex].myPlan.endTime = calculateEndTime(
        member.memberships[memberIndex].myPlan.duration
      );

      // Find the review index that matches the gymname
      const reviewIndex = member.reviews.findIndex(
        (review) => review._id.toString() === owner._id.toString()
      );

      if (reviewIndex === -1) {
        member.reviews.push({
          gymname: owner.gym.gymname,
          _id: owner._id,
          rating: 0,
          status: false,
          isJoined: true,
        });
      }

      // Set isJoined to true if the review is found
      if (reviewIndex !== -1 && !member.reviews[reviewIndex].isJoined) {
        member.reviews[reviewIndex].isJoined = true;
      }

      owner.gym.members[ownerIndex].plan.planStatus = "active";
      owner.gym.members[ownerIndex].plan.paymentStatus = "paid";
      owner.gym.members[ownerIndex].plan.startTime = new Date();
      owner.gym.members[ownerIndex].plan.endTime = calculateEndTime(
        owner.gym.members[ownerIndex].plan.duration
      );

      await member.save();
      await owner.save();

      return res
        .status(200)
        .json({ message: "Successfully updated member status" });
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to update member status." });
    throw new Error(error);
  }
});

// Payment Stripe

const getStripePrices = asyncHandler(async (req, res) => {
  const prices = await stripe.prices.list({
    apiKey: process.env.STRIPE_SECRET_KEY,
  });

  res.status(200).json(prices);
});

// Other Public Route (Get Gym)

// const getGyms = asyncHandler(async (req, res) => {
//   const user = await GymOwner.findById(req.user._id);

//   if (!user) {
//     res.status(404).json({ error: "User not found" });
//     throw new Error("User not found");
//   }

//   res.status(200).json(user.gym.classes);
// });

export {
  // upload,
  authOwner,
  registerOwner,
  logoutOwner,
  getOwnerDashboard,
  getOwnerProfile,
  updateOwnerProfile,
  getGymDetails,
  updateGymDetails,
  getGymServices,
  addGymServices,
  updateGymServices,
  deleteGymServices,
  getGymAmenities,
  addGymAmenities,
  updateGymAmenities,
  deleteGymAmenities,
  getGymEquipments,
  addGymEquipments,
  updateGymEquipments,
  deleteGymEquipment,
  getGymPlans,
  addGymPlans,
  updateGymPlans,
  deleteGymPlan,
  getGymTrainers,
  addGymTrainers,
  deleteGymTrainer,
  getStripePrices,
  getGymAnnouncement,
  addGymAnnouncement,
  updateGymAnnouncement,
  deleteGymAnnouncement,
  getGymClasses,
  addGymClasses,
  getGymMembers,
  updateGymClass,
  deleteGymClass,
  getMyGym,
  addNewMember,
  updatePendingMemberStatus,
};
