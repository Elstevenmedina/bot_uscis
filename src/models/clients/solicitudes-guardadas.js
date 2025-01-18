const mongoose = require("mongoose");
const { Schema } = mongoose;

const solicitudesGuardadas = new Schema({
  _idForm: { type: String, require: true },
  _idUserClient: { type: String, require: true },
  dataPrecios: [{ 
    _idCampo:{type: String, require: true },
    Precio:{type: String, require: true },
    accion:{type: String },
  }],
  inputs: [{
    key: { type: String, require: true },
    valor: { type: String, require: true },
    pagina: { type: String, require: true },
    _idFormulario: { type: String, require: true },
  }]
});

module.exports = mongoose.model("solicitudesGuardadas", solicitudesGuardadas);
