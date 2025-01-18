const d = document,
          inputRespuesta = d.getElementById('inputRespuesta'),
          btnAsignar = d.getElementById('btnAsignar'),
          btnEnviarRespuesta = d.getElementById('btnEnviarRespuesta');

const _idTicket = titulo.dataset._id
const Estado = titulo.dataset.estado

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
            tipoUsuario:'Cliente'
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
