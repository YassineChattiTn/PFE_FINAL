const User = require("../models/User");

const isResponsable = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user || user.role !== "Responsable") {
      return res.status(403).send("Access denied. Responsable only.");
    }

    next();
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
};

module.exports = isResponsable;
