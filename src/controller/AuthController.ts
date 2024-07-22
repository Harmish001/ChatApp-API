import { UserInfoModel } from "../models/UserModel";
import { AuthModel } from "../models/AuthModel";
import { empty_profile_image } from "./UsersController";

export const handleErrors = (err: any) => {
  const error = {
    success: false,
    message: err.message,
  };
  return error;
};

export const login = async (req: any, res: any) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(500)
        .send({ message: "Enter valid credentials", success: false });
    const user = await AuthModel.findOne({ username, password });
    const userInfo = await UserInfoModel.findOne({ user_id: user?._id });
    if (user) {
      if (userInfo) {
        res.status(201).json({ user, success: true, navigate: "" });
      } else {
        res.status(201).json({ user, success: true, navigate: "user-info" });
      }
    } else {
      res.status(500).json({ message: "user not found", success: true });
    }
  } catch (error) {
    return res.status(404).send(handleErrors(error));
  }
};

export const signup = async (req: any, res: any) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(504).send({
        success: false,
        message: "Please add valid credentials",
      });
    const user = new AuthModel({
      username,
      password,
    });
    user.save();
    const userInfo = new UserInfoModel({
      user_id: user._id,
      display_name: username,
      contact: "",
      email: "",
      profile_picture: empty_profile_image,
    });
    userInfo.save();
    await AuthModel.findByIdAndUpdate(
      { _id: user._id },
      {
        $set: { userInfo: userInfo._id },
      }
    );
    res.status(201).json({ user, success: true });
  } catch (error) {
    return res.status(404).send(handleErrors(error));
  }
};

export const getUser = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    if (id.length == 0) {
      return res
        .status(404)
        .send({ message: "Not a valid user", success: false });
    }
    const user = await AuthModel.findOne({ _id: id })
      .select("-password -__v")
      .populate({
        path: "userInfo",
        select: "display_name profile_picture -_id",
      });
    res
      .status(201)
      .send({ success: true, message: "user is loggedin", user: user });
  } catch (error) {
    return res.status(404).send(handleErrors(error));
  }
};

export const updateColor = async (req: any, res: any) => {
  try {
    const { id, color } = req.params;
    console.log(req.params)
    await AuthModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: { theme_color: color },
      }
    );
    res
      .status(201)
      .send({ success: true, message: "Theme color changes succesfully" });
  } catch (error) {
    return res.status(404).send(handleErrors(error));
  }
};
