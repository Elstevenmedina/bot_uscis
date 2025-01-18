    const d = document;

    d.addEventListener('click', e=>{
        if(e.target.textContent == "Generar"){
            e.preventDefault()
            let _id =  e.target.id
            fetch(`/api/solicitar-formularios-franquicia/${_id}`)
            .then((data) =>{
                return data.json()
            })
            .then((data) =>{
                let lista = ""
                for(i=0; i< data.formularios.length; i++){
                    let formulario = data.formularios[i]
                    let iframe = `
                        <iframe src="https://inmigracion.herokuapp.com/formulario-externo/${formulario._id}:${e.target.id}" 
                        frameborder="0" width="100%" height="800" scrolling="yes"></iframe>
                    `
                    let li = `
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="flush-headingOne">
                            <button class="btn btn-primary collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-${formulario._id}" aria-expanded="false" aria-controls="flush-${formulario._id}">
                                ${formulario.Titulo}
                            </button>
                            </h2>
                            <div id="flush-${formulario._id}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                            <div class="accordion-body">
                                <textarea class="form-control" id="textarea${formulario._id}" rows="3">${iframe}</textarea>
                                <button class="btn btn-info text-center mt-2" data-iframe="textarea${formulario._id}">Copiar</button>
                            </div>
                            </div>
                        </div>
                    `
                    lista += li
                }
                let accordion = `
                    <div class="accordion accordion-flush" id="accordionFlushExample">
                        ${lista}
                    </div>
                `

                Swal.fire({
                    title:'Seleccione el formulario',
                    html: accordion,
                    showConfirmButton: false,
                    showCloseButton: true,
                    showCancelButton: false,
                    focusConfirm: false,
                    focusCancel: false,
                    allowOutsideClick: true,
                    stopKeydownPropagation: false,
                })

            })
        }
        if(e.target.textContent == "Copiar"){
            let textarea = d.getElementById(e.target.dataset.iframe)
            textarea.select()
            textarea.setSelectionRange(0, 99999)
            document.execCommand("copy")
            Swal.fire({
                title: 'Copiado',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            })
        }
    })

