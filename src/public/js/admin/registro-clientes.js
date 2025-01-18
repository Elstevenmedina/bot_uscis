    const d = document;

    d.addEventListener('click', e=>{
        if(e.target.textContent == "Generar"){
            e.preventDefault()
            let _id = e.target.dataset._id
            let link = "https://inmigracion.herokuapp.com/"
            let lista = ""
                let li = `
                    <div>
                        <textarea class="form-control" id="textareaprueba" rows="3"><iframe src="${link}registro-clientes/${_id}" 
                        frameborder="0" width="100%" height="800" scrolling="yes"></iframe></textarea>
                        <button class="btn btn-info text-center mt-2" data-iframe="textareaprueba">Copiar</button>
                    </div>
                `
                lista += li
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

