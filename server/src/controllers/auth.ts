import { RequestHandler } from "express";
import UserModel from "src/models/user";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

import AuthVerificationTokenModel from "src/models/authVerificationToken";
import { sendErrorRes } from "src/utils/helper";
import jwt from "jsonwebtoken";

export const createNewUser: RequestHandler = async (req, res) => {
  const { email, password, name } = req.body;

  // if (!name) return sendErrorRes(res, "Name is missing", 422);
  // if (!email) return sendErrorRes(res, "Email is missing", 422);
  // if (!password) return sendErrorRes(res, "Password is missing", 422);

  const existingUser = await UserModel.findOne({ email });
  if (existingUser)
    return sendErrorRes(
      res,
      "Unauthorized request, email is already in use!",
      401
    );

  const user = await UserModel.create({ email, password, name });

  const token = crypto.randomBytes(36).toString("hex");

  await AuthVerificationTokenModel.create({ owner: user._id, token });

  const link = `http://localhost:8000/verify.html?id=${user._id}&token=${token}`;

  const transport = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: Number(process.env.NODEMAILER_PORT) || undefined,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  await transport.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: user.email,
    html: `<h1>Please click on <a href="${link}"> this link</a> to verify your account.</h1>`,
  });

  res.json({ message: "PLease check your inbox." });
};

export const verifyEmail: RequestHandler = async (req, res) => {
  const { id, token } = req.body;

  const authToken = await AuthVerificationTokenModel.findOne({ owner: id });
  if (!authToken) return sendErrorRes(res, "unauthorized request!", 403);

  const isMatched = await authToken.compareToken(token);
  if (!isMatched)
    return sendErrorRes(res, "unauthorized request, invalid token!", 403);

  await UserModel.findByIdAndUpdate(id, { verified: true });

  await AuthVerificationTokenModel.findByIdAndDelete(authToken._id);

  res.json({ message: "Thanks for joining us, your email is verified." });
};

export const signIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return sendErrorRes(res, "Email/Password mismatch!", 403);

  const isMatched = await user.comparePassword(password);
  if (!isMatched) return sendErrorRes(res, "Email/Password mismatch!", 403);

  const payload = { id: user._id };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET ?? "", {
    expiresIn: "15min",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET ?? "");

  if (!user.tokens) user.tokens = [refreshToken];
  else user.tokens.push(refreshToken);

  await user.save();

  res.json({
    profile: {
      id: user._id,
      email: user.email,
      name: user.name,
      verified: user.verified,
    },
    tokens: { refresh: refreshToken, access: accessToken },
  });
};

export const sendProfile: RequestHandler = async (req, res) => {
  res.json({
    profile: { ...req.user },
  });
};
