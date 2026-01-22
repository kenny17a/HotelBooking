// routes/webhooks.js
import express from "express";
import bodyParser from "body-parser";
import clerkWebhooks from "../controllers/clerkWebhooks.js";

const router = express.Router();

// Clerk webhook MUST use raw body
router.post(
	"/clerk",
	bodyParser.raw({ type: "application/json" }),
	clerkWebhooks,
);

export default router;
