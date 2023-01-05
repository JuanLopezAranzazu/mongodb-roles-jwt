const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followedes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
