    const d = document,
        $Titulo = d.getElementById("Titulo"),
        $TituloPagina = d.getElementById('TituloPagina'),
        $Descripcion = d.getElementById('Descripcion'),
        $Nombre = d.getElementById('Nombre'),
        $Tipo = d.getElementById('Tipo'),
        $Opcional = d.getElementById('Opcional'),
        $Pagina = d.getElementById('Pagina'),
        $Espacio = d.getElementById('Espacio'),
        $tbody = d.getElementById('tbody'),
        $insertarPaginas = d.getElementById('insertarPaginas'),
        $btnCrearPagina = d.getElementById('btnCrearPagina'),
        $btnRegistrar = d.getElementById('btnRegistrar'),
        $TiempoEstimado = d.getElementById('TiempoEstimado'),
        $Precio = d.getElementById('Precio'),
        $btnAgregar = d.getElementById('btnAgregar');
        
    let campos = []
    let paginasRegistradas = []
    let Pagina = {}
    let Paginas = []
    let Inputs = []

    $btnAgregar.onclick = () =>{
        if($Nombre.value == '' || $Tipo.value == 0 || $Opcional.value == 0 || $Espacio.value == 0 || $Pagina.value == '' || $TiempoEstimado.value == 0 || $Precio.value == "" || $Precio.value <=0 ||  $Pagina.value <= 0){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Todos los campos son obligatorios',
            })
            return
        }
        let validacion = campos.find((data) => data.Nombre == $Nombre.value)
        if(validacion){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El nombre del campo ya existe',
            })
        }else{
            let subdata = {
                Nombre : $Nombre.value,
                Tipo : $Tipo.value,
                Opcional : $Opcional.value,
                Espacio : $Espacio.value
            }
            campos.push(subdata)
            let tr = `
                <tr>
                    <td>${$Nombre.value}</td>
                    <td>${$Tipo.value}</td>
                    <td>${$Opcional.value}</td>
                    <td>${$Espacio.value}</td>
                    <td><button class="btn btn-outline-danger">Eliminar</button></td>
                </tr>
            `;

            $Nombre.value = ''
            $Tipo.value = 0
            $Opcional.value = 0
            $Espacio.value = 0

            $tbody.insertAdjacentHTML('beforeend', tr)
        }
    }


    d.addEventListener('click', e=>{
        if(e.target.textContent == "Eliminar"){
            let linea = e.target.parentElement.parentElement
            $tbody.removeChild(linea)            
            campos = campos.filter((data) => data.Nombre != linea.children[0].textContent)
        }
        if(e.target == $btnCrearPagina){
            if($TituloPagina.value == ''){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'El titulo de la página es obligatorio',
                })
                return
            }
            if(campos.length == 0){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debe agregar al menos un campo a la lista',
                })
                return
            }
            let validacionPagina = paginasRegistradas.find((data) => data == $Pagina.value)

            Pagina.TituloPagina = $TituloPagina.value
            Pagina.Pagina = $Pagina.value
            Pagina.Descripcion = $Descripcion.value

            if(validacionPagina){
                Swal.fire({
                    icon: "warning",
                    title: "La pagina ya existe. ¿Desea reemplazarla?",
                    showDenyButton: true,
                    confirmButtonText: `Si`,
                    denyButtonText: `No`,
                }).then((result) => {
                    if(result.isConfirmed){
                        let data = {
                            TituloPagina: $TituloPagina.value,
                            Descripcion: $Descripcion.value,
                            Campos: campos
                        }

                        let cols = ""
                        for(i=0; i< campos.length; i++){
                            let col = ""
                            let subdataInputs = {
                                Nombre: campos[i].Nombre,
                                Tipo: campos[i].Tipo,
                                Opcional: campos[i].Opcional,
                                Espacio: campos[i].Espacio
                            }
                            Inputs.push(subdataInputs)

                            if(campos[i].Espacio == "1 Columna"){
                                col = "col-sm-12"
                            }else if(campos[i].Espacio == "2 Columnas"){
                                col = "col-sm-6"
                            }else if(campos[i].Espacio == "3 Columnas"){
                                col = "col-sm-4"
                            }else if(campos[i].Espacio == "4 Columnas"){
                                col = "col-sm-3"
                            }
                            let required = "required"
                            if(campos[i].Opcional == "Opcional"){
                                required = ""
                            }
                            let input = ""
                            
                            if(campos[i].Tipo == "file"){
                                input = `
                                <div class="mb-3">
                                    <label for="${campos[i].Nombre}">${campos[i].Nombre}</label>
                                    <input type="file" class="form-control" name="${campos[i].Nombre}" ${required}>
                                </div>
                                `
                            }
                            else if (campos[i].Tipo == "checkbox"){
                                input = `
                                <div class="mb-3 border shadow p-3 mb-5 bg-white rounded">
                                    <div class="form-check ">
                                        <input class="form-check-input big-checkbox" type="checkbox"  value="" ${required} id="${campos[i].Nombre}" >
                                        <label class="form-check-label ml-3" for="${campos[i].Nombre}">
                                            ${campos[i].Nombre}
                                        </label>
                                    </div>
                                </div>
                                `
                            }
                            else if (campos[i].Tipo == "textarea"){
                                input = `
                                    <div class="mb-3">
                                        <label for="${campos[i].Nombre}">${campos[i].Nombre}</label>
                                        <textarea class="form-control" name="${campos[i].Nombre}" ${required} cols="30" rows="10" placeholder="${campos[i].Nombre}:"></textarea>
                                    </div>
                                `
                            }else {
                                input = `
                                    <div class="mb-3">
                                        <label for="${campos[i].Nombre}">${campos[i].Nombre}</label>
                                        <input type="${campos[i].Tipo}" ${required} class="form-control" id="${campos[i].Nombre}" name="${campos[i].Nombre}" placeholder="${campos[i].Nombre}:">
                                    </div>
                                `
                            }
                            
                            cols += `
                                <div class="${col}">
                                    ${input}
                                </div>
                            `
                        }
                        d.getElementById(`Pagina${$Pagina.value}`).innerHTML = `
                            <div class="card-header">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <h4>${data.TituloPagina}</h4>
                                    </div>
                                    <div class="col-sm-6 text-right">
                                        Página ${$Pagina.value}
                                    </div>
                                    <div class="col-sm-12">
                                        ${data.Descripcion}
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    ${cols}
                                </div>
                            </div>
                        `
                        paginasRegistradas.push($Pagina.value)
                        $TituloPagina.value = ''
                        $Descripcion.value = ''
                        $tbody.innerHTML = ''
                        $Pagina.value = parseInt($Pagina.value) + 1
                        campos = []

                        Pagina.Inputs = Inputs
                        Paginas.push(Pagina)
                        Pagina = {}
                        Inputs = []
                        Swal.fire('Pagina reemplazada', '', 'success')
                    }
                })
            }else{
                let data = {
                    TituloPagina: $TituloPagina.value,
                    Descripcion: $Descripcion.value,
                    Campos: campos
                }

                let cols = ""

                for(i=0; i< campos.length; i++){
                    let col = ""
                    let subdataInputs = {
                        Nombre: campos[i].Nombre,
                        Tipo: campos[i].Tipo,
                        Opcional: campos[i].Opcional,
                        Espacio: campos[i].Espacio
                    }
                    Inputs.push(subdataInputs)

                    if(campos[i].Espacio == "1 Columna"){
                        col = "col-sm-12"
                    }else if(campos[i].Espacio == "2 Columnas"){
                        col = "col-sm-6"
                    }else if(campos[i].Espacio == "3 Columnas"){
                        col = "col-sm-4"
                    }else if(campos[i].Espacio == "4 Columnas"){
                        col = "col-sm-3"
                    }
                    let required = "required"
                    if(campos[i].Opcional == "Opcional"){
                        required = ""
                    }
                    let input = ""
                    
                    if(campos[i].Tipo == "file"){
                        input = `
                        <div class="mb-3">
                            <label for="${campos[i].Nombre}">${campos[i].Nombre}</label>
                            <input type="file" class="form-control" name="${campos[i].Nombre}" ${required}>
                        </div>
                        `
                    }
                    else if (campos[i].Tipo == "checkbox"){
                        input = `
                        <div class="mb-3 border shadow p-3 mb-5 bg-white rounded">
                            <div class="form-check ">
                                <input class="form-check-input big-checkbox" type="checkbox"  value="" ${required} id="${campos[i].Nombre}" >
                                <label class="form-check-label ml-3" for="${campos[i].Nombre}">
                                    ${campos[i].Nombre}
                                </label>
                            </div>
                        </div>
                        `
                    }
                    else if (campos[i].Tipo == "textarea"){
                        input = `
                            <div class="mb-3">
                                <label for="${campos[i].Nombre}">${campos[i].Nombre}</label>
                                <textarea class="form-control" name="${campos[i].Nombre}" ${required} cols="30" rows="10" placeholder="${campos[i].Nombre}:"></textarea>
                            </div>
                        `
                    }else {
                        input = `
                            <div class="mb-3">
                                <label for="${campos[i].Nombre}">${campos[i].Nombre}</label>
                                <input type="${campos[i].Tipo}" ${required} class="form-control" id="${campos[i].Nombre}" name="${campos[i].Nombre}" placeholder="${campos[i].Nombre}:">
                            </div>
                        `
                    }
                    
                    cols += `
                        <div class="${col}">
                            ${input}
                        </div>
                    `
                }

                let card = `
                    <div class="card bg-secondary" id="Pagina${$Pagina.value}">
                        <div class="card-header">
                            <div class="row">
                                <div class="col-sm-6">
                                    <h4>${data.TituloPagina}</h4>
                                </div>
                                <div class="col-sm-6 text-right">
                                    Página ${$Pagina.value}
                                </div>
                                <div class="col-sm-12">
                                    ${data.Descripcion}
                                </div>
                            </div>
                            <div class="row mt-2">
                                ${cols}
                            </div>
                        </div>
                    </div>
                `;
                $insertarPaginas.insertAdjacentHTML('beforeend', card)
                paginasRegistradas.push($Pagina.value)
                $TituloPagina.value = ''
                $Descripcion.value = ''
                $tbody.innerHTML = ''
                $Pagina.value = parseInt($Pagina.value) + 1
                campos = []

        
                Pagina.Inputs = Inputs
                Paginas.push(Pagina)
                Pagina = {}
                Inputs = []
                Swal.fire('Pagina registrada', '', 'success')
            }

        }
        if(e.target == $btnRegistrar){
            Swal.fire({
                title: '¿Estas seguro de registrar el formulario?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, registrar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    let data = {
                        TiempoEstimado: $TiempoEstimado.value,
                        Precio: $Precio.value,
                        Titulo: $Titulo.value,
                        Paginas: Paginas
                    }
                    fetch('/api/registrar-formulario',{
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then((data) =>{
                        if(data.ok){
                            Swal.fire('Formulario registrado', '', 'success')
                            $Titulo.value = ''
                            $tbody.innerHTML = ''
                            $Pagina.value = 1
                            campos = []
                            Paginas = []
                            paginasRegistradas = []
                            Pagina = {}
                            Paginas = []
                            Inputs = []
                            $insertarPaginas.innerHTML = ''
                        }else{
                            Swal.fire('Error al registrar el formulario', '', 'error')
                        }
                    })
                }
            })
        }
    })
