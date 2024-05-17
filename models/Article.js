const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Article must have a name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Article must have a description"],
    trim: true,
  },
  price: {
    type: String,
    required: [true, "Article must have a price"],
    trim: true,
  },
  stock: {
    type: String,
    required: [true, "Article must have a state"],
    trim: true,
  },
  categorie: {
    type: String,
    required: [true, "Article must have a categorie"],
    trim: true,
  },
  expediteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Boutique",
    required: true,
  },
  image: {
    type: String,
    required: [true, "Article must have an image"],
    trim: true,
  },
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
