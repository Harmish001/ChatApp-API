import { Request, Response } from "express";
import { handleErrors } from "./AuthController";
import { ChannelMessageModel } from "../models/ChannelModel";
import { UserInfoModel } from "../models/UserModel";

export const postChannelMessage = (req: Request, res: Response) => {
  try {
    const { message, sender, channel_id } = req.body;
    const newMessage = new ChannelMessageModel({
      message,
      sender,
      channel_id,
    });
    newMessage.save();
    res.send({ newMessage });
  } catch (error) {
    return res.status(404).send(handleErrors(error));
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
