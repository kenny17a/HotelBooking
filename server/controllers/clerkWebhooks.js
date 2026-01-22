// controllers/clerkWebhooks.js
import User from "../models/user.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
	try {
		const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

		if (!WEBHOOK_SECRET) {
			return res.status(500).json({ message: "Webhook secret missing" });
		}

		const whook = new Webhook(WEBHOOK_SECRET);

		const headers = {
			"svix-id": req.headers["svix-id"],
			"svix-timestamp": req.headers["svix-timestamp"],
			"svix-signature": req.headers["svix-signature"],
		};

		// ✅ RAW body (required)
		const payload = req.body.toString("utf8");

		// ✅ Verify webhook
		const event = whook.verify(payload, headers);

		const { data, type } = event;

		const userData = {
			_id: data.id,
			email: data.email_addresses?.[0]?.email_address || "",
			username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
			image: data.image_url,
		};

		switch (type) {
			case "user.created":
				await User.create(userData);
				break;

			case "user.updated":
				await User.findByIdAndUpdate(data.id, userData, {
					new: true,
					upsert: true,
				});
				break;

			case "user.deleted":
				await User.findByIdAndDelete(data.id);
				break;

			default:
				console.log("Unhandled Clerk event:", type);
		}

		res.status(200).json({ success: true });
	} catch (error) {
		console.error("Clerk webhook error:", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export default clerkWebhooks;
