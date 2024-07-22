import mongoose, { Schema } from "mongoose";

const ChannelSchema = new mongoose.Schema(
  {
    channel_name: {
      type: String,
    },
    participants: {
      type: [Schema.Types.ObjectId],
      ref: "authentication",
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

export const ChannelModel = mongoose.model("channel", ChannelSchema);
