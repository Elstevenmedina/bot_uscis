const mongoose = require("mongoose");
const { Schema } = mongoose;

const soporte = new Schema({
  Numero: { type: Number, require: true },
  Titulo: { type: String, require: true },
  Descripcion: { type: String, require: true },
  Franquicia: { type: String, require: true },
  _idFranquicia: { type: String, require: true },
  Usuario: { type: String, require: true },
  _idUsuario: { type: String, require: true },
  Estado: { type: String, require: true }, // Nuevo, Asignado, En proceso, Resuelto, cerrado, Reabierto
  EstadoGeneral: { type: String, require: true },
  UsuarioSoporte: { type: String, default:"Sin asignar" },
  _idUsuarioSoporte: { type: String, default:"" },
  Categoria: { type: String, require: true },
  Subcategoria: { type: String, require: true },
  Fecha: { type: String, require: true },
  FechaFormatoDos: { type: String, require: true },
  Respuestas: [{
    Fecha: { type: String, require: true },
    Comentario: { type: String, require: true },
    Usuario: { type: String, require: true },
    TipoUsuario: { type: String, require: true },
  }]
});


module.exports = mongoose.model("soporte", soporte);
