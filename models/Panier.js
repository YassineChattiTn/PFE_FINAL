const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  nameArticle: {
    type: String,
    required: true,
  },
});

const panierSchema = mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [itemSchema],
  totalPanier: {
    type: Number,
    required: true,
  },
  nameClient: {
    type: String,
    required: true,
  },
});

const Panier = mongoose.model("Panier", panierSchema);

module.exports = Panier;
