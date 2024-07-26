import { Schema, default as mongoose } from "mongoose";

export const userInfoSchema = new mongoose.Schema(
	{
		display_name: {
			required: [false, "Please try different username"],
			type: String,
		},
		profile_picture: {
			type: String,
      default: "https://media.istockphoto.com/id/1316420668/vector/user-icon-human-person-symbol-social-profile-icon-avatar-login-sign-web-user-symbol.jpg?s=612x612&w=0&k=20&c=AhqW2ssX8EeI2IYFm6-ASQ7rfeBWfrFFV4E87SaFhJE="
		},
		email: {
			type: String,
			lowercase: true,
			default: "",
		},
		contact: {
			type: String,
			default: "",
		},
		gender: {
			type: String,
      default: "",
		},
	},
	{ timestamps: true }
);

const UserInfoModel = mongoose.model("userInfo", userInfoSchema);

export { UserInfoModel };
