const d = document,
        categoria = d.getElementById('categoria'),
        subcategoria = d.getElementById('subcategoria'),
        titulo = d.getElementById('titulo'),
        descripcion = d.getElementById('descripcion'),
        btnNuevoTicket = d.getElementById('btnNuevoTicket');

let categorias

const insertarCategorias = (categorias) =>{
    let options = `<option value="0">--Seleccione una categoría--</option>`

    for(i=0; i< categorias.length; i++){
        options += `<option value="${categorias[i].categoria}">${categorias[i].categoria}</option>`
    }

    categoria.innerHTML = options
} 

categoria.onchange  = () =>{
    if(categoria.value){
        const categoriaBase = categorias.find((cat) => cat.categoria == categoria.value)
        let options = `<option value="0">--Seleccione una subcategoría--</option>`
        for(i=0; i< categoriaBase.subcategorias.length; i++){
            options += `<option value="${categoriaBase.subcategorias[i]}">${categoriaBase.subcategorias[i]}</option>`
        }
        subcategoria.innerHTML = options
    }
}

const consultarCategorias = () =>{
    fetch('/consultar-categorias-soporte')
    .then((data) =>{
        return data.json()
    })
    .then((data) =>{
        categorias = data.categorias
        insertarCategorias(categorias)
    })
}

d.addEventListener('DOMContentLoaded', () =>{
    consultarCategorias()
})


const validarDatos = () =>{
    if(categoria.value == ""){
        Swal.fire({
            icon:'error',
            title:'El campo "Categoría" no puede estar vacío.'
        })
        return false
    }
    if(subcategoria.value == ""){
        Swal.fire({
            icon:'error',
            title:'El campo "Subcategoría" no puede estar vacío.'
        })
        return false
    }
    if(titulo.value == ""){
        Swal.fire({
            icon:'error',
            title:'El campo "Titulo" no puede estar vacío.'
        })
        return false
    }
    if(descripcion.value == ""){
        Swal.fire({
            icon:'error',
            title:'El campo "Descripción" no puede estar vacío.'
        })
        return false
    }
    return true
}

const registratTicket = () =>{
    btnNuevoTicket.disabled = true

    const data = {
        titulo: titulo.value,
        descripcion: descripcion.value,
        categoria: categoria.value,
        subcategoria: subcategoria.value
    }

    fetch('/nuevo-ticket-soporte',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    }).then((data) =>{
        return data.json()
    }).then((data) =>{
        Swal.fire({
            icon:'success',
            title:'Ticket registrado correctamente'
        }).then((data)=>{
            location.reload()
        })
    })
}


btnNuevoTicket.onclick = () =>{
    if(validarDatos()){
        registratTicket()
    }
}