const mongoose = require("mongoose");
const { Schema } = mongoose;

const finiquitos = new Schema({
    Cliente: { type: String, require: true },
    Fecha: { type: String, require: true },
    Ruta: { type: String, require: true },
});

module.exports = mongoose.model("finiquitos", finiquitos);
