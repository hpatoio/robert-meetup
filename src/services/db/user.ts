import { Schema, model } from "mongoose";
import type { User as IUser } from "../../model/user";

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  wallet: { type: String, required: true },
  nftAddress: { type: String },
  nftAvatar: { type: String },
});

export const User = model<IUser>("User", userSchema);
