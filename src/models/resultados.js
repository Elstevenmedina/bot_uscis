const mongoose = require("mongoose");
const { Schema } = mongoose;

const resultados = new Schema({
  Titulo: { type: String, require: true },
  Fecha: { type: String, require: true },
  FechaCulminacion: { type: String },
  _idFormulario : { type: String, require: true },
  Franquicia: { type: String, require: true },
  _idFranquicia: { type: String, require: true },
  TimeStamp : { type: String, require: true },
  Estado: { type: String, default:"Pendiente" },
  Visualizacion: { type: Boolean, default:true },
  OrdenActualizado : { type: Boolean, default: false },
  MetodoPago : { type: String, require: true },
  _idUserCliente : { type: String, require: true }, 
  NombresCliente : { type: String, require: true }, 
  ApellidosCliente : { type: String, require: true }, 
  NumeroTelefonicoCliente : { type: String, require: true }, 
  CorreoElectronicoCliente : { type: String, require: true }, 
  PrecioFinal : { type: String, require: true }, 
  Referencia : { type: String, default: "" },
  //paypal: [{
  //  button_version: { type: String },
  //  intent: { type: String },
  //  orderID: { type: String },
  //  payerID: { type: String },
  //  paymentID: { type: String },
  //  paymentToken: { type: String },
  //  returnUrl: { type: String },
  //}],
  InputsFile: [{
    Nombre : { type: String, require: true },
    Campo : { type: String, require: true },
    Tipo : { type: String, require: true },
    Opcional : { type: String, require: true },
    Pagina : { type: Number, require: true },
    TituloPagina : { type: String, require: true },
    valor : { type: Array, require: true },
  }],
  Inputs: [{
        Campo : { type: String, require: true },
        Valor : { type: String, require: true },
        Tipo : { type: String, require: true },
        Opcional : { type: String, require: true },
        Nombre : { type: String, require: true },
        Orden : { type: String},
        Pagina : { type: Number, require: true },
        TituloPagina : { type: String, require: true },
    }],
    Zelle: [{
      email : { type: String},
      date : { type: String},
      transaction : { type: String},
      PrecioFinal : { type: String},
    }]
});

module.exports = mongoose.model("resultados", resultados);
