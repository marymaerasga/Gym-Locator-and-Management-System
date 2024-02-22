import asyncHandler from "express-async-handler";
import validator from "validator";
import User from "../models/userModel.js";
import GymOwner from "../models/gymOwnerModel.js";
import Class from "../models/classModel.js";
import { ObjectId } from "mongodb";
import createToken from "../utils/createToken.js";
import cloudinary from "../utils/cloudinary.js";

// desc     Auth user/set token
// route    POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ error: "Email is not yet registered." });
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

// desc     Register a new user
// route    POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const newUserId = new ObjectId();

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
    gymId,
    paymentImage,
  } = req.body;

  const verifiedGymOwner = await GymOwner.findById(gymId);

  if (!verifiedGymOwner) {
    res.status(404);
    throw new Error("Gym not found");
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
    res.status(400);
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

  if (!validator.isLength(paymentImage, { min: 1 })) {
    return res.status(400).json({ error: "Proof of payment is required." });
  }

  const uploadPayment = await cloudinary.uploader.upload(paymentImage, {
    upload_preset: "payment-image",
  });

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
        // startTime: Date.now(),
        // endTime: calculateEndTime(plan.duration),
        // startTime: "",
        // endTime: "",
        // planStatus: "pending",
        // paymentStatus: "pending",
        proofOfPayment: uploadPayment,
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
    reviews: [
      {
        gymname: verifiedGymOwner.gym.gymname,
        _id: verifiedGymOwner._id,
      },
    ],
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
        // startTime: Date.now(),
        // endTime: calculateEndTime(plan.duration),
        // startTime: "",
        // endTime: "",
        // planStatus: "pending",
        // paymentStatus: "pending",
        proofOfPayment: uploadPayment,
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

const userJoinGym = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { plan, gymId, paymentImage } = req.body;

  const verifiedGymOwner = await GymOwner.findById(gymId);

  if (!verifiedGymOwner) {
    res.status(404);
    throw new Error("Gym not found");
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

  if (!validator.isLength(paymentImage, { min: 1 })) {
    return res.status(400).json({ error: "Proof of payment is required." });
  }

  const uploadPayment = await cloudinary.uploader.upload(paymentImage, {
    upload_preset: "payment-image",
  });

  const membershipPlan = {
    gym: {
      gymname: verifiedGymOwner.gym.gymname,
      ownerId: verifiedGymOwner._id,
    },
    myPlan: {
      planName: plan.planName,
      amount: plan.amount,
      duration: plan.duration,
      // startTime: Date.now(),
      // endTime: calculateEndTime(plan.duration),
      // planStatus: "active",
      // paymentStatus: "paid",
      proofOfPayment: uploadPayment,
    },
  };

  user.memberships.push(membershipPlan);

  await user.save();

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
        // startTime: Date.now(),
        // endTime: calculateEndTime(plan.duration),
        // planStatus: "active",
        // paymentStatus: "paid",
        proofOfPayment: uploadPayment,
      },
    });
    await verifiedGymOwner.save();

    res.status(201).json({
      message: `Successfully sent a request for subscription at ${verifiedGymOwner.gym.gymname}`,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data.");
  }
});

// ---------------------------------------------------------

// desc     Logout user
// route    POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User logged out" });
});

// desc     Get user profile
// route    GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    firstname: user.firstname,
    lastname: user.lastname,
    middlename: user.middlename,
    email: user.email,
    address: user.address,
    contact: user.contact,
    dateOfBirth: user.dateOfBirth,
  });
});

// desc     Update user profile
// route    PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { firstname, middlename, lastname, dateOfBirth, contact, address } =
    req.body;

  const trimmedFirstName = validator.trim(firstname);
  const trimmedMiddleName = validator.trim(middlename);
  const trimmedLastName = validator.trim(lastname);

  if (!trimmedFirstName || !trimmedLastName || !trimmedMiddleName) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  if (!validator.isISO8601(dateOfBirth, { strict: true })) {
    return res.status(400).json({ error: "Invalid date" });
  }

  if (!validator.isLength(contact, { min: 1 })) {
    return res.status(400).json({ error: "Contact is required." });
  }

  if (!validator.isLength(address, { min: 1 })) {
    return res.status(400).json({ error: "Address is required." });
  }

  if (user) {
    user.firstname = trimmedFirstName || user.firstname;
    user.middlename = trimmedMiddleName || user.middlename;
    user.lastname = trimmedLastName || user.lastname;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.contact = contact || user.contact;
    user.address = address || user.address;

    await user.save();

    res.status(200).json({
      message: "Successfuly updated profile!",
    });
  } else {
    res.status(404).json({ error: "Failed to update profile." });

    throw new Error("User not found");
  }
});

const getUserSubscriptions = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user.memberships);
});

// const cancelSubscription = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);
//   const { userId, gymId } = req.body;

//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }

//   const userClient = await User.findById(userId);
//   const gymClient = await GymOwner.findById(gymId);

//   if (!userClient) {
//     res.status(404).json({ error: "User id is invalid" });
//     throw new Error("User not found");
//   }

//   if (!gymClient) {
//     res.status(404).json({ error: "Gym id is invalid" });
//     throw new Error("Gym not found");
//   }

//   // const userSub = userClient?.filter((item) => {
//   //   return item.gym._id === userId;
//   // });

//   // const userPlan = gymClient?.filter((item) => {
//   //   return item.gym._id === gymId;
//   // });

