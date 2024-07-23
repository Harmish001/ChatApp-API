import {
  getChannelMessage,
  postChannelMessage,
} from "../controller/ChannelMessageController";
import {
  deleteChannel,
  deleteParticipant,
  getAllChannels,
  postChannel,
  postParticipants,
  updateChannel,
} from "../controller/ChannelCotroller";
import { Router } from "express";

const router = Router();
router.get("/get/channels/:id", getAllChannels);
router.post("/add/channel", postChannel);
router.put("/update/channel", updateChannel);
router.delete("/delete/:id", deleteChannel);
router.post("/add/participants", postParticipants);
router.delete("/delete/:channel_id/:id", deleteParticipant);
router.post("/channel/message", postChannelMessage);
router.get("/channel/messages/:channel_id", getChannelMessage);

export default router;
