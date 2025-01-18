const router = require("express").Router();
const { isAuthenticated } = require("../helpers/auth");
const formularios_franquiciaDB = require("../models/formularios_franquiciado");
const clienteDB = require('../models/clients/clientes')
const resultadosDB = require("../models/resultados");
const formulariosDB = require("../models/formularios");
const StartLogin  = require("../bot/login");
const startTPS = require("../bot/tps/tps");

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
                    {Titulo:"TPS"},
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

router.get('/autollenar-formulario/:id', isAuthenticated, async (req, res, next) =>{
    const resultado = await resultadosDB.findById(req.params.id).lean()
    await StartLogin(startTPS, resultado._id).catch((error) => {
        console.error('Error:', error);
    });
})

router.get("/ver-informacion-resultados-franquiciado/:id",isAuthenticated,async (req, res, next) => {
    try {
        let resultado = await resultadosDB.findById(req.params.id).lean();
        console.log(resultado._idFormulario)
        let formulario = await formularios_franquiciaDB
            .findById(resultado._idFormulario)
            .lean();
        if (!formulario) {
            formulario = await formulariosDB
            .findById(resultado._idFormulario)
            .lean();
        }
        let inputsFormulario = [];
        formulario.Paginas.map((data) => {
            inputsFormulario = [...inputsFormulario, ...data.Inputs];
        });
        let orden = 1;
        if (resultado.OrdenActualizado == false) {
            for (i = 0; i < inputsFormulario.length; i++) {
                let input = inputsFormulario[i];
    
                resultado.Inputs.map((data) => {
                if (data != null && data != "null") {
                    if (data.Campo == input._id) {
                    data.Orden = orden;
                    orden++;
                    }
                }
            });
            }
        let OrdenActualizado = true;
            await resultadosDB.findByIdAndUpdate(resultado._id, {
                OrdenActualizado,
                Inputs: resultado.Inputs,
            });
        }

        resultado.Inputs = resultado.Inputs.map((data, index) => {
            if (data != null && data != "null") {
                    if (data.Valor == "true") {
                    data.Valor = "Si";
                }
                if (data.Valor == "false") {
                    data.Valor = "Si";
                }
            }
            return data;
        });
        resultado.Inputs.sort((a, b) => {
            if (a != null && b != null) {
                return b.Orden - a.Orden;
            }
        });
        resultado.Inputs = resultado.Inputs.filter((data) => {
            if (data != null) {
                return data;
            }
        });
        res.render("admin/resultados/ver", {
            _id: req.params.id,
            resultado,
            });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;
