import { RequestHandler } from "express";
import UserModel from "src/models/user";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

import AuthVerificationTokenModel from "src/models/authVerificationToken";

export const createNewUser: RequestHandler = async (req, res) => {
  const { email, password, name } = req.body;

  if (!name) return res.status(422).json({ message: "Name is missing" });
  if (!email) return res.status(422).json({ message: "Email is missing" });
  if (!password)
    return res.status(422).json({ message: "Password is missing" });

  const existingUser = await UserModel.findOne({ email });
  if (existingUser)
    return res
      .status(401)
      .json({ message: "Unauthorized request, email is already in use!" });

  const user = await UserModel.create({ email, password, name });

  const token = crypto.randomBytes(36).toString("hex");

  await AuthVerificationTokenModel.create({ owner: user._id, token });

  const link = `http://localhost:8000/verify?id=${user._id}&token=${token}`;

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
