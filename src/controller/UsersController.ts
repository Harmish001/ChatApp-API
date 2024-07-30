import { Request, Response } from "express";
import { AuthModel } from "../models/AuthModel";
import { UserInfoModel } from "../models/UserModel";
import { handleErrors } from "./AuthController";
import { ChatModel, ChatRoomModel } from "../models/ChatModel";
import fs from "fs";
import { Compute, GoogleAuth, auth } from "google-auth-library";
import { google } from "googleapis";
import { Readable } from "stream";

export const empty_profile_image =
  "https://www.shutterstock.com/shutterstock/photos/1153673752/display_1500/stock-vector-profile-placeholder-image-gray-silhouette-no-photo-1153673752.jpg";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const users = await AuthModel.find({
      _id: {
        $ne: [id],
      },
    });
    res.send({
      success: true,
      users: users,
    });
  } catch (error) {
    return res.status(404).send(handleErrors(error));
  }
};

export const adduserInfo = async (req: Request, res: Response) => {
  try {
    const { username, display_name, contact, email, profile_picture } =
      req.body;
    const auth = await AuthModel.findOne({ username });
    if (!auth) {
      return res.status(404).json({ error: "User not found" });
    }
    const userInfo = new UserInfoModel({
      user_id: auth._id,
      display_name,
      contact,
      email,
      profile_picture: profile_picture ? profile_picture : empty_profile_image,
    });
    userInfo.save();
    await AuthModel.findByIdAndUpdate(
      { _id: auth._id },
      {
        $set: { userInfo: userInfo._id },
      }
    );
    res.status(201).send({
      success: true,
      message: "user info save succesfully",
      user_info: userInfo,
    });
  } catch (error) {
    return res.status(404).send(handleErrors(error));
  }
};

export const updateuserInfo = async (req: Request, res: Response) => {
  try {
    const { username, display_name, contact, email, profile_picture } =
      req.body;
    const auth = await AuthModel.findOne({ username });
    if (!auth) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = await UserInfoModel.findOne({ user_id: auth._id });
    if (!user) {
      return res.status(404).json({ error: "User Information not found" });
    }
    user.display_name = display_name || "";
    user.contact = contact || "";
    user.email = email || "";
    user.profile_picture = profile_picture || empty_profile_image;
    user.save();
    await AuthModel.findByIdAndUpdate(
      { _id: auth._id },
      {
        $set: { userInfo: user._id },
      }
    );
    res
      .status(201)
      .send({ success: true, message: "user info save succesfully" });
  } catch (error) {
    return res.status(404).send(handleErrors(error));
  }
};

export const getuserInfo = async (req: Request, res: Response) => {
  try {
    const auth = await AuthModel.findOne({ username: req.params.username });
    // const user = await UserInfoModel.findOne({ user_id: auth?._id });
    // if (user) {
    //   res.status(201).send({ success: true, user: user });
    // } else {
      //   res.status(201).send({ success: true, user: {} });
      // }
        res.status(201).send({ success: true, user: auth });
    } catch (error) {
    return res.status(404).send(handleErrors(error));
  }
};

export const uploadProfilePic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(req.params);
    const scopes = "https://www.googleapis.com/auth/drive";
    const auth = new google.auth.JWT(
      process.env.CLIENT_EMAIL_ID,
      "null",
      process.env.PRIVATE_KEY,
      scopes
    );
    await auth.authorize();
    const service = google.drive({ version: "v3", auth });
    const requestBody: any = {
      name: "photo.jpg",
      parents: [process.env.IMAGE_FOLDER_ID],
      fields: "id",
    };
    const readableStream = Readable.from(req.body);
    const media = {
      mimeType: "image/jpg",
      body: readableStream,
    };
    try {
      const file: any = await service.files.create({
        requestBody,
        media: media,
      });
      console.log(file.data.id);
      const user: any = await AuthModel.findOne({ _id: id });
      const authModel = await UserInfoModel.findByIdAndUpdate(
        { _id: user.userInfo },
        {
          $set: {
            profile_picture: `https://drive.google.com/thumbnail?id=${file.data.id}&sz=w1000`,
          },
        }
      );
      console.log("usre", authModel);
      res.send({
        image: `https://drive.google.com/thumbnail?id=${file.data.id}&sz=w1000`,
        image_id: file.data.id,
      });
    } catch (err) {
      return res.status(404).send(handleErrors(err));
    }
  } catch (error) {
    return res.status(404).send(handleErrors(error));
  }
};

export const getChatRoomId = async (req: Request, res: Response) => {
  try {
    const { sender, receiver } = req.body;
    const chatRoom = await ChatRoomModel.findOne(
      {
        participants: { $all: [sender, receiver] },
      },
      { _id: 1 }
    );
    if (chatRoom) {
      res.send({ chatRoom });
    } else {
      res.send({ chatRoom: { _id: null } });
    }
  } catch (error) {
    return res.status(404).send(handleErrors(error));
  }
};
