import { Request, Response } from "express";
import { handleErrors } from "./AuthController";
import { ChannelMessageModel } from "../models/ChannelModel";
import { UserInfoModel } from "../models/UserModel";
import { io } from "../index";
import { AuthModel } from "../models/AuthModel";

export const postChannelMessage = async (body: any) => {
  try {
    const { message, sender, channel_id } = body;
    const newMessage = new ChannelMessageModel({
      message,
      sender,
      channel_id,
    });
    newMessage.save();
    const senderDetails = await AuthModel.findOne(
      {
        _id: sender,
      },
      { userInfo: 1, _id: 0 }
    );
    const finalData = {
      ...body,
      sender: senderDetails,
      createdAt: newMessage.createdAt,
    };
    io.to(channel_id).emit("channelMessage", finalData);
  } catch (error) {
    return console.log("error", error);
  }
};

export const getChannelMessage = async (req: Request, res: Response) => {
  try {
    const { channel_id } = req.params;
    const messages = await ChannelMessageModel.find({ channel_id }).populate({
      path: "sender",
      select: { userInfo: 1 },
      populate: {
        path: "userInfo",
        model: UserInfoModel,
        select: "display_name profile_picture",
      },
    });
    res.send({ messages });
  } catch (error) {
    return res.status(404).send(handleErrors(error));
  }
};

export const filterChannelMessasges = async (body: any) => {
  try {
    const { message, channel_id } = body;
    const Channel = await ChannelMessageModel.find(
      {
        channel_id: channel_id,
        $text: { $search: message },
      },
      { message: 1 }
    );
    const messages =
      Channel.length > 0 ? Channel.map((item) => item.message) : [];
    return messages;
  } catch (err) {
    console.log(err);
  }
};
