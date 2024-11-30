import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import UserModel from "src/models/user";
import mongoose from "mongoose";
import PasswordResetTokenModel from "src/models/passwordResetToken";
// import dotenv from "dotenv";
// dotenv.config();

interface UserProfile {
  id: string | mongoose.Types.ObjectId;
  name: string;
  email: string;
  verified: boolean;
  avatar?: { id: string; url: string };
}

declare global {
  namespace Express {
    interface Request {
      user: UserProfile;
    }
  }
}

export const isAuth: RequestHandler = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken) return sendErrorRes(res, "unathorized request!", 403);

    const token = authToken.split("Bearer ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? "") as {
      id: string;
    };

    const user = await UserModel.findById(payload.id);
    if (!user) return sendErrorRes(res, "unauthorized request!", 403);

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar,
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return sendErrorRes(res, "Session expired", 401);
    }

    if (error instanceof JsonWebTokenError) {
      return sendErrorRes(res, "unauthorized access!", 401);
    }

    next(error);
  }
};

export const isValidPasswordResetToken: RequestHandler = async (
  req,
  res,
  next
) => {
  const { id, token } = req.body;

  const resetPasswordToken = await PasswordResetTokenModel.findOne({
    owner: id,
  });
  if (!resetPasswordToken)
    return sendErrorRes(res, "Unauthorized request, invalid token!", 403);

  const matched = await resetPasswordToken.compareToken(token);
  if (!matched)
    return sendErrorRes(res, "Unauthorized request, invalid token!", 403);
  next();
};
