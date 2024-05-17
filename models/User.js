const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["Admin", "User", "Responsable"],
    default: "User",
  },
  boutiqueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Boutique",
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
