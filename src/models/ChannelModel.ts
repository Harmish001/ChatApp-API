import mongoose, { Schema } from "mongoose";

const ChannelSchema = new mongoose.Schema(
  {
    channel_name: {
      type: String,
    },
    participants: {
      type: [Schema.Types.ObjectId],
      ref: "auth",
    },
    channel_theme: {
      type: String,
    },
    is_private: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const channelMessagesSchema = new mongoose.Schema(
  {
    channel_id: {
      type: Schema.Types.ObjectId,
      ref: "channel",
    },
    message: String,
    sender: { type: Schema.Types.ObjectId, ref: "auth" },
  },
  { timestamps: true }
);

export const ChannelModel = mongoose.model("channel", ChannelSchema);
export const ChannelMessageModel = mongoose.model(
  "channelMessage",
  channelMessagesSchema
);
