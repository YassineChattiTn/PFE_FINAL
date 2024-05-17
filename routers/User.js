const express = require("express");

const router = express.Router();

const isAuth = require("../middleware/isAuth");

const {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  getOneUser,
  deleteUser,
} = require("../controllers/User");

//**register */
router.post("/register", registerUser);

/**login  */
router.post("/login", loginUser);

//**modification d'utilisateur */
router.put("/updateUser/:id", isAuth, updateUser);

//**affichage d'utilisateur */
router.get("/getUser", isAuth, getUser);

/**affichage a traver ID */
router.get("/getUser/:id", isAuth, getOneUser);

//**effacer l'utilisateur */
router.delete("/deleteUser/:id", isAuth, deleteUser);

module.exports = router;
