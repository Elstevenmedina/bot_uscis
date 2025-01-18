const d = document,
          btnCambiarEstado = d.getElementById('btnCambiarEstado'),
          inputRespuesta = d.getElementById('inputRespuesta'),
          inputUsuario = d.getElementById('usuario'),
          btnAsignar = d.getElementById('btnAsignar'),
          titulo = d.getElementById('titulo'),
          btnEnviarRespuesta = d.getElementById('btnEnviarRespuesta');

const _idTicket = titulo.dataset._id
const Estado = titulo.dataset.estado

btnAsignar.onclick = () =>{

    if(inputUsuario.value == 0){
        Swal.fire({
            icon:'error',
            title:'Debe seleccionar un usuario'
        })
        return
    }

    fetch('/asignar-usuario-ticket',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({usuario:inputUsuario.value, _idTicket:_idTicket})
    }).then((data) =>{
        return data.json()
    }).then((data) =>{
        Swal.fire({
            icon:'success',
            title:'Usuario asignado'
        })
        inputUsuario.disabled = true
    })
}

btnEnviarRespuesta.onclick = () =>{

    if(inputRespuesta.value == ""){
        Swal.fire({
            icon:'error',
            title:'Debe introducir una respuesta'
        })
        return
    }
    fetch('/registrar-respuesta-ticket',{
        method:'POST',
        body:JSON.stringify({
            respuesta:inputRespuesta.value,
            _idTicket:_idTicket,
            tipoUsuario:'Soporte'
        }),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then((data) =>{
        return data.json()
    }).then((data) =>{
        Swal.fire({
            icon:'success',
            title:'Respuesta enviada correctamente'
        }).then((data) =>{
            location.reload()
        })
    })
}

btnCambiarEstado.onclick = () =>{
    const estados = ["Nuevo", "Asignado", "En proceso", "Resuelto", "Cerrado", "Reabierto"]

    let options= `<option value="0">--Seleccione un estado--</option>`

    for (const estado of estados) {
        options += `<option value="${estado}">${estado}</option>`
    }

    Swal.fire({
        icon:'question',
        title:'Seleccione un nuevo estado',
        html:`
            <div>
                <label for="nuevoEstado">Estado</label>
                <select class="form-control" id="nuevoEstado" name"nuevoEstado">
                    ${options}
                </select>
            </div>
        `,
        showCancelButton:true,
        confirmButtonText:'Guardar',
        preConfirm: () =>{
            const nuevoEstado = d.getElementById('nuevoEstado').value
            if(nuevoEstado == 0){
                Swal.showValidationMessage('Debe seleccionar un estado')
                return
            }
            return { nuevoEstado}
        }
    }).then((result) =>{
        if(result.isConfirmed){
            console.log(result)
            fetch(`/cambiar-estado/${_idTicket}`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({nuevoEstado: result.value.nuevoEstado})
            })
            .then((data) =>{
                return data.json()
            }).then((data) =>{
                if(data.ok){
                    Swal.fire({
                        icon:'success',
                        title:'Ticket actualizado correctamente'
                    }).then((data) =>{
                        location.reload()
                    })
                }
            })
        }
    })
}