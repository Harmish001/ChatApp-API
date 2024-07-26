import mongoose, { Schema, SchemaType } from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Please Enter Message"],
    },
    sender: {
      type: Schema.Types.ObjectId,
      required: [true, "Sender not found"],
      ref: "auth",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: [true, "Receiver not found"],
      ref: "auth",
    },
    room_id: {
      type: Schema.Types.ObjectId,
      ref: "chatRoom",
    },
  },
  { timestamps: true }
);

const ChatRoomSchema = new mongoose.Schema(
  {
    preferences: {
      theme: {
        type: String,
        default: "none",
      },
      is_pinned: {
        type: Boolean,
        default: false,
      },
    },
    participants: [{ type: Schema.Types.ObjectId, ref: "auth" }],
  },
  { timestamps: true }
);

export const ChatModel = mongoose.model("chat", ChatSchema);
export const ChatRoomModel = mongoose.model("chatRoom", ChatRoomSchema);
