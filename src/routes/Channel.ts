import {
  filterChannelMessasges,
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
  getChannels
} from "../controller/ChannelCotroller";
import { Router } from "express";

const router = Router();
router.get("/get/channels/:id", getChannels);
router.post("/add/channel", postChannel);
router.put("/update/channel", updateChannel);
router.delete("/delete/:id", deleteChannel);
router.post("/add/participants", postParticipants);
router.delete("/delete/:channel_id/:id", deleteParticipant);
router.post("/channel/message", postChannelMessage);
router.get("/channel/messages/:channel_id", getChannelMessage);
router.get("/get/all/channels", getAllChannels);
router.post("/filter/channel/message", filterChannelMessasges);

export default router;
