    const d = document;

    d.addEventListener('click', e=>{
        if(e.target.textContent == "Generar"){
            e.preventDefault()
            Swal.fire({
                title:'Iframe del formulario',
                html: `<textarea class="form-control" id="iframe" rows="3" readonly>
                    <iframe src="https://inmigracion.herokuapp.com/demo-formulario/${e.target.id}" 
                    frameborder="0" width="100%" height="800" scrolling="yes"></iframe>
                </textarea>`,
                showConfirmButton: false,
                showCloseButton: true,
                showCancelButton: true,
                cancelButtonText: 'Copiar',
                cancelButtonColor: '#3085d6',
                cancelButtonAriaLabel: 'Copiar'
            })
            .then(result=>{
                if(result.dismiss == "cancel"){
                    const iframe = d.getElementById('iframe')
                    iframe.select()
                    document.execCommand('copy')
                    Swal.fire({
                        title: 'Copiado',
                        text: 'El iframe se ha copiado al portapapeles',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        }
    })

