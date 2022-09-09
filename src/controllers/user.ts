import { Request, Response } from "express";
import { generateMessageNonce, generateMessageHash } from "../utils/crypto";
import type { User as IUser } from "../model/user";
import { User } from "../services/db/user";

export const add = async (
  req: Request<{}, {}, IUser>,
  res: Response<IUser | { error: string }>
) => {
  const user = new User(req.body);

  // check is user already exists
  const q = User.find();
  const docs = await q
    .or([{ wallet: user.wallet }, { username: user.username }])
    .exec();

  if (docs.length > 0) {
    return res.status(500).json({
      error: "User alredy present!",
    });
  }

  try {
    await user.save();
    return res.status(201).json(user.toJSON());
  } catch (e) {
    return res.status(500).json({
      error: (e as Error).message,
    });
  }
};

export const edit = async (
  req: Request<{ wallet: string }, {}, Omit<IUser, "wallet">>,
  res: Response<IUser | { error: string }>
) => {
  const { wallet } = req.params;
  // find user
  try {
    const user = await User.findOneAndUpdate({ wallet }, req.body).exec();
    if (!user) {
      return res.status(404).send();
    }
    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).json({
      error: (e as Error).message,
    });
  }
};

export const getByAddress = async (
  req: Request<{ wallet: string }>,
  res: Response<IUser | { error: string }>
) => {
  try {
    const user = await User.findOne({ wallet: req.params.wallet }).exec();
    if (!user) {
      return res.status(404).send();
    }
    return res.status(200).json(user.toJSON());
  } catch (e) {
    return res.status(500).json({
      error: (e as Error).message,
    });
  }
};

export const remove = async (
  req: Request<{ wallet: string }>,
  res: Response<{} | { error: string }>
) => {
  try {
    const del = await User.deleteOne({ wallet: req.params.wallet }).exec();
    if (del.deletedCount === 0) {
      return res.status(404).send();
    }
    return res.status(200).json({});
  } catch (e) {
    return res.status(500).json({
      error: (e as Error).message,
    });
  }
};

export const getMessageToSign = async (
  req: Request,
  res: Response<{ message: string; hash: string }>
) => {
  const message = `Welcome to Open-Meetup!\n\nSign this message to prove your identity.\n\nThis request will not trigger a blockchain transaction or cost any gas fees. It's totally safe and we won't get in control of your funds at any time.\n\nNonce:${generateMessageNonce()}`;

  const hash = generateMessageHash(message);
  return res.status(200).json({
    message,
    hash,
  });
};
