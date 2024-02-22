import express from "express";
const router = express.Router();
import {
  authAdmin,
  logoutAdmin,
  getOwners,
  approveGymStatus,
  rejectGymStatus,
} from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/authAdminMiddleware.js";

// router.post("/register", registerAdmin);
router.route("/owners").get(protectAdmin, getOwners);
router.patch("/owners/approve", protectAdmin, approveGymStatus);
router.patch("/owners/reject", protectAdmin, rejectGymStatus);
router.post("/auth", authAdmin);
router.post("/logout", logoutAdmin);
// router.route("/owners").get(protectAdmin, getOwnersProfile);
// .put(protect, protectAdmin);

export default router;
