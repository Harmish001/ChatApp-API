import { Request, Response } from "express";
import { ChatModel, ChatRoomModel } from "../models/ChatModel";
import { handleErrors } from "./AuthController";
import { UserInfoModel } from "../models/UserModel";
import { io } from "../index";

// export const postChat = (req: Request, res: Response) => {
//   try {
//     if (!req.body.message || !req.body.sender || !req.body.receiver) {
//       res.send({ message: "not a valid chat", success: false });
//     }
//     const { message, sender, receiver } = req.body;
//     const chat = new ChatModel({
//       messages: { message, sender, receiver },
//       participants: [sender, receiver],
//     });
//     chat.save();
//     res.status(201).send({ success: true, message: "chat save succesfully" });
//   } catch (error) {
//     return res.status(404).send(handleErrors(error));
//   }
// };
export const postChat = async (data: any) => {
  try {
    const { message, sender, receiver, room_id } = data;
    const chatRoom = await ChatRoomModel.findOne({
      participants: { $in: [sender, receiver] },
    });
    if (chatRoom) {
      const chat = new ChatModel({
        message,
        sender,
        receiver,
        room_id,
      });
      chat.save();
    }
    // io.emit(`new-chat`, data);
  } catch (error) {
    console.log(error);
  }
};

export const updateChat = async (data: any) => {
  try {
    const { message, sender, receiver, room_id } = data;
    await ChatModel.findByIdAndUpdate(
      { _id: room_id },
      {
        $push: { messages: { message, sender, receiver } },
      }
    );
  } catch (error) {
    console.log(error);
  }
};
// export const updateChat = async (req: Request, res: Response) => {
//   try {
//     if (
//       !req.body.message ||
//       !req.body.sender ||
//       !req.body.receiver ||
//       !req.body.room_id
//     ) {
//       res.send({ message: "not a valid chat", success: false });
//     }
//     const { message, sender, receiver, room_id } = req.body;
//     await ChatModel.findByIdAndUpdate(
//       { _id: room_id },
//       {
//         $push: { messages: { message, sender, receiver } },
//       }
//     );

//     res.status(201).send({ success: true, message: "chat save succesfully" });
//   } catch (error) {
//     return res.status(404).send(handleErrors(error));
//   }
// };

export const getChatRooms = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.send({ message: "Not a valid user", success: false });
    }
    const chatRooms = await ChatModel.find(
      {
        participants: { $in: [id] },
      },
      { participants: { $elemMatch: [id] } }
    )
      .select("participants")
      .populate({
        path: "participants",
        select: "username",
        populate: {
          path: "userInfo",
          model: UserInfoModel,
          select: "display_name profile_picture",
        },
      });
    // .populate({
    //   path: "messages.sender messages.receiver",
    //   model: AuthModel,
    //   select: "username -_id",
    //   populate: {
    //     path: "userInfo",
    //     model: UserInfoModel,
    //     select: "display_name profile_picture -_id",
    //   },
    // })
    res.send({
      success: true,
      message: "Rooms fetched succesfully",
      chat_rooms: chatRooms,
    });
  } catch (error) {
    return res.status(404).send(handleErrors(error));
  }
};

export const getChats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.send({ message: "Not a valid chat", success: false });
    }
    const chatRoom = await ChatModel.find(
      { room_id: id },
      { message: 1, sender: 1, receiver: 1, _id: 0 }
    );
    res.send({
      success: true,
      message: "Chats fetched succesfully",
      chat: chatRoom,
    });
  } catch (error) {
    return res.status(404).send(handleErrors(error));
  }
};

export const setBackground = async (req: Request, res: Response) => {
  try {
    const { bg_image, room_id } = req.body;
    await ChatModel.findByIdAndUpdate(
      { _id: room_id },
      {
        $set: { bg_image: bg_image },
      }
    );
    res.send({
      success: true,
      message: "Backgrund image saved succesfully",
    });
  } catch (error) {
    return res.status(404).send(handleErrors(error));
  }
};
