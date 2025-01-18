const mongoose = require("mongoose");
const { Schema } = mongoose;

const autentificacionesClientes = new Schema({
  _idUser: { type: String, require: true },
});

module.exports = mongoose.model("autentificacionesClientes", autentificacionesClientes);
