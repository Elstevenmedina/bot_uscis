const d = document,
        categoria = d.getElementById('categoria'),
        subcategoria = d.getElementById('subcategoria'),
        btnAgregar = d.getElementById('btnAgregar'),
        tbody = d.getElementById('tbody'),
        titulo = d.getElementById('titulo'),
        btnEliminar = d.getElementById('btnEliminar'),
        btnRegistrar = d.getElementById('btnRegistrar');

    
const _idCategoria = titulo.dataset._id 

let subcategorias = []

const validarDatos = () =>{
    if(categoria.value === ""){
        Swal.fire({
            icon:'error',
            title:'El campo "Categoría" no puede estar vacío'
        })
        return false
    }
    if(subcategoria.value === ""){
        Swal.fire({
            icon:'error',
            title:'El campo "Subcategoría" no puede estar vacío'
        })
        return false
    }
    return true
}

const agregarTR = () =>{
    
    if(subcategorias.find((subcat) => subcat == subcategoria.value)){
        Swal.fire({
            icon:'error',
            title:'La subcategoría ya se encuentra agregada'
        })
        return false
    }

    subcategorias.push(subcategoria.value)

    let tr = `
        <tr>
            <td class="text-center">${subcategoria.value}</td>
            <td class="text-center">
                <buttton class="btn btn-sm btn-danger">-</buttton>
            </td>
        </tr>
    `
    subcategoria.value = ""

    tbody.innerHTML += tr

}

const eliminarTR = (e) =>{
    const linea = e.target.parentElement.parentElement
    subcategorias = subcategorias.filter((subcat) => subcat != linea.children[0].textContent)
    tbody.removeChild(linea)
}

const validarEnvio = () =>{
    if(categoria.value === ""){
        Swal.fire({
            icon:'error',
            title:'El campo "Categoría" no puede estar vacío'
        })
        return false
    }
    if(subcategorias.length == 0){
        Swal.fire({
            icon:'error',
            title:'Debe agregar subcategorías a la lista.'
        })
        return false
    }

    return true
}

const registrarDatos = () =>{

    const data = {
        categoria: categoria.value,
        subcategorias,
    }

    fetch(`/soporte/editar-categoria/${_idCategoria}`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    }).then((data) =>{
        return data.json()
    }).then((data) =>{
        if(data.ok){
            Swal.fire({
                icon:'success',
                title:'Categoría editada correctamente'
            }).then(() =>{
                location.reload()
            })
        }else{
            Swal.fire({
                icon:'error',
                title:data.msg
            })
        }
    })

}

const leerTabla = () =>{
    for(i=0; i< tbody.children.length; i++){
        subcategorias.push(tbody.children[i].children[0].textContent)
    }
}

d.addEventListener('DOMContentLoaded', () =>{
    leerTabla()
})


const eliminarCategoria = () =>{
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí,eliminar!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/soporte/eliminar-categoria/${_idCategoria}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((data) =>{
                return data.json()
            })
            .then((data) =>{
                if(data.ok){
                    Swal.fire(
                        '¡Eliminado!',
                        'La categoría fue eliminada correctamente.',
                        'success'
                    ).then(() =>{
                        location.href = '/categorias-soporte'
                    })
                }
            })
        }
    })
}

btnEliminar.onclick = () =>{
    eliminarCategoria()
}

btnAgregar.onclick = () =>{
    if(validarDatos()){
        agregarTR()
    }
}

btnRegistrar.onclick = ()=>{
    if(validarEnvio()){
        registrarDatos()
    }
}

d.addEventListener('click', e =>{
    if(e.target.textContent == "-" ){
        eliminarTR(e)
    }
})