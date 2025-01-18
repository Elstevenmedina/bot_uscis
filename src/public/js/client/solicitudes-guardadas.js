const d =  document
const localStorage = window.localStorage;
const forms = []

const getFormsLocalStorage = () => {
    for (i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if ((key != "__paypal_storage__" || key != "debug") && key.length == 24) {
          let value = localStorage.getItem(key);
          let valor = JSON.parse(value);
    
          let subdata = {
            _idForm: valor._idFormulario,
            page: valor.pagina,
          };
          forms.push(subdata);
        }
    }

    console.log(forms)

}


getFormsLocalStorage()
