import { Schema, model } from "mongoose";
import { hash, genSalt, compare } from "bcrypt";

interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  tokens: string[];
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    tokens: [String],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if ((this, this.isModified)) {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await compare(password, this.password);
};

const UserModel = model<UserDocument>("User", userSchema);
export default UserModel;
