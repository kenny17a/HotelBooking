import express from "express";
import clerkWebhooks from "../controllers/clerkWebhooks.js";

const router = express.Router();

router.post(
	"/clerk",
	express.raw({ type: "application/json" }), // use this instead
	clerkWebhooks,
);

export default router;
