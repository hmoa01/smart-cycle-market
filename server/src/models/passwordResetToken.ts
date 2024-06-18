import { Schema, model } from "mongoose";
import { hash, genSalt, compare } from "bcrypt";

interface PasswordResetTokenDocument extends Document {
  owner: Schema.Types.ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const schema = new Schema<PasswordResetTokenDocument, {}, Methods>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600, // 60 * 60
    default: Date.now(),
  },
});

schema.pre("save", async function (next) {
  if ((this, this.isModified)) {
    const salt = await genSalt(10);
    this.token = await hash(this.token, salt);
  }
  next();
});

schema.methods.compareToken = async function (token) {
  return await compare(token, this.token);
};

const PasswordResetTokenModel = model("PasswordResetToken", schema);
export default PasswordResetTokenModel;
