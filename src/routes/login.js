const passport = require("passport");

const router = require("express").Router();

router.get("/", async (req, res) => {
    res.redirect("/iniciar-sesion");
});

router.get("/iniciar-sesion", async (req, res) => {
    res.render("login/sign-in", {
        layout: "sign-in",
    });
});

router.post("/sign-in", (req, res, next) =>{
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            req.flash('error','Error en los datos ingresados.Vuelva a intentar')
            res.redirect('/iniciar-sesion')
            return
        }
        if (!user) {
            req.flash('error','Error en los datos ingresados.Vuelva a intentar')
            res.redirect('/iniciar-sesion')
            return
        }
        req.logIn(user, function(err) {
            if (err) {
                req.flash('error','Error en los datos ingresados.Vuelva a intentar')
                res.redirect('/iniciar-sesion')
                return
            }
            res.redirect('/home')
        });
    })(req, res, next);
})

module.exports = router;
