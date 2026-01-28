import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		clerkId: { type: String, required: true, unique: true },
		username: { type: String },
		email: { type: String },
		image: { type: String },
		role: { type: String, enum: ["user", "hotelOwner"], default: "user" },
		recentSearchCities: { type: [String], default: [] }, // ✅ not required
	},
	{ timestamps: true },
);

export default mongoose.model("User", userSchema);
