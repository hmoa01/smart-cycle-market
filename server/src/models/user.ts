import { Schema, Model, model } from "mongoose";
import { hash, genSalt, compare } from "bcrypt";

export interface UserDocument extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  verified: boolean;
  tokens: string[];
  avatar?: { url: string; id: string };
}

interface Methods {
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
    avatar: {
      type: Object,
      url: String,
      id: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await compare(password, this.password);
};

const UserModel = model("User", userSchema) as Model<UserDocument, {}, Methods>;
export default UserModel;
