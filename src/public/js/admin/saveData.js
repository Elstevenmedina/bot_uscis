let _Idusuario = false

document.addEventListener('DOMContentLoaded', () =>{
    const linksParts = window.location.href.split(":")
    _Idusuario = linksParts[linksParts.length - 1]
})


const saveData = (data, dataPrecios) =>{
    fetch(`/save-data-form/${_Idusuario}`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({data, dataPrecios})
    })
}