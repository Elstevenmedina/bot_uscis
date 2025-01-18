
const Nombres = document.getElementById('Nombres'), 
      Apellidos = document.getElementById('Apellidos') ,
      Direccion = document.getElementById('Direccion') ,
      NumeroContacto = document.getElementById('phone') ,
      CorreoElectronico = document.getElementById('CorreoElectronico') ,
      ConfirmarCorreoElectronico = document.getElementById('ConfirmarCorreoElectronico') ,
      clave = document.getElementById('clave') ,
      btnRegistrar = document.getElementById('btnRegistrar'),
      alert = document.getElementById('alertas'),
      titulo  = document.getElementById('titulo'),
      confirmarClave = document.getElementById('confirmarClave');


const validarEmail = (email) =>{
    const regex = /^[a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z0-9.-]+$/;
    return regex.test(email);
}

const evaluarClave = (clave) =>{
    const esLargaSuficiente = clave.length > 8;
    const contieneLetra = /[a-zA-Z]/.test(clave);
    const contieneNumero = /[0-9]/.test(clave);

    return esLargaSuficiente && contieneLetra && contieneNumero;
}

const validarDatos = () =>{
    if(Nombres.value === ""){
        alert.classList.remove('d-none')
        alert.textContent = 'El campo "Nombres" no puede estar vacío .'
        return false
    }
    if(Apellidos.value === ""){
        alert.classList.remove('d-none')
        alert.textContent = 'El campo "Apellidos" no puede estar vacío .'
        return false
    }
    if(Direccion.value === ""){
        alert.classList.remove('d-none')
        alert.textContent = 'El campo "Dirección" no puede estar vacío .'
        return false
    }
    if(phoneInput.getNumber() === ""){
        alert.classList.remove('d-none')
        alert.textContent = 'El campo "Número de contacto" no puede estar vacío .'
        return false
    }
    if(CorreoElectronico.value === ""){
        alert.classList.remove('d-none')
        alert.textContent = 'El campo "Correo electrónico" no puede estar vacío .'
        return false
    }
    if(ConfirmarCorreoElectronico.value === ""){
        alert.classList.remove('d-none')
        alert.textContent = 'El campo "Confirmar Correo electrónico" no puede estar vacío .'
        return false
    }
    if(clave.value === ""){
        alert.classList.remove('d-none')
        alert.textContent = 'El campo "Contraseña" no puede estar vacío .'
    }
    if(confirmarClave.value === ""){
        alert.classList.remove('d-none')
        alert.textContent = 'El campo "Confirmar contraseña" no puede estar vacío .'
        return false
    }
    if(!validarEmail(CorreoElectronico.value)){
        alert.classList.remove('d-none')
        alert.textContent = 'Debe introducir un correo con el formato correcto.'
        return false
    }
    if(ConfirmarCorreoElectronico.value != CorreoElectronico.value){
        alert.classList.remove('d-none')
        alert.textContent = 'Los correos no coinciden. Valide e intente de nuevo'
        return false
    }
    if(clave.value != confirmarClave.value){
        alert.classList.remove('d-none')
        alert.textContent = 'Las contraseñas no coinciden. Valide e intente de nuevo'
        return false
    }
    if(!evaluarClave(clave.value)){
        alert.classList.remove('d-none')
        alert.textContent = 'La contraseña debe tener 8 dígitos o más, una letra y un número'
        return false
    }
    alert.classList.add('d-none')
    return true
}


const enviarRegistro = (data) =>{
    Swal.fire({
        title: 'Registrando datos',
        html: 'Por favor espere...', 
        allowOutsideClick: false,
        showConfirmButton: false,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
    });
    fetch('/nuevo-cliente', {
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body: JSON.stringify(data)
    }).then((data) =>{
        return data.json()
    }).then((data) =>{
        const urlBack = titulo.dataset.urlback
        if(data.ok){
            Swal.fire({
                title: "¡Ya estas registrado!",
                icon: "success",
                html: `
                    <div>
                        <a href="${urlBack}" target="_self" class="btn btn-success btn-lg">Iniciar sesión</a>,
                    </div>
                  `,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showCloseButton: false,
                showCancelButton: false,
                showConfirmButton:false,
              });
        }else{
            Swal.fire({
                icon:'error',
                title:data.msgError,
            })
        }
    })
}

const registrarDatos = () =>{
    if(validarDatos()){
        let dataRegistro = {
            Nombres: Nombres.value, 
            Apellidos: Apellidos.value, 
            Direccion: Direccion.value, 
            NumeroContacto: phoneInput.getNumber(), 
            CorreoElectronico: CorreoElectronico.value, 
            ConfirmarCorreoElectronico: ConfirmarCorreoElectronico.value, 
            clave: clave.value, 
            confirmarClave: confirmarClave.value, 
            url: window.location.href
        }
        enviarRegistro(dataRegistro)
    }
}


document.addEventListener('click', e=>{
    if(e.target == btnRegistrar){
        registrarDatos()
    }
})