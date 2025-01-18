
_idForm = insertarPaginas.dataset._idformulario

const jumpPage = (page) =>{
  solicitarPagina(_idForm, page, "siguiente"); 
}

const openSwalPage = (page)=>{
    setTimeout(() => {
        Swal.fire({
            icon: 'question',
            title:'¿Continuar o empezar de nuevo?',
            text:'Nos dimos cuenta de que estabas completando nuestro formulario. ¿Continuar o empezar desde cero?',
            showCancelButton: true,
            cancelButtonText: 'Empezar de nuevo',
            confirmButtonText: "Continuar donde nos quedamos",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((data) =>{
            if(data.isConfirmed){
                jumpPage(page)
            }else{
                Swal.close()
            }
        })
      }, 2000);
}


const requestLastPage = (_idForm, _idUser) =>{
    fetch(`/request-saved-form/${_idForm}:${_idUser}`)
    .then((data) =>{
        return data.json()
    }).then((data) =>{
        if(data.ok){
            openSwalPage(data.page)
        }
    })
}

document.addEventListener('DOMContentLoaded', () =>{
    const linksParts = window.location.href.split(":")
    let _idUser = linksParts[linksParts.length - 1]
    _idUser = _idUser.replaceAll('#','')
    requestLastPage(_idForm,_idUser )
})

