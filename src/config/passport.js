const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserSchema = require("../models/users");

passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await UserSchema.findOne({ email: { $regex: new RegExp(`^${email.toLowerCase()}$`, 'i') } });;
      if (!user) {
        return done(null, false, { message: "Correo electrónico no registrado" });
      }
      if (!user.comparePassword(password)) {
        return done(null, false, { message: "Contraseña incorrecta" });
      }
      if(user.Franquicia !== "65de7d13b93a8411b449c128"){
        return done(null, false, { message: "Usuario no autorizado" });
      }
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await UserSchema.findById(id) 
  user ? done(null, user) : done(null, false);
});