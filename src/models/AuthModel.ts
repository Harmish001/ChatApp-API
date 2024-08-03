import mongoose, { Schema } from "mongoose";
import { userInfoSchema } from "./UserModel";

const authSchema = new mongoose.Schema({
	username: {
		required: [true, "Please Enter username"],
		type: String,
	},
	password: {
		type: String,
		required: [true, "please Enter valid Password"],
		minLength: [6, "Minimum length is 6 characters"],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	userInfo: userInfoSchema,
	theme_color: {
		type: String,
		default: "rgb(189,16,224)",
	},
});

authSchema.pre("save", function (next) {
	this.updatedAt = new Date(Date.now());
	next();
});

const AuthModel = mongoose.model("auth", authSchema);

export { AuthModel };
