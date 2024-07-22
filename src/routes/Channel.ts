import {
  deleteChannel,
  deleteParticipant,
  postChannel,
  postParticipants,
  updateChannel,
} from "../controller/ChannelCotroller";
import { Router } from "express";

const router = Router();
router.post("/add/channel", postChannel);
router.put("/update/channel", updateChannel);
router.delete("/delete/:id", deleteChannel);
router.post("/add/participants", postParticipants);
router.delete("/delete/:channel_id/:id", deleteParticipant);

export default router;
