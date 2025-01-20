if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const app = express();

require("./src/database");
require("./src/config/passport");

// Configuración de Express
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "src", "views"));
app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layout"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  expressSession({
    secret: "A514SD651AS6D1",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://inmigracionbd:BgHpLkK85tdDRfF6@inmigracionforms.ifretmm.mongodb.net/?retryWrites=true&w=majority' //mongodb://localhost/bot-autollenado 
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(flash());

// Variables globales
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Rutas
app.use(require("./src/routes/login"));
app.use(require("./src/routes/admin"));

app.use(express.static(path.join(__dirname, "src", "public")));

// Iniciar servidor
const server = app.listen(app.get("port"), () => {
  console.log("Escuchando en " + app.get("port"));
});

// Exporta el servidor si necesitas integrarlo directamente con Electron
module.exports = server;
