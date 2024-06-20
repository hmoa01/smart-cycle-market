import { Router } from "express";
import {
  createNewUser,
  generateForgetPassLink,
  generateVerificationLink,
  grantAccessToken,
  grantValid,
  sendProfile,
  signIn,
  signOut,
  updateAvatar,
  updatePassword,
  updateProfile,
  verifyEmail,
} from "controllers/auth";
import validate from "src/middleware/validator";
import {
  newUserSchema,
  resetPasswordSchema,
  verifyTokenSchema,
} from "src/utils/validationSchema";
import { isAuth, isValidPasswordResetToken } from "src/middleware/auth";
import fileParser from "src/middleware/fileParser";

const authRouter = Router();

authRouter.post("/sign-up", validate(newUserSchema), createNewUser);
authRouter.post("/verify", validate(verifyTokenSchema), verifyEmail);
authRouter.get("/verify-token", isAuth, generateVerificationLink);
authRouter.post("/sign-in", signIn);
authRouter.get("/profile", isAuth, sendProfile);
authRouter.post("/refresh-token", grantAccessToken);
authRouter.post("/sign-out", isAuth, signOut);
authRouter.post("/forget-password", generateForgetPassLink);
authRouter.post(
  "/verify-password-reset-token",
  validate(verifyTokenSchema),
  isValidPasswordResetToken,
  grantValid
);
authRouter.post(
  "/reset-password",
  validate(resetPasswordSchema),
  isValidPasswordResetToken,
  updatePassword
);
authRouter.patch("/update-profile", isAuth, updateProfile);
authRouter.patch("/update-avatar", isAuth, fileParser, updateAvatar);

export default authRouter;
