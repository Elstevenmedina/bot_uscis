const mongoose = require("mongoose");
const { Schema } = mongoose;


const franquicias = new Schema({
  Nombre: { type: String, require: true },
  Responsable: { type: String, require: true },
  PaginaWeb: { type: String, require: true },
  Zelle: { type: String, default: "" },
  NombreEmpresa: { type: String, default: "" },
  Whatsapp: { type: String, default: "" },
});

module.exports = mongoose.model("franquicias", franquicias);
