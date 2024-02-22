import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import GymOwner from "../models/gymOwnerModel.js";

const protectOwner = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401);
    throw new Error("Not authorized, No token");
  } else {
    try {
      const token = authorization.split(" ")[1];

      const { _id } = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await GymOwner.findById(_id).select("_id");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  }
});

export { protectOwner };
