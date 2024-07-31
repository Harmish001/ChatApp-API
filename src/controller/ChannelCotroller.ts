import { Request, Response } from "express";
import { handleErrors } from "./AuthController";
import { ChannelModel } from "../models/ChannelModel";

export const getChannels = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const channels = await ChannelModel.find({ participants: { $in: [id] } });
		res.send({ channels });
	} catch (error) {
		return res.status(404).send(handleErrors(error));
	}
};

export const postChannel = async (req: Request, res: Response) => {
	try {
		const { channel_name, is_private, userId } = req.body;
		const channel = new ChannelModel({
			channel_name,
			is_private,
			participants: [userId]
		});
		channel.save();
		res.send({
			channel,
			message: "Channel created succesfully",
			success: true,
		});
	} catch (error) {
		return res.status(404).send(handleErrors(error));
	}
};

export const updateChannel = async (req: Request, res: Response) => {
	try {
		const { channel_name, is_private, channel_id, channel_theme } = req.body;

		const channel = await ChannelModel.findByIdAndUpdate(
			{ _id: channel_id },
			{
				$set: {
					channel_name,
					is_private,
					channel_theme,
				},
			},
			{ new: true }
		);
		res.send({
			channel,
			message: "Channel updated succesfully",
			success: true,
		});
	} catch (error) {
		return res.status(404).send(handleErrors(error));
	}
};

export const deleteChannel = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		await ChannelModel.deleteOne({ _id: id });
		res.send({
			message: "Channel deleted succesfully",
			success: true,
		});
	} catch (error) {
		return res.status(404).send(handleErrors(error));
	}
};

export const postParticipants = async (req: Request, res: Response) => {
	try {
		const { participants, channel_id } = req.body;

		const channel = await ChannelModel.findByIdAndUpdate(
			{ _id: channel_id },
			{
				$addToSet: { participants },
			},
			{ new: true }
		);
		res.send({
			channel,
			message: "Particpant added succesfully",
			success: true,
		});
	} catch (error) {
		return res.status(404).send(handleErrors(error));
	}
};

export const deleteParticipant = async (req: Request, res: Response) => {
	try {
		const { id, channel_id } = req.params;

		const channel = await ChannelModel.findByIdAndUpdate(
			{ _id: channel_id },
			{
				$pullAll: {
					participants: [id],
				},
			},
			{ new: true }
		);
		res.send({
			channel,
			message: "Participant deleted succesfully",
			success: true,
		});
	} catch (error) {
		return res.status(404).send(handleErrors(error));
	}
};

export const getAllChannels = async (req: Request, res: Response) => {
	try {
		const channels = await ChannelModel.find();
		res.send({ channels });
	} catch (error) {
		return res.status(404).send(handleErrors(error));
	}
};
