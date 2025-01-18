const helpers = {};
const usersDB = require('../models/users')
const authenticatedClientDB = require('../models/autentificacionesClientes')
//ingresa al inicio de facturacion
helpers.isAuthenticated = (req, res, next) => {
  
  if (req.isAuthenticated() ) {
    
      return next();
  }
  req.flash("error", "Sesión finalizada.");
  res.redirect("/iniciar-sesion");
};


helpers.isAuthenticatedAdmin = (req, res, next) => {
  
  if (req.isAuthenticated() && req.user.TipoUsuario == "Administrador" ) {
    
      return next();
  }
  req.flash("error", "Sesión finalizada.");
  res.redirect("/iniciar-sesion");
};


helpers.isAuthenticatedFranquicia = (req, res, next) => {
  
  if (req.isAuthenticated() && req.user.TipoUsuario == "Franquiciado") {
      return next();
  }
  req.flash("error", "Sesión finalizada.");
  res.redirect("/iniciar-sesion");
};

helpers.isAuthenticatedSoporte = (req, res, next) => {
  
  if (req.isAuthenticated() && req.user.TipoUsuario == "Soporte") {
      return next();
  }
  req.flash("error", "Sesión finalizada.");
  res.redirect("/iniciar-sesion");
};

helpers.isAuthenticatedClient = (req, res, next) => {
  const url = req.originalUrl
  let parts = url.split(':') 
  const user = parts[parts.length - 1 ] 
  if(authenticatedClientDB.findOne({_idUser: user})){
    return next()
  }
    

};

module.exports = helpers;
