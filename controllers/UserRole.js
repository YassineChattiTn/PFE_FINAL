const User = require("../models/User");
const UserRole = require("../models/UserRole");
const Boutique = require("../models/Boutique");
const Article = require("../models/Article");
const Panier = require("../models/Panier");
const Commande = require("../models/Commande");

/**creation d'un utilisateur */
const registerUserRole = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).send("User must be registered first");
    }

    const roleData = {
      userId: req.user._id,
      role: req.role,
    };

    const usrRole = new UserRole(roleData);
    const savedUserRole = await usrRole.save();
    res.status(200).send({
      user: req.user,
      userRole: savedUserRole,
    });
  } catch (error) {
    res.status(500).send("Error while registering user role: " + error);
  }
};

/** Update user role in both User and UserRole collections */
const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role, boutiqueId } = req.body;

    if (!["Admin", "Responsable", "User"].includes(role)) {
      return res.status(400).send("Invalid role");
    }

    // Update role and boutiqueId in User collection
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        role,
        boutiqueId: role === "Responsable" ? boutiqueId : null,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    // Update role and boutiqueId in UserRole collection
    const updatedUserRole = await UserRole.findByIdAndUpdate(
      userId,
      {
        role,
        boutiqueId: role === "Responsable" ? boutiqueId : null,
      },
      { new: true }
    );

    if (!updatedUserRole) {
      return res.status(404).send("UserRole not found");
    }

    if (role === "Responsable" && boutiqueId) {
      // Update the Boutique with the new responsable
      const updatedBoutique = await Boutique.findByIdAndUpdate(
        boutiqueId,
        { responsableId: userId },
        { new: true }
      );

      if (!updatedBoutique) {
        return res.status(404).send("Boutique not found");
      }
    }

    res.status(200).send({
      user: updatedUser,
      userRole: updatedUserRole,
    });
  } catch (error) {
    res.status(500).send("Error updating user role: " + error);
  }
};

/**supprimer role */
const deleteUserRole = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the current user role
    const userRole = await UserRole.findById(userId);
    if (!userRole) {
      return res.status(404).send("UserRole not found");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    let updatedBoutique;
    if (userRole.role === "Responsable") {
      // Update role to 'User' and remove boutiqueId in UserRole model
      await UserRole.findByIdAndUpdate(
        userId,
        { role: "User", boutiqueId: null },
        { new: true }
      );

      // Update role to 'User' and remove boutiqueId in User model
      await User.findByIdAndUpdate(
        userId,
        { role: "User", boutiqueId: null },
        { new: true }
      );

      // Remove responsableId from Boutique model
      updatedBoutique = await Boutique.findByIdAndUpdate(
        userRole.boutiqueId,
        { responsableId: null },
        { new: true }
      );
    } else {
      // Update role to 'User' in UserRole model
      await UserRole.findByIdAndUpdate(userId, { role: "User" }, { new: true });

      // Update role to 'User' in User model
      await User.findByIdAndUpdate(userId, { role: "User" }, { new: true });
    }

    res.send({
      user: {
        _id: user._id,
        role: "User",
        boutiqueId: null,
      },
      userRole: {
        _id: userRole._id,
        role: "User",
        boutiqueId: null,
      },
      updatedBoutique,
    });
  } catch (error) {
    res.status(500).send("Error updating user role: " + error);
  }
};

/**add boutique */
const addBoutique = async (req, res) => {
  try {
    const data = req.body;
    const boutique = new Boutique(data);
    const savedBoutique = await boutique.save();
    res.status(200).send(savedBoutique);
  } catch (error) {
    console.log("error while creating store " + error);
    res.status(500).send(error);
  }
};

/**parti boutique */

/**affichage des boutiques */
const getBoutique = async (req, res) => {
  try {
    const boutiques = await Boutique.find();
    res.status(200).send(boutiques);
  } catch (error) {
    console.log("error while getting stores" + error);
    res.status(500).send(error);
  }
};

/**modification d'une boutique */
const updateBoutique = async (req, res) => {
  try {
    const myId = req.params.id;
    const data = req.body;
    const updatedBoutique = await Boutique.findByIdAndUpdate(
      { _id: myId },
      data,
      { new: true }
    );
    res.status(200).send(updatedBoutique);
  } catch (error) {
    console.log("error while updating store " + error);
    res.status(500).send(error);
  }
};

