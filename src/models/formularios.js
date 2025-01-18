const mongoose = require("mongoose");
const { Schema } = mongoose;


const formularios = new Schema({
  Titulo: { type: String, require: true },
  FechaCreacion: { type: String, require: true },
  Usuario: { type: String, require: true },
  UltimaModificacion: { type: String, require: true },
  PaginasTotales: { type: Number, require: true },
  TiempoEstimado: {type: String, require: true},
  Precio: { type: Number, require: true },
  Estado : { type: String, default:"Activo" },
  Paginas : [{
    TituloPagina: { type: String, require: true },
    Pagina : { type: Number, require: true },
    Descripcion: { type: String, require: true },
    PrecioAdicional : { type: Number, default: 0 },
    RespuestasValidas : { type: Number},
    Inputs : [{
        Nombre : { type: String, require: true },
        Tipo : { type: String, require: true },
        Opcional : { type: String, require: true },
        Espacio : { type: String, require: true },
    }],
    Configuracion : [{
      _idCampo : { type: String, require: true },
      Campo : { type: String, require: true },
      NumeroPaginas : { type: Number, require: true },
      Accion: {type:String,require: true},
    }],
    Precios : [{
      _idCampo : { type: String, require: true },
      Campo  : { type: String, require: true },
      Accion : {type:String, require: true},
      Precio : {type:Number, require: true},
    }]
  }],
  ValidacionPrecios : [{
    _idCampo : { type: String, require: true },
    _idPagina : { type: String, require: true },
    Precio : { type: Number, require: true },
    Accion: {type:String,require: true},
    IgnorarBase: {type:Boolean,require: true},
    MultiplicarBase: {type:Boolean,require: true}
  }]
  
});

module.exports = mongoose.model("formularios", formularios);
