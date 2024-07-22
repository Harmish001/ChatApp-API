import { Router } from "express";
import { getUser, login, signup, updateColor } from "../controller/AuthController";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/isUserLoggedin/:id", getUser);
router.get("/color/change/:id/:color", updateColor);

export default router;
