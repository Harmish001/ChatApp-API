import { getChatRooms, getChats, postChat, setBackground, updateChat } from "../controller/ChatController";
import { Router } from "express";

const router = Router();
router.post("/add/chat", postChat);
router.put("/update/chat", updateChat);
router.get("/get/chat/rooms/:id", getChatRooms);
router.get("/get/chat/:id", getChats);
router.post("/set/backgrund", setBackground);

export default router;
