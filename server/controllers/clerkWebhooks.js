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

		const payload = req.body; // raw buffer
		const event = whook.verify(payload, headers);

		const { data, type } = event;

		const userData = {
			clerkId: data.id,
			email: data.email_addresses?.[0]?.email_address || "",
			username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
			image: data.image_url,
		};

		if (type === "user.created" || type === "user.updated") {
			await User.findOneAndUpdate({ clerkId: data.id }, userData, {
				upsert: true,
				new: true,
			});
			console.log("✅ User saved/updated");
		}

		if (type === "user.deleted") {
			await User.findOneAndDelete({ clerkId: data.id });
			console.log("🗑 User deleted");
		}

		res.status(200).json({ success: true });
	} catch (error) {
		console.error("❌ Clerk webhook error:", error.message);
		res.status(400).json({ success: false });
	}
};

export default clerkWebhooks;
