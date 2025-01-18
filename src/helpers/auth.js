const helpers = {};
const usersDB = require('../models/users')
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


module.exports = helpers;
