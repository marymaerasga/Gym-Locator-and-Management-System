import express from "express";
const router = express.Router();
import { getOwners } from "../controllers/adminController.js";

router.route("/explore").get(getOwners);

export default router;
