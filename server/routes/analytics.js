import express from "express";
import { trackEvent, trackSession } from "../controllers/analyticsController.js";

const router = express.Router();

// Public tracking endpoints
router.post("/session", trackSession);
router.post("/event", trackEvent);

export default router;




