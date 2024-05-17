const User = require("../models/User");

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user || user.role !== "Admin") {
      return res.status(403).send("Access denied. Admins only.");
    }

    next();
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
};

module.exports = isAdmin;
