const express = require("express");

require("./config/connect");

/**importation de dotenv */

const dontenv = require("dotenv");

dontenv.config({ path: ".env" });

/**routes */

const userRoute = require("./routers/User");
const userRoleRoute = require("./routers/UserRole");

/**initialisation de l'application */

const app = express();

app.use(express.json());

const PORT = process.env.PORT;

/**appel des routes */

app.use("/user", userRoute);
app.use("/userRole", userRoleRoute);
/**declaration de port de serveur q'ons va l'utiliser */

app.listen(PORT, () => {
  console.log("server running on " + PORT);
});
