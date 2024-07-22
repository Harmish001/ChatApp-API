import {
  adduserInfo,
  getUsers,
  updateuserInfo,
  getuserInfo,
  uploadProfilePic,
} from "../controller/UsersController";
import { Router } from "express";

const router = Router();

router.get("/users/:id", getUsers);
router.post("/addUserInfo", adduserInfo);
router.put("/updateUserInfo", updateuserInfo);
router.get("/getUserInfo/:username", getuserInfo);
router.post("/uploadImage/:id", uploadProfilePic);

export default router;
