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
		if (user) {
			res.status(201).json({ user, success: true, navigate: "" });
		} else {
			res.status(500).json({ message: "user not found", success: true });
		}
	} catch (error) {
		return res.status(404).send(handleErrors(error));
	}
};

export const signup = async (req: any, res: any) => {
	try {
		const { username, password, email } = req.body;
		if (!username || !password)
			return res.status(504).send({
				success: false,
				message: "Please add valid credentials",
			});
		const user = new AuthModel({
			username,
			password,
			userInfo: {
				display_name: username,
				email,
			},
		});
		user.save();
		res.status(201).json({ message: "User added successfully", success: true, user});
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
		const user = await AuthModel.findOne(
			{ _id: id },
			{
				username: 1,
				"userInfo.display_name": 1,
				"userInfo.profile_picture": 1,
				"userInfo.email": 1,
				"userInfo.contact": 1,
				"userInfo.gender": 1,
				theme_color: 1,
			}
		);
		if (user) {
			res
				.status(201)
				.send({ success: true, message: "user is loggedin", user: user });
		} else {
			res.status(400).send({ success: false, message: "user not found" });
		}
	} catch (error) {
		return res.status(404).send(handleErrors(error));
	}
};

export const updateColor = async (req: any, res: any) => {
	try {
		const { id, color } = req.params;
		console.log(req.params);
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
