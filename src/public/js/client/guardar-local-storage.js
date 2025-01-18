const localStorage = window.localStorage
const titulo = document.getElementById('titulo')
const _idUser = titulo.dataset._iduser 

console.log(titulo)

const removeLocalStorage = (data) =>{
    for (const key of data) {
        for (const subkey of key.inputs) {
            localStorage.removeItem(subkey.key)
        }
        localStorage.removeItem(`dataPrecios${key._idForm}`)
    }
}

const saveLocalStorageDB = (data) =>{
    for (const key of data) {
        for (const subkey of key.inputs) {
            localStorage.setItem(subkey.key, JSON.stringify(subkey))
        }
    }
}

const saveLocalStoragePricesDB = (data) =>{
    for (const key of data) {
        if(key.dataPrecios){
            localStorage.setItem(`dataPrecios${key._idForm}`, JSON.stringify(key.dataPrecios))
        }
    }
}

const getSavedRequest  = () =>{

    fetch(`/obtener-solicitudes-guardadas/${_idUser}`)
    .then((data) =>{
        return data.json()
    })
    .then((data) =>{
        removeLocalStorage(data)
        saveLocalStorageDB(data)
        saveLocalStoragePricesDB(data)
    })
}

document.addEventListener('DOMContentLoaded', () =>{
    getSavedRequest()
})

