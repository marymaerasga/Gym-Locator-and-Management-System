import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";

const protectAdmin = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401);
    throw new Error("Not authorized, No token");
  } else {
    try {
      const token = authorization.split(" ")[1];

      const { _id } = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await Admin.findById(_id).select("_id");

      // .select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  }
});

export { protectAdmin };
