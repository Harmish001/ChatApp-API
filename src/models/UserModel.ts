import { Schema, default as mongoose } from "mongoose";

export const userInfoSchema = new mongoose.Schema(
  {
    display_name: {
      required: [false, "Please try different username"],
      type: String,
    },
    profile_picture: {
      type: String,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "authentication",
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
  },
  { timestamps: true }
);

const UserInfoModel = mongoose.model("userInfo", userInfoSchema);

export { UserInfoModel };