/**affichage de boutique selon ID */
const getBoutiqueId = async (req, res) => {
  try {
    const myId = req.params.id;
    const boutique = await Boutique.findById({ _id: myId });
    res.status(200).send(boutique);
  } catch (error) {
    console.log("error while getting a store by ID " + error);
    res.status(500).send(error);
  }
};

/**effacer une boutique */
const deleteBoutique = async (req, res) => {
  try {
    const boutiqueId = req.params.id;

    // Find the boutique to be deleted
    const boutique = await Boutique.findById(boutiqueId);
    if (!boutique) {
      return res.status(404).send("Boutique not found");
    }

    const responsableId = boutique.responsableId;

    // Delete the boutique
    await Boutique.findByIdAndDelete(boutiqueId);

    if (responsableId) {
      // Update role to 'User' and remove boutiqueId in UserRole model
      await UserRole.findByIdAndUpdate(
        responsableId,
        { role: "User", boutiqueId: null },
        { new: true }
      );

      // Update role to 'User' and remove boutiqueId in User model
      await User.findByIdAndUpdate(
        responsableId,
        { role: "User", boutiqueId: null },
        { new: true }
      );
    }

    res.status(200).send(boutique);
  } catch (error) {
    console.log("error while deleting a store " + error);
    res.status(500).send(error);
  }
};

/**-----------------Article------------------- */

/**creation d'un article */
const addArticle = async (req, res) => {
  try {
    const data = req.body;

    const article = new Article(data);
    const savedArticle = await article.save();
    res.status(200).send(savedArticle);
  } catch (error) {
    res.status(400).send(error);
  }
};

/**affichage des articles */
const getArticles = async (req, res) => {
  try {
    const article = await Article.find();
    res.status(200).send(article);
  } catch (error) {
    console.log("error while getting articles " + error);
    res.status(500).send(error);
  }
};

/**affichage des articles d'une seul boutiques */
const getArticleBoutique = async (req, res) => {
  try {
    const myId = req.params.id;
    const article = await Article.find({ expediteur: myId });
    res.status(200).send(article);
  } catch (error) {
    console.log("error while getting article by ID " + error);
    res.status(500).send(error);
  }
};

/**modification d'un article */
const updateArticle = async (req, res) => {
  try {
    const myId = req.params.id;
    const data = req.body;
    const updatedarticle = await Article.findByIdAndUpdate(
      { _id: myId },
      data,
      { new: true }
    );
    res.status(200).send(updatedarticle);
  } catch (error) {
    console.log("error while updating an article " + error);
    res.status(500).send(error);
  }
};

/**affichage d'un article selon leur ID */
const getArticleId = async (req, res) => {
  try {
    const myId = req.params.id;
    const article = await Article.findById({ _id: myId });
    res.status(200).send(article);
  } catch (error) {
    console.log("error while getting article by ID " + error);
    res.status(500).send(error);
  }
};

/**effacer un article selon leur ID */
const deleteArticle = async (req, res) => {
  try {
    const myId = req.params.id;
    const article = await Article.findByIdAndDelete({ _id: myId });
    res.status(200).send(article);
  } catch (error) {
    console.log("error while deleting an article " + error);
    res.status(500).send(error);
  }
};

/**modifier l'etat du stock a non disponible */
const updateArticleToIndisponible = async (req, res) => {
  try {
    const myId = req.params.id;
    const data = { stock: "non disponible" };
    const article = await Article.findByIdAndUpdate({ _id: myId }, data);
    res.status(200).send(article);
  } catch (error) {
    console.log(error);
    console.log("error while updating article's stock");
    res.status(400).send(error);
  }
};

/**modifier l'etat du stock a disponible */
const updateArticleToDisponible = async (req, res) => {
  try {
    const myId = req.params.id;
    const data = { stock: "disponible" };
    const article = await Article.findByIdAndUpdate({ _id: myId }, data);
    res.status(200).send(article);
  } catch (error) {
    console.log(error);
    console.log("error while updating article's stock");
    res.status(400).send(error);
  }
};

/**---------------------panier------------------- */

/**afficher du panier */
const getPanier = async (req, res) => {
  try {
    panier = await Panier.find();
    res.status(200).send(panier);
  } catch (error) {
    console.log(error);
    console.log("error while getting panier");
  }
};

