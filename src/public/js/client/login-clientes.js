const d = document,
        email = d.getElementById('email'),
        password = d.getElementById('password'),
        alert = d.getElementById('alert'),
        form = d.getElementById('form');

form.addEventListener('submit', function(event) {
    const action = form.action
    event.preventDefault();

    fetch(action,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({email:email.value, password: password.value})
    }).then((data) =>{
        return data.json()
    }).then((data) =>{
        if(!data.ok){
            alert.classList.remove('d-none')
            alert.textContent = `Datos incorrectos. Por favor valide e intente de nuevo`
        }else{
            let url = `${data.url}:${data.user._id}`
            if(data.url.includes('home')){
                url = `${data.url}/${data.user._id}`
            }
            Swal.fire({
                title: "Se inicio sesión de forma correcta",
                icon: "success",
                html: `
                    <div>
                        <a href="${url}"  target="_self" class="btn btn-success btn-lg">Continuar</a>,
                    </div>
                  `,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showCloseButton: false,
                showCancelButton: false,
                showConfirmButton:false,
              });
        }
    })
});