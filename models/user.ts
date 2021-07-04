import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

interface UserAttrs {
  email: string;
  password: string;
}

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
    select: false,
  },
});

userSchema.methods.correctPassword = async (
  candidatePassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

userSchema.statics.build = function (attrs: UserAttrs): UserDocument {
  return new User(attrs);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  //@ts-ignore
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export default User;
