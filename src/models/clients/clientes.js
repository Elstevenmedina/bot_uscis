const mongoose = require("mongoose");
const { Schema } = mongoose;

const cliente = new Schema({
    Nombres:  { type: String, require: true },
    Apellidos:  { type: String, require: true },
    Direccion:  { type: String, require: true },
    NumeroContacto:  { type: String, require: true },
    CorreoElectronico:  { type: String, require: true },
    _idUser:  { type: String, require: true },
    Franquicia:  { type: String, require: true },

});

module.exports = mongoose.model("cliente", cliente);
