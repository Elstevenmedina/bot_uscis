const mongoose = require("mongoose");
const { Schema } = mongoose;

const categoriasSoporte = new Schema({
  categoria: { type: String, require: true },
  subcategorias: [{type: String, require: true}]
});

module.exports = mongoose.model("categoriasSoporte", categoriasSoporte);
