import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import webhookRoute from "./routes/webhookRoute.js";

connectDB();
const app = express();

app.use(cors());

// 🚨 CLERK WEBHOOK MUST BE FIRST
app.use("/api/webhooks", webhookRoute);

// Clerk auth middleware AFTER webhook
app.use(clerkMiddleware());

// Normal JSON parsing AFTER webhook
app.use(express.json());

app.get("/", (req, res) => {
	res.send("API is working");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
