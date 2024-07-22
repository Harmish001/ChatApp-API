import mongoose, { Schema } from "mongoose";
import { userInfoSchema } from "./UserModel";
import { scheduler } from "timers/promises";

const authSchema = new mongoose.Schema({
  username: {
    required: [true, "Please Enter username"],
    type: String,
    unique: true,
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
  userInfo: { type: Schema.Types.ObjectId, ref: "userInfo" },
  theme_color: String,
});

authSchema.pre("save", function (next) {
  this.updatedAt = new Date(Date.now());
  next();
});

const AuthModel = mongoose.model("authentication", authSchema);

export { AuthModel };