//   res.status(200).json(userClient.memberships);
// });

const getUserClasses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const activeMembers = user.memberships.filter((item) => {
    return item.myPlan.planStatus === "active";
  });

  const ownerIdList = activeMembers.map((membership) => membership.gym.ownerId);

  const availableClasses = await Class.find({
    gymOwnerId: { $in: ownerIdList },
  }).exec();

  res.status(200).json(availableClasses);
});

const getGyms = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const ownerIdList = user.memberships.map(
    (membership) => membership.gym.ownerId
  );

  // const gymOwners = await GymOwner.find({ _id: { $in: ownerIdList } }).exec();

  const gymOwners = await GymOwner.find({ _id: { $nin: ownerIdList } })
    // .select(
    //   "_id gym.gymname gym.contact gym.description gym.address gym.gymLocation schedule permitBase64 isApproved reviews equipments plans"
    // )
    .exec();

  res.status(200).json(gymOwners);
});

const userJoinClass = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    throw new Error("User not found");
  }

  const { classId } = req.body;

  if (!validator.isLength(classId, { min: 1 })) {
    return res.status(400).json({ error: "Class selection is required." });
  }

  const specificClass = await Class.findById(classId);

  if (specificClass.joinedMember.length === specificClass.capacity) {
    return res.status(400).json({ error: "Class has no available slot" });
  }

  user.classes.push(specificClass._id);
  specificClass.joinedMember.push(user._id);

  const saveUser = await user.save();
  const saveClass = await specificClass.save();

  if (saveUser && saveClass) {
    return res.status(200).json({ message: "Successfully joined the class" });
  } else {
    res.status(400).json({ message: "Failed to join class" });
    throw new Error("Failed to join class");
  }
});

const userWithdrawClass = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    throw new Error("User not found");
  }

  const { classId } = req.body;

  if (!validator.isLength(classId, { min: 1 })) {
    return res.status(400).json({ error: "Class selection is required." });
  }

  const specificClass = await Class.findById(classId);

  const updateUserQuery = {
    $pull: { classes: new ObjectId(classId) },
  };

  const userResult = await User.updateOne(
    { _id: new ObjectId(user._id) },
    updateUserQuery
  );

  const updateClassQuery = {
    $pull: { joinedMember: new ObjectId(user._id) },
  };

  const classResult = await Class.updateOne(
    { _id: new ObjectId(classId) },
    updateClassQuery
  );

  if (userResult && classResult) {
    return res
      .status(200)
      .json({ message: "Successfully withdrawn from the class" });
  } else {
    res.status(400).json({ message: "Failed to join class" });
    throw new Error("Failed to join class");
  }
});

const getUserAnnouncements = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const aggregationPipeline = [
    {
      $match: {
        _id: user._id,
      },
    },
    {
      $unwind: "$memberships",
    },
    {
      $match: {
        "memberships.myPlan.planStatus": "active",
      },
    },
    {
      $lookup: {
        from: "gymowners",
        localField: "memberships.gym.ownerId",
        foreignField: "_id",
        as: "gymInfo",
      },
    },
    {
      $unwind: "$gymInfo",
    },
    {
      $unwind: "$gymInfo.gym.announcements",
    },
    {
      $project: {
        _id: "$gymInfo.gym.announcements._id",
        announcement: "$gymInfo.gym.announcements.announcement",
        createdAt: "$gymInfo.gym.announcements.createdAt",
        gymname: "$gymInfo.gym.gymname",
      },
    },
    {
      $sort: {
        createdAt: 1,
      },
    },
  ];

  const result = await User.aggregate(aggregationPipeline);

  if (result) {
    return res.status(200).json(result);
  } else {
    res.status(400).json({ error: "Failed to get announcements" });
    throw new Error("Failed to get announcements");
  }
});

const getUserReviews = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const activeMembers = user.reviews.filter((item) => {
    return item.isJoined === true;
  });

  res.status(200).json(activeMembers);
});

const submitUserReview = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { gymId, rating } = req.body;
  const specificGym = await GymOwner.findById(new ObjectId(gymId));

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!specificGym) {
    res.status(404);
    throw new Error("Gym not found");
  }

  const existingUserRatingIndex = user.reviews.findIndex(
    (item) => item._id.toString() === gymId
  );

  if (existingUserRatingIndex !== -1) {
    // Update existing rating
    user.reviews[existingUserRatingIndex].rating = rating;
    user.reviews[existingUserRatingIndex].status = true;

    specificGym.gym.reviews.push(rating);

    const gymRating =
      specificGym.gym.reviews.reduce((acc, num) => acc + num, 0) /
      specificGym.gym.reviews.length;

    const roundedRating = Math.round(gymRating * 10) / 10;

    specificGym.gym.rating = roundedRating;

    // Save both user and specificGym
    const saveUser = await user.save();
    const saveGym = await specificGym.save();

    if (saveUser && saveGym) {
      return res.status(200).json({ message: "Successfully submitted review" });
    } else {
      res.status(400).json({ message: "Failed to submit review" });
      throw new Error("Failed to submit review");
    }
  } else {
    res.status(400).json({ message: "Review does not exist" });
    throw new Error("Review does not exist");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUserSubscriptions,
  getUserClasses,
  // cancelSubscription,
  getGyms,
  userJoinGym,
  userJoinClass,
  userWithdrawClass,
  getUserAnnouncements,
  getUserReviews,
  submitUserReview,
};
