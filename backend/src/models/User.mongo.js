const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    role_id: {
      type: Number,
      default: 1,
    },
    settings: {
      workingHours: { type: Number, default: 8 },
      breakTime: { type: Number, default: 30 },
      theme: { type: String, default: "system" },
      notifications: { type: Boolean, default: true },
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

module.exports = mongoose.model("User", userSchema);
