const mongoose = require("mongoose");

const { Schema } = mongoose;

const usuarioCliente = new Schema({
  Email: { type: String, require: true },
  Contraseña: { type: String, require: true },
  Telefono: { type: String, require: true },

});





module.exports = mongoose.model("usuarioCliente", usuarioCliente);