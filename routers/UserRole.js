const express = require("express");

const router = express.Router();

const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");
const isResponsable = require("../middleware/isResponsable");

const {
  updateUserRole,
  deleteUserRole,
  addBoutique,
  getBoutique,
  updateBoutique,
  getBoutiqueId,
  deleteBoutique,
  getArticles,
  addArticle,
  updateArticle,
  getArticleId,
  deleteArticle,
  updateArticleToIndisponible,
  updateArticleToDisponible,
  getArticleBoutique,
  addPanier,
  getPanier,
  getOnePanier,
  deletePanier,
  updatePanier,
  addCommande,
  getCommande,
  getCommandes,
  deleteCommande,
} = require("../controllers/UserRole");

//**update user role */
router.put("/updateUserRole/:id", isAuth, isAdmin, updateUserRole);

/**effacer role */
router.put("/deleteUserRole/:id", isAuth, isAdmin, deleteUserRole);

/**ajouter une boutique */
router.post("/addBoutique", isAuth, isAdmin, addBoutique);

//**modification de boutique */
router.put("/updateBoutique/:id", isAuth, isResponsable, updateBoutique);

//**affichage de boutique */
router.get("/getBoutique", isAuth, isAdmin, getBoutique);

/**affichage a traver ID */
router.get("/getBoutique/:id", isAuth, isResponsable, getBoutiqueId);

//**effacer le boutique */
router.delete("/deleteBoutique/:id", isAuth, isAdmin, deleteBoutique);

/**creation d'un article */
router.post("/addArticle", isAuth, addArticle);

//**modification de article */
router.put("/updateArticle/:id", isAuth, isResponsable, updateArticle);

//**affichage de article */
router.get("/getArticle", isAuth, isResponsable, getArticles);

/**affichage a traver ID */
router.get("/getArticle/:id", isAuth, isResponsable, getArticleId);

/**affichage les articles d'une seul boutique */
router.get(
  "/getArticleBoutique/:id",
  isAuth,
  isResponsable,
  getArticleBoutique
);

//**effacer l'article' */
router.delete("/deleteArticle/:id", isAuth, isResponsable, deleteArticle);

/**updating article stock to indisponible */
router.put(
  "/updateArticleStock/:id",
  isAuth,
  isResponsable,
  updateArticleToIndisponible
);

/**updating article stock to disponible */

router.put(
  "/updateArticleStockDispo/:id",
  isAuth,
  isResponsable,
  updateArticleToDisponible
);

/**ajout du panier */

router.post("/addPanier", isAuth, addPanier);

/**afficher tout les panier */

router.get("/getPanier", isAuth, getPanier);

/**afficher une panier selon ID */

router.get("/getPanier/:id", isAuth, getOnePanier);

/**effacer une panier */

router.delete("/deletePanier/:id", isAuth, deletePanier);

/**effacer une panier */

router.put("/updatePanier/:id", isAuth, updatePanier);

/**ajout du commande */
router.post("/addCommande", isAuth, addCommande);

/**affichage des commandes */
router.get("/getCommandes", isAuth, getCommandes);

/**affichage d'une seul commande */
router.get("/getCommande/:id", isAuth, getCommande);

/**effacer une commande */
router.delete("/deleteCommande/:id", isAuth, deleteCommande);

module.exports = router;
