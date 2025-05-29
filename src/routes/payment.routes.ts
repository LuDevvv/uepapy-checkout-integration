import { Router } from "express";
import {
  generateUepaPayUrl,
  validateUepaPayOrder,
} from "../controllers/payment.controller";

const router = Router();

router.post("/create", generateUepaPayUrl);
router.post("/verify", validateUepaPayOrder);

export default router;
