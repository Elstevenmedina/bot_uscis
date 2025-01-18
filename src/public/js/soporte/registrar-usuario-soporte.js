const d = document 
      Nombres = d.getElementById('Nombres'),
      Apellidos = d.getElementById('Apellidos'),
      email = d.getElementById('email'),
      emailConfirm = d.getElementById('emailConfirm'),
      password = d.getElementById('password'),
      passwordConfirm = d.getElementById('passwordConfirm'),
      btnRegistrar = d.getElementById('btnRegistrar');


const validationInputs = () =>{
    if(Nombres.value === ""){
        Swal.fire({
            icon: 'error',
            text:'Error al registrar',
            text:'El campo "Nombres" no puede estar vacío.'
        })
        return false
    }
    if(Apellidos.value === ""){
        Swal.fire({
            icon: 'error',
            text:'Error al registrar',
            text:'El campo "Apellidos" no puede estar vacío.'
        })
        return false
    }
    if(email.value === ""){
        Swal.fire({
            icon: 'error',
            text:'Error al registrar',
            text:'El campo "Correo electrónico" no puede estar vacío.'
        })
        return false
    }
    if(emailConfirm.value === ""){
        Swal.fire({
            icon: 'error',
            text:'Error al registrar',
            text:'El campo "Confirmar correo electrónico" no puede estar vacío.'
        })
        return false
    }
    if(password.value === ""){
        Swal.fire({
            icon: 'error',
            text:'Error al registrar',
            text:'El campo "Contraseña" no puede estar vacío.'
        })
    }
    if(passwordConfirm.value === ""){
        Swal.fire({
            icon: 'error',
            text:'Error al registrar',
            text:'El campo "Confirmar contraseña" no puede estar vacío.'
        })
        return false
    }
    if(passwordConfirm.value.length < 7){
        Swal.fire({
            icon: 'error',
            text:'Error al registrar',
            text:'La contraseña debe tener mínimo 7 caracteres.'
        })
        return false
    }
    if(passwordConfirm.value !== password.value){
        Swal.fire({
            icon: 'error',
            text:'Error al registrar',
            text:'Las contraseñas introducidas no coinciden, valide e intente de nuevo.'
        })
        return false
        
    }
    if(email.value !== emailConfirm.value){
        Swal.fire({
            icon: 'error',
            text:'Error al registrar',
            text:'Las correos electrónicos introducidas no coinciden, valide e intente de nuevo.'
        })
        return false
    }

    return true
}


const sendData = () =>{
    
    Swal.showLoading() 


    const data = {
        Nombres :  Nombres.value,
        Apellidos :  Apellidos.value,
        email :  email.value,
        password :  password.value,
    } 

    fetch('/registrar-usuario-soporte',{
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    }).then((data) =>{
        return data.json()
    }).then((data) =>{
        Swal.hideLoading()
        if(data.ok){
            Swal.fire({
                icon:'success',
                title:'Usuario creado correctamente'
            })
            .then((data) =>{
                location.reload()
            })
        }else{
            Swal.fire({
                icon:'error',
                title:'Error al registrar',
                text:data.msg
            })
        }
    })

}

btnRegistrar.onclick = () =>{
    if(validationInputs()){
        sendData()
    }
}
