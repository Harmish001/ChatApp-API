import mongoose, { Schema, SchemaType } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Please Enter Message"],
    },
    sender: {
      type: Schema.Types.ObjectId,
      required: [true, "Sender not found"],
      ref: "authentication",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: [true, "Receiver not found"],
      ref: "authentication",
    },
  },
  { timestamps: true }
);

const ChatSchema = new mongoose.Schema(
  {
    messages: {
      type: [messageSchema],
    },
    participants: [{ type: Schema.Types.ObjectId, ref: "authentication" }],
    bg_image: {
      type: String,
    },
  },
  { timestamps: true }
);

export const ChatModel = mongoose.model("chat", ChatSchema);
