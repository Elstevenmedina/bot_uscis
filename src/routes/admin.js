const router = require("express").Router();
const { isAuthenticated } = require("../helpers/auth");
const formularios_franquiciaDB = require("../models/formularios_franquiciado");
const clienteDB = require('../models/clients/clientes')
const resultadosDB = require("../models/resultados");

router.get("/home", isAuthenticated, async (req, res) => {
    res.render("admin/inicio");
});

router.get("/formularios-franquiciado", isAuthenticated, async (req, res, next) => {
    try {
        let _idFranquicia = req.user.Franquicia;
        let formularios = await formularios_franquiciaDB
            .find({ _idFranquiciado: _idFranquicia })
            .lean();
    
        res.render("admin/formularios/directorio-franquicias", {
            formularios,
        });
    } catch (err) {
        console.log(err);
    }
});

router.get("/editar-formulario-franquicia/:id",isAuthenticated,async (req, res, next) => {
    try {
        let formulario = await formularios_franquiciaDB
            .findById(req.params.id)
            .lean();
            formulario = {
            Titulo: formulario.Titulo,
            FechaCreacion: formulario.FechaCreacion,
            Usuario: formulario.Usuario,
            UltimaModificacion: formulario.UltimaModificacion,
            PaginasTotales: formulario.PaginasTotales,
            Estado: formulario.Estado,
            _id: formulario._id,
            Precio: formulario.Precio,
            TiempoEstimado: formulario.TiempoEstimado,
            Paginas: formulario.Paginas.map((data2) => {
                return {
                TituloPagina: data2.TituloPagina,
                Pagina: data2.Pagina,
                Descripcion: data2.Descripcion,
                _id: data2._id,
                _idFormulario: formulario._id,
                Inputs: data2.Inputs.map((data3) => {
                    let opcional = "required";
                    let checkbox = false;
                    let file = false;
                    let textarea = false;
                    let normal = false;
                    if (data3.Tipo == "checkbox") {
                        checkbox = true;
                    } else if (data3.Tipo == "file") {
                        file = true;
                    } else if (data3.Tipo == "textarea") {
                        textarea = true;
                    } else {
                        normal = true;
                    }
    
                    if (data3.Opcional == "Si") {
                        opcional = "";
                    }
    
                    if (data3.Espacio == "1 Columna") {
                        data3.Espacio = "col-sm-12";
                    } else if (data3.Espacio == "2 Columnas") {
                        data3.Espacio = "col-sm-6";
                    } else if (data3.Espacio == "3 Columnas") {
                        data3.Espacio = "col-sm-4";
                    } else if (data3.Espacio == "4 Columnas") {
                        data3.Espacio = "col-sm-3";
                    }
                    let dataReturn = {
                        Nombre: data3.Nombre,
                        Tipo: data3.Tipo,
                        Opcional: opcional,
                        Espacio: data3.Espacio,
                        checkbox: checkbox,
                        file: file,
                        textarea: textarea,
                        normal: normal,
                    };
                    return dataReturn;
                }),
                };
            }),
            };
    
            res.render("admin/formularios/editar-franquicia", {
            layout: "franquiciado.hbs",
            formulario,
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
);

router.get('/cargar-finiquitos', isAuthenticated, async (req, res, next) =>{
    try {
        const clientes = await clienteDB.find({Franquicia: req.user.Franquicia}).sort({Nombres: 1}) .lean()
        res.render('admin/clientes/documentos-finiquitos',{
            clientes
        })
    }catch(err){
        console.log(err)
    }
})

router.get('/clientes-registrados', isAuthenticated, async (req, res, next) =>{
    try {
        
        const clientes = await clienteDB.find({Franquicia: req.user.Franquicia}).sort({Nombres: 1}) .lean()
        res.render('admin/clientes/directorio-clientes',{
            clientes
        })
    }catch(err){
        console.log(err)
    }
})

router.get("/resultados-franquiciado",isAuthenticated,async (req, res, next) => {
        try {
            let franquiciaId = req.user.Franquicia;
            let resultados = await resultadosDB
            .find({
                $and: [
                    { Visualizacion: true },
                    { _idFranquicia: franquiciaId },
                    { Estado: { $ne: "Procesado" } },
                ],
            })
            .lean();
            res.render("admin/resultados/directorio-franquiciados", {
                resultados,
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
);

router.get("/resultados-franquiciado-procesados",isAuthenticated,async (req, res, next) => {
    try {
        let franquiciaId = req.user.Franquicia;
        let resultados = await resultadosDB
            .find({
                $and: [
                { Visualizacion: true },
                { _idFranquicia: franquiciaId },
                { Estado: "Procesado" },
                ],
            })
            .lean();
            res.render("admin/resultados/directorio-franquiciados-procesados", {
                resultados,
            });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;
