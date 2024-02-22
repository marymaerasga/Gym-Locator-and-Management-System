import express from "express";
const router = express.Router();
import { authTrainer, getMyClasses } from "../controllers/trainerController.js";
import { protectTrainer } from "../middleware/authTrainerMiddleware.js";

router.post("/auth", authTrainer);
router.get("/classes", protectTrainer, getMyClasses);

export default router;
