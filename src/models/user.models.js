import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Will be unique throughout the whole Database
      lowercase: true,
      index: true, // In case of querying using index
      trim: true, // remove extra spaces
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String, // URL for cloudinary to upload images
      required: true,
    },
    coverImage: {
      type: String, // URL for cloudinary to upload images
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "password is required"], // Message to be sent to frontend in case no password is given
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true } // For createdAt and updatedAt fields.
);

userSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return next()

  this.password = bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
z
userSchema.methods.generateAccessToken = async function () {
  // These are short lived
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
  );
};

userSchema.methods.generateRefreshToken = async function () {
  // These are short lived
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
  );
};

export const User = mongoose.model("User", userSchema);