/**ajout d'une panier */
const addPanier = async (req, res) => {
  try {
    const { clientId, referencePanier, items } = req.body;
    const client = await User.findById(clientId);

    if (!client) {
      return res.status(404).send({ error: "Client not found" });
    }

    let totalPanier = 0;
    const itemsProcessed = await Promise.all(
      items.map(async (item) => {
        const article = await Article.findById(item.articleId);
        if (!article) {
          throw new Error(`Article with ID ${item.articleId} not found`);
        }

        const total =
          parseFloat(article.price.replace("DT", "")) * item.quantity;
        totalPanier += total;

        return {
          articleId: item.articleId,
          quantity: item.quantity,
          total,
          nameArticle: article.name,
        };
      })
    );

    const panier = new Panier({
      referencePanier,
      clientId,
      items: itemsProcessed,
      totalPanier,
      nameClient: client.name,
    });

    const savedPanier = await panier.save();
    res.status(200).send(savedPanier);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Error while creating the panier" });
  }
};

/** afficher panier selon id */
const getOnePanier = async (req, res) => {
  try {
    myId = req.params.id;
    panier = await Panier.findById({ _id: myId });
    res.status(200).send(panier);
  } catch (error) {
    console.log(error);
    console.log("error while getting panier");
  }
};

/**effacer une panier */
const deletePanier = async (req, res) => {
  try {
    myId = req.params.id;
    panierToDelete = await Panier.findByIdAndDelete({ _id: myId });
    res.status(200).send(panierToDelete);
  } catch (error) {
    console.log(error);
    console.log("error while deleting panier...");
    res.status(400).send(error);
  }
};

/**modifie une panier */
const updatePanier = async (req, res) => {
  try {
    const myId = req.params.id;
    const { items } = req.body;

    // Find the existing panier
    const existingPanier = await Panier.findById(myId);
    if (!existingPanier) {
      return res.status(404).send("Panier not found");
    }

    let totalPanier = 0;

    // Process and update items
    const updatedItems = await Promise.all(
      items.map(async (item) => {
        const article = await Article.findById(item.articleId);
        if (!article) {
          throw new Error(`Article with ID ${item.articleId} not found`);
        }

        const price = parseFloat(article.price.replace("DT", ""));
        if (isNaN(price)) {
          throw new Error(
            `Invalid price for article with ID ${item.articleId}`
          );
        }

        const total = price * item.quantity;
        totalPanier += total;

        return {
          articleId: item.articleId,
          quantity: item.quantity,
          total,
          nameArticle: article.name,
        };
      })
    );

    // Update the Panier with the new data and recalculated total
    existingPanier.items = updatedItems;
    existingPanier.totalPanier = totalPanier;

    await existingPanier.save();

    res.status(200).send(existingPanier);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error while updating panier: " + error);
  }
};

/**---------------------commande--------------------- */

const addCommande = async (req, res) => {
  try {
    const { commandeRef, panierRef } = req.body;

    const panier = await Panier.findById(panierRef);

    console.log(panier);

    if (!panier) {
      return res.status(404).send({ error: "Panier not found" });
    }

    const newCommande = new Commande({
      commandeRef,
      panierRef,
      total: panier.totalPanier,
    });
    const savedCommande = await newCommande.save();

    res.status(200).send(savedCommande);
    console.log(savedCommande);
  } catch (error) {
    res
      .status(400)
      .send({ error: "error while creating commande" + error.message });
  }
};

/**affichage des Commandes */
const getCommandes = async (req, res) => {
  try {
    commande = await Commande.find();
    res.status(200).send(commande);
  } catch (error) {
    console.log(error);
    console.log("error while getting commande");
  }
};

/**affichage d'une seul commande */
const getCommande = async (req, res) => {
  try {
    const data = req.params.id;
    commande = await Commande.findById({ _id: data });
    res.status(200).send(commande);
  } catch (error) {
    console.log(error);
    console.log("error while getting commande");
  }
};

/**effacer une commande */
const deleteCommande = async (req, res) => {
  try {
    const data = req.params.id;
    commande = await Commande.findByIdAndDelete({ _id: data });
    res.status(200).send(commande);
  } catch (error) {
    console.log(error);
    console.log("error while getting commande");
  }
};

module.exports = {
  registerUserRole,
  updateUserRole,
  deleteUserRole,
  addBoutique,
  getBoutique,
  updateBoutique,
  getBoutiqueId,
  deleteBoutique,
  addArticle,
  getArticles,
  getArticleId,
  getArticleBoutique,
  updateArticle,
  deleteArticle,
  updateArticleToDisponible,
  updateArticleToIndisponible,
  addPanier,
  getPanier,
  getOnePanier,
  updatePanier,
  deletePanier,
  addCommande,
  getCommande,
  getCommandes,
  deleteCommande,
};
