import express from "express";
import path from "path";
const router = express.Router();
import {
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
  // getStripePrices,
  addGymAnnouncement,
  getGymAnnouncement,
  updateGymAnnouncement,
  deleteGymAnnouncement,
  getGymClasses,
  addGymClasses,
  updateGymClass,
  getGymMembers,
  deleteGymClass,
  getMyGym,
  addNewMember,
  updatePendingMemberStatus,
} from "../controllers/gymOwnerController.js";
import { protectOwner } from "../middleware/gymOwnerAuthMiddleware.js";

router.post("/register", registerOwner);
router.post("/auth", authOwner);
// router.post("/logout", logoutOwner);
router.route("/dashboard").get(protectOwner, getOwnerDashboard);
router
  .route("/profile")
  .get(protectOwner, getOwnerProfile)
  .put(protectOwner, updateOwnerProfile);
router
  .route("/gymdetails")
  .get(protectOwner, getGymDetails)
  .put(protectOwner, updateGymDetails);
router
  .route("/services")
  .get(protectOwner, getGymServices)
  .post(protectOwner, addGymServices)
  .patch(protectOwner, updateGymServices)
  .delete(protectOwner, deleteGymServices);
router
  .route("/amenity")
  .get(protectOwner, getGymAmenities)
  .post(protectOwner, addGymAmenities)
  .patch(protectOwner, updateGymAmenities)
  .delete(protectOwner, deleteGymAmenities);
router
  .route("/equipments")
  .get(protectOwner, getGymEquipments)
  .post(protectOwner, addGymEquipments)
  .patch(protectOwner, updateGymEquipments)
  .delete(protectOwner, deleteGymEquipment);

router
  .route("/trainers")
  .get(protectOwner, getGymTrainers)
  .post(protectOwner, addGymTrainers)
  .delete(protectOwner, deleteGymTrainer);

router
  .route("/classes")
  .get(protectOwner, getGymClasses)
  .post(protectOwner, addGymClasses)
  .patch(protectOwner, updateGymClass)
  .delete(protectOwner, deleteGymClass);
router
  .route("/announcements")
  .get(protectOwner, getGymAnnouncement)
  .post(protectOwner, addGymAnnouncement)
  .put(protectOwner, updateGymAnnouncement)
  .delete(protectOwner, deleteGymAnnouncement);

// router.route("/prices").get(protectOwner, getStripePrices);
router
  .route("/plans")
  .get(protectOwner, getGymPlans)
  .post(protectOwner, addGymPlans)
  .put(protectOwner, updateGymPlans)
  .delete(protectOwner, deleteGymPlan);
router
  .route("/members")
  .get(protectOwner, getGymMembers)
  .post(protectOwner, addNewMember);
router.route("/ownergym").get(protectOwner, getMyGym);
router.route("/memberstatus").patch(protectOwner, updatePendingMemberStatus);

export default router;
