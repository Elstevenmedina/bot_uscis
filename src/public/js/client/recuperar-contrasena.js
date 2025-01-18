
const d = document,
    email = d.getElementById('email'),
    alert = d.getElementById('alert'),
    changeView = d.getElementById('changeView'), 
    signIn = d.getElementById('signIn'), 
    btnSendCode = d.getElementById('btnSendCode');

let code 
let emailInputValue
const url = signIn.dataset.url


const passwordCheck = (clave) =>{
    const esLargaSuficiente = clave.length > 8;
    const contieneLetra = /[a-zA-Z]/.test(clave);
    const contieneNumero = /[0-9]/.test(clave);

    return esLargaSuficiente && contieneLetra && contieneNumero;
}

const changeViewPassword = () =>{
    emailInputValue = email.value
    changeView.innerHTML = `
    <div class="card-body">
        <p class="login-card-description">Recuperar contraseña.</p>
        <div class="alert alert-danger d-none" id="alert" style="background-color: #dd3c4cd2"></div>
        <p class="text-muted">Se enviará un código de 6 dígitos al correo que introduzca si este existe en nuestra base de datos de usuarios</p>
        <div class="form-group">
            <label for="email" >Correo electrónico</label>
            <input type="email" name="email" id="email" readonly value="${emailInputValue}"  class="form-control" placeholder="Correo electrónico">
        </div>
        <div class="form-group">
            <label for="password" >Contraseña</label>
            <input type="password" name="password" id="password"  class="form-control" placeholder="*******">
        </div>
        <div class="form-group">
            <label for="passwordConfirm" >Confirmar Contraseña</label>
            <input type="password" name="passwordConfirm" id="passwordConfirm"  class="form-control" placeholder="*******">
        </div>
        <input name="btnChangePassword" id="btnChangePassword" class="btn btn-block login-btn mb-4" type="button" value="Cambiar contraseña">
    </div>
    `
}

const openSwalCode = () =>{
    Swal.fire({
        icon:'question',
        title:`Ingrese el código enviado a su correo electrónico`,
        html: `
            <div>
                <label for"inputCode">Código</label>
                <input type="text" class="form-control" id="inputCode" name"inputCode" maxlength="6">
            </div>
        `,
        preConfirm : () =>{
            const codeValue = d.getElementById('inputCode').value
            if(codeValue != code){
                return Swal.showValidationMessage(`El código introducido es incorrecto, por favor valide e intente de nuevo`)
            }
            return {
                codeValue
            }
        }
    }).then((data) =>{
        if(data.isConfirmed){
            Swal.close()
            changeViewPassword()
        }
    })
} 

const sendCode = (email) =>{
    fetch('/client/send-code', {
        method: 'POST',
        headers:{
            'Content-type':'application/json'
        },
        body: JSON.stringify({email})
    })
    .then((data) =>{
        return data.json()
    })
    .then((data) =>{
        if(data.success){
            code = data.code
            openSwalCode()
        }else{
            Swal.fire({
                icon:'error',
                title:'Error al enviar código',
                text:`${data.msg}`
            }).then((data) =>{
                btnSendCode.disabled = true
            })
        }
    })
}


btnSendCode.onclick = () =>{
    if(email.value == ""){
        alert.classList.remove('d-none')
        alert.textContent = 'El campo "correo electrónico" no puede estar vació.'
        return 
    }
    alert.classList.add('d-none')

    btnSendCode.disabled = true

    sendCode(email.value)

}

const changePassword = ({email, password}) =>{
    Swal.fire({
        title:'Espere...',
        text:'Cambiando contraseña',
        showLoaderOnConfirm: true,
    })
    
    fetch('/change-password',{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({email, password})
    }).then((data) =>{
        return data.json()
    }).then((data) =>{
        Swal.fire({
            icon:'success',
            title:'Contraseña actualizada',
            showConfirmButton: true,
            confirmButtonText:'Continuar',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCloseButton: false,
            showCancelButton: false,
        }).then((data) =>{
            console.log('back')
            history.back()
        })
    })
}

d.addEventListener('click', e=>{
    if(e.target == d.getElementById('btnChangePassword')){
        if(passwordCheck(d.getElementById('password').value)){
            if(d.getElementById('password').value != d.getElementById('passwordConfirm').value){
                d.getElementById('alert').classList.remove('d-none')
                d.getElementById('alert').textContent = 'Las contraseñas no coinciden. Valide e intente nuevamente'
                return
            }

            d.getElementById('alert').classList.add('d-none')
            changePassword({
                email:emailInputValue,
                password:d.getElementById('password').value 
            })

        }else{
            d.getElementById('alert').classList.remove('d-none')
            d.getElementById('alert').textContent = 'La contraseña debe tener 8 dígitos o más, una letra y un número'
        }

    }
})