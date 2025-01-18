const d = document,
        categoria = d.getElementById('categoria'),
        subcategoria = d.getElementById('subcategoria'),
        btnAgregar = d.getElementById('btnAgregar'),
        tbody = d.getElementById('tbody'),
        btnRegistrar = d.getElementById('btnRegistrar');


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

    fetch('/soporte/registrar-categorias',{
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
                title:'Categoría registrada correctamente'
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