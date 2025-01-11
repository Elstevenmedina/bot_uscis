const mongoose = require("mongoose");
const { Schema } = mongoose;

const resultados = new Schema({
  Titulo: { type: String, require: false },
  Fecha: { type: String, require: false },
  FechaCulminacion: { type: String },
  _idFormulario : { type: String, require: false },
  Franquicia: { type: String, require: false },
  _idFranquicia: { type: String, require: false },
  TimeStamp : { type: String, require: false },
  Estado: { type: String, default:"Pendiente" },
  Visualizacion: { type: Boolean, default:true },
  OrdenActualizado : { type: Boolean, default: false },
  MetodoPago : { type: String, require: false },
  _idUserCliente : { type: String, require: false }, 
  NombresCliente : { type: String, require: false }, 
  ApellidosCliente : { type: String, require: false }, 
  NumeroTelefonicoCliente : { type: String, require: false }, 
  CorreoElectronicoCliente : { type: String, require: false }, 
  PrecioFinal : { type: String, require: false }, 
  Referencia : { type: String, default: "" },
  InputsFile: [{
    Nombre : { type: String, require: false },
    Campo : { type: String, require: false },
    Tipo : { type: String, require: false },
    Opcional : { type: String, require: false },
    Pagina : { type: Number, require: false },
    TituloPagina : { type: String, require: false },
    valor : { type: Array, require: false },
  }],
  Inputs: [{
        Campo : { type: String, require: false },
        Valor : { type: String, require: false },
        Tipo : { type: String, require: false },
        Opcional : { type: String, require: false },
        Nombre : { type: String, require: false },
        Orden : { type: String},
        Pagina : { type: Number, require: false },
        TituloPagina : { type: String, require: false },
  }],
});

module.exports = mongoose.model("resultados", resultados);
