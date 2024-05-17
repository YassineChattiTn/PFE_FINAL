const User = require("../models/User");
const UserRole = require("../models/UserRole");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**inscription des tout les utilisateurs */
const registerUser = async (req, res) => {
  try {
    const data = req.body;

    // Check if any users already exist
    const usersExist = await User.exists({});
    const role = usersExist ? "User" : "Admin";

    // Create new user
    const usr = new User({ ...data, role });
    const salt = bcrypt.genSaltSync(10);
    const cryptedPassword = bcrypt.hashSync(data.password, salt);
    usr.password = cryptedPassword;
    const savedUser = await usr.save();

    // Create user role with the same _id as the user
    const roleData = {
      _id: savedUser._id, // Set the _id to match the savedUser _id
      userId: savedUser._id,
      role: role,
    };
    const usrRole = new UserRole(roleData);
    const savedUserRole = await usrRole.save();

    res.status(200).send({
      user: savedUser,
      userRole: savedUserRole,
    });
  } catch (error) {
    res.status(500).send("error while registering: " + error);
  }
};

/**login */
const loginUser = async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findOne({ email: data.email });

    if (!user) {
      return res.status(404).send("Email or Password invalid!!!");
    }

    const validPass = bcrypt.compareSync(data.password, user.password);
    if (!validPass) {
      return res.status(401).send("Email or Password invalid!!!");
    }

    const payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, "0123"); // Replace "0123" with your secret key
    res.status(200).send({ myToken: token });
  } catch (error) {
    res.status(500).send("Error logging in: " + error);
  }
};

/**affichage des tout les utilisateurs */
const getUser = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**modification d'utilisateur */
const updateUser = async (req, res) => {
  try {
    const myId = req.params.id;
    const data = req.body;
    const newUser = await User.findByIdAndUpdate({ _id: myId }, data, {
      new: true,
    });
    res.send(newUser);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**affichage d'utilisateur selon ID */
const getOneUser = async (req, res) => {
  try {
    const myId = req.params.id;
    const user = await User.findById({ _id: myId });
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**effacer un utilisateur */
const deleteUser = async (req, res) => {
  try {
    const myId = req.params.id;
    const user = await User.findByIdAndDelete({ _id: myId });
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  getOneUser,
  deleteUser,
};
