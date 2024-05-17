const mongoose = require("mongoose");

const userRoleSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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

const UserRole = mongoose.model("UserRole", userRoleSchema);

module.exports = UserRole;
