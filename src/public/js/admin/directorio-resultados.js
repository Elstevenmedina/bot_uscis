
    const d = document;

    d.addEventListener('click', e => {
        if(e.target.matches('.btnZelle')){
            e.preventDefault();
            const id = e.target.dataset.id;
            fetch(`/api/solicitar-info-zelle/${id}`)
            .then((data) =>{
                return data.json()
            })
            .then((data) =>{
                let html = ``
                let ul = ""
                if(data.length > 0){
                    data.forEach((item) =>{
                        li1 = `<li><strong>Email: </strong>${item.email}</li>`
                        li2 = `<li><strong>Fecha: </strong>${item.date}</li>`
                        li3 = `<li><strong>Número transaccion: </strong>${item.transaction}</li>`

                        ul = `<ul>${li1}${li2}${li3}</ul>`

                    })
                }else{
                    ul = `<p>No hay información de Zelle</p>`
                }
                Swal.fire({
                    title: 'Zelle',
                    html: `${ul}`,
                    showCloseButton: true,
                    showCancelButton: false,
                    showConfirmButton: false,
                    focusConfirm: false,
                    focusCancel: false,
                })
            })
        }
        if(e.target.matches('.btnCambiar')){
            e.preventDefault();
            const estado = e.target.dataset.estado;
            const id = e.target.dataset.id;
            console.log(estado)
            if(estado == "Procesado" || estado == "Anulado"){
                Swal.fire({
                    title: 'No se puede cambiar el estado',
                    text: 'El estado del resultado ya fue cambiado',
                    icon: 'error',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Ok'
                })
            }else{
                let options = `
                <option value="0">--Seleccione un estado--</option>
                <option value="Procesado">Procesado</option>
                <option value="Anulado">Anulado</option>`

                Swal.fire({
                    title: 'Cambiar estado',
                    html: `<select class="form-control" id="estado">${options}</select> <br>
                        <label>Fecha de culminación</label>
                        <input type="date" class="form-control" id="fechaCulminacion">
                    `,
                    showCloseButton: true,
                    showCancelButton: true,
                    showConfirmButton: true,
                    focusConfirm: false,
                    focusCancel: false,
                    confirmButtonText: 'Cambiar',
                    cancelButtonText: 'Cancelar',
                    preConfirm: () => {
                        const estado = d.getElementById('estado').value;
                        const fechaCulminacion = d.getElementById('fechaCulminacion').value;
                        if(!estado || estado == "0"){
                            Swal.showValidationMessage(`Seleccione un estado`)
                        }
                        if(!fechaCulminacion || fechaCulminacion == ""){
                            Swal.showValidationMessage(`Seleccione una fecha de culminación`)
                        }
                        return {estado, fechaCulminacion}
                    }
                }).then((result) =>{
                    if(result.isConfirmed){
                        fetch(`/api/cambiar-estado-resultados/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(result.value)
                        })
                        .then((data) =>{
                            return data.json()
                        })
                        .then((data) =>{
                            if(data.ok){
                                Swal.fire({
                                    title: 'Estado cambiado',
                                    text: 'El estado del resultado fue cambiado',
                                    icon: 'success',
                                    showCancelButton: false,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Ok'
                                }).then((result) =>{
                                    if(result.isConfirmed){
                                        location.reload()
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
        if(e.target.matches('.btnDelete')){
            let _id = e.target.dataset.id;
            //asking for confirmation with swal
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, bórralo!'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`/api/resultados/${_id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then((data) =>{
                        return data.json()
                    })
                    .then((data) =>{
                        if(data.ok){
                            Swal.fire(
                                '¡Eliminado!',
                                'El resultado ha sido eliminado.',
                                'success'
                            ).then((result) =>{
                                if(result.isConfirmed){
                                    location.reload()
                                }
                            })
                        }
                    })
                }
            })
        }
    })
