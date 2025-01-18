    const d = document,
    $Titulo = d.getElementById('Titulo'),
    $TituloPagina = d.getElementById('TituloPagina'),
    $Pagina = d.getElementById('Pagina'),
    $Descripcion = d.getElementById('Descripcion'),
    $Nombre = d.getElementById('Nombre'),
    $Tipo = d.getElementById('Tipo'),
    $Opcional = d.getElementById('Opcional'),
    $Espacio = d.getElementById('Espacio'),
    $btnAgregar = d.getElementById('btnAgregar'),
    $btnRegistrar = d.getElementById('btnRegistrar'),
    $btnCrearPagina = d.getElementById('btnCrearPagina'),
    $TituloSeccion = d.getElementById('TituloSeccion'),
    $btnEliminar = d.getElementById('btnEliminarFormulario'),
    $insertarPaginas = d.getElementById('insertarPaginas'),
    $TiempoEstimado = d.getElementById('TiempoEstimado'),
    $Precio = d.getElementById('Precio'),
    $btnGuardarCambios = d.getElementById('btnGuardarCambios'),
    $tbody = d.getElementById("tbody");

    let campos = []
    let camposCrear = []

    let _idPagina = window.location.pathname.split('/')[2]

    $btnGuardarCambios.onclick = () =>{
        if($Titulo.value == '' || $TiempoEstimado.value == "" || $Precio.value == "" || $Precio.value <=0){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Todos los campos son obligatorios',
            })
            return
        }else{
            let dataEnvio = {
                Titulo : $Titulo.value,
                Descripcion : $Descripcion.value,
                TiempoEstimado : $TiempoEstimado.value,
                Precio : $Precio.value,
                IdFormulario : $btnGuardarCambios.getAttribute('data-_idformulario')
            }
            fetch ('/api/editar-formulario-general',{
                method: 'POST',
                body: JSON.stringify(dataEnvio),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((data) =>{
                return data.json()
            })
            .then((data) =>{
                if(data.ok){
                    Swal.fire({
                        icon: 'success',
                        title: 'Formulario editado',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(() => {
                        location.reload()
                    }, 1500);
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo editar el formulario',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        }
    }

    const actualizarOrden = (items) =>{
        fetch(`/api/actualizar-paginas/${_idPagina}`,{
            method: 'POST',
            body: JSON.stringify(items),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((data) =>{
            return data.json()
        })
        .then((data) =>{
            //send confirmation with sweetalert
            if(data.ok){
                Swal.fire({
                    icon: 'success',
                    title: 'Orden actualizado',
                    showConfirmButton: false,
                    timer: 1500
                })
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo actualizar el orden',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        })
    }


    Sortable.create($insertarPaginas, {
        animation: 150,
        chosenClass: 'seleccionado',
        //ghostClass:'fantasma',
        dragClass : 'drag',
        onEnd : () => {

        },
        group: 'list-items',
        store: {
            //guardando orden
            set : (sortable) => {
                const items = d.querySelectorAll('.item');
                let orden = [];
                items.forEach((el) => {
                    orden.push(el.getAttribute('data-id'));
                })
                Swal.fire({
                    title: 'Actualizando orden',
                    html: 'Espere un momento', // add html attribute if you want or remove
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                })
                actualizarOrden({item: orden})
            }
        }
    });


    const crearPagina = (dataEnvio) =>{
        fetch ('/api/crear-pagina',{
            method: 'POST',
            body: JSON.stringify(dataEnvio),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((data) =>{
            return data.json()
        })
        .then((data) =>{
            if(data.ok){
                Swal.fire({
                    icon: 'success',
                    title: 'Página creada',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(() => {
                    location.reload()
                }, 1500);
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo crear la página',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        })
    }

    const evaluarPrecios = (idPagina, idFormulario) =>{
        Swal.fire({
            title: 'Cargando...',
            html: 'Espere un momento', // add html attribute if you want or remove
            allowOutsideClick: false,
            showConfirmButton: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
            
        })

        fetch('/api/evaluar-precios',{
            method: 'POST',
            body: JSON.stringify({idPagina, idFormulario}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((data) =>{
            return data.json()
        })
        .then((data) =>{
            if(data.configurable > 0){
                //SweatAlert asking for two inputs number in both cases (SI and NO)
                
                let colums = ""


                for(i=0; i< data.inputs.length; i++){
                    colums += `
                        <div >
                            <label for="input${i}">${data.inputs[i].Nombre}</label>
                            <input type="number" class="form-control" id="input${i}" 
                            value="${data.inputs[i].Precio}" placeholder="Precio condicional"value="0">
                        </div>
                    `
                    colums += `

                        <div >
                            <label for="accion${i}">Acción</label>
                            <select id="accion${i}" class="form-control">

                                <option value="${data.inputs[i].accion}" selected>${data.inputs[i].accion}</option>
                                <option value="Suma">Suma</option>
                                <option value="Multiplicacion">Mutiplicacion</option>
                            </select>
                        </div>
                    `
                }


                Swal.fire({
                    title: 'Configurar pagina',
                    html: `
                        <div class="">
                            ${colums}
                        </div>
                    `,
                    focusConfirm: false,
                    preConfirm: () => {
                        let values = []
                        for(i=0; i< data.inputs.length; i++){
                            let value = d.getElementById(`input${i}`).value
                            let accion = d.getElementById(`accion${i}`).value
                            if(value == ""){
                                Swal.showValidationMessage(`El campo ${data.inputs[i].Nombre} es obligatorio`)
                            }else{
                                values.push({
                                    idInput: data.inputs[i]._id,
                                    precio: +value,
                                    accion : accion
                                })
                            }
                        }

                        return values
                        
                    }
                }).then((result) =>{
                    if(result.isConfirmed){
                        let dataEnvio = {
                            idPagina,
                            idFormulario,
                            inputs: result.value,
                        }

                       Swal.fire({
                           title: 'Cargando...',
                           html: 'Espere un momento', // add html attribute if you want or remove
                           allowOutsideClick: false,
                           showConfirmButton: false,
                           onBeforeOpen: () => {
                               Swal.showLoading()
                           }
                       })

                        fetch(`/api/precios-pagina-inputs`,{
                            method: 'POST',
                            body: JSON.stringify(dataEnvio),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        .then((data) =>{
                            return data.json()
                        })
                        .then((data) =>{
                            if(data.ok){
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Pagina configurada',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                setTimeout(() => {
                                    location.reload()
                                }, 1500);
                            }else{
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'No se pudo configurar la pagina',
                                })
                            }
                        })
                    }
                })
                
            }else{  
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se puede configurar esta pagina, ya que los campos no son checkbox o tipo número',
                })
            }
        })
    }

    const evaluarConfiguracion = (idPagina, idFormulario) =>{
        //laoding with sweetalert
        Swal.fire({
            title: 'Cargando...',
            html: 'Espere un momento', // add html attribute if you want or remove
            allowOutsideClick: false,
            showConfirmButton: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        })
        
        fetch(`/api/evaluar-configuracion`,{
            method: 'POST',
            body: JSON.stringify({idPagina, idFormulario}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((data) =>{
            return data.json()
        })
        .then((data) =>{
            if(data.configurable > 0){
                //SweatAlert asking for two inputs number in both cases (SI and NO)
                
                let colums = ""

                for(i=0; i< data.inputs.length; i++){
                    colums += `
                        <div class="">
                            <label for="input${i}">${data.inputs[i].Nombre}</label>
                            <input type="number" class="form-control" id="input${i}" 
                            value="${data.inputs[i].NumeroPaginas}" placeholder="Paginas a omitir"value="0">
                        </div>
                    `
                }


                Swal.fire({
                    title: 'Configurar pagina',
                    html: `
                        <div class="">
                            ${colums}
                        </div>
                    `,
                    focusConfirm: false,
                    preConfirm: () => {
                        let values = []
                        for(i=0; i< data.inputs.length; i++){
                            let value = d.getElementById(`input${i}`).value
                            if(value == ""){
                                Swal.showValidationMessage(`El campo ${data.inputs[i].Nombre} es obligatorio`)
                            }else{
                                values.push({
                                    idInput: data.inputs[i]._id,
                                    numeroPaginas: value
                                })
                            }
                        }

                        return values
                        
                    }
                }).then((result) =>{
                    if(result.isConfirmed){
                        let dataEnvio = {
                            idPagina,
                            idFormulario,
                            inputs: result.value,
                        }
                       Swal.fire({
                           title: 'Cargando...',
                           html: 'Espere un momento', // add html attribute if you want or remove
                           allowOutsideClick: false,
                           showConfirmButton: false,
                           onBeforeOpen: () => {
                               Swal.showLoading()
                           }
                       })

                        fetch(`/api/configurar-pagina-inputs`,{
                            method: 'POST',
                            body: JSON.stringify(dataEnvio),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        .then((data) =>{
                            return data.json()
                        })
                        .then((data) =>{
                            if(data.ok){
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Pagina configurada',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                setTimeout(() => {
                                    location.reload()
                                }, 1500);
                            }else{
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'No se pudo configurar la pagina',
                                })
                            }
                        })
                    }
                })
                
            }else{  
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se puede configurar esta pagina, ya que los campos no son checkbox',
                })
            }
        })
    }


    $btnEliminar.onclick = () =>{
        Swal.fire({
            title: '¿Estas seguro de eliminar este formulario?',
            text: "No podras revertir esta accion",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = `/api/eliminar-formulario/${$btnEliminar.getAttribute('data-_idformulario')}`
            }
        })
    }

    $btnAgregar.onclick = () =>{
        if($Nombre.value == '' || $Tipo.value == 0 || $Opcional.value == 0 || $Espacio.value == 0 || $Pagina.value == '' || $TiempoEstimado.value == 0 || $Precio.value == "" || $Precio.value <=0 ||  $Pagina.value <= 0){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Todos los campos son obligatorios',
            })
            return
        }
        let validacion = camposCrear.find((data) => data.Nombre == $Nombre.value)
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
            camposCrear.push(subdata)
            let tr = `
                <tr>
                    <td> <input type="text" class="form-control" value="${$Nombre.value}"></td>
                    <td>
                        <select class="form-control">
                            <option value="${$Tipo.value}" selected>${$Tipo.value}</option>
                            <option value="textarea">Area de texto</option>
                            <option value="file">Archivo</option>
                            <option value="checkbox">Casilla de verificación</option>
                            <option value="email">Correo electronico</option>
                            <option value="date">Fecha</option>
                            <option value="number">Numero</option>
                            <option value="text">Texto</option>
                        </select>
                    </td>
                    <td>
                        <select class="form-control">
                            <option value="${$Opcional.value}" selected>${$Opcional.value}</option>
                            <option value="Si">Si</option>
                            <option value="No">No</option>
                        </select>
                    </td>
                    <td>
                        <select class="form-control">
                            <option value="${$Espacio.value}" selected>${$Espacio.value}</option>    
                            <option value="1 Columna">1 Columna</option>
                            <option value="2 Columnas">2 Columna</option>
                            <option value="3 Columnas">3 Columna</option>
                            <option value="4 Columnas">4 Columna</option>
                        </select>
                    </td>
                    <td><button class="btn btn-danger">Eliminar campo</button></td>
                </tr>
            `;

            $Nombre.value = ''
            $Tipo.value = 0
            $Opcional.value = 0
            $Espacio.value = 0

            $tbody.insertAdjacentHTML('beforeend', tr)
        }
    }



    let _idFocus = null

    d.addEventListener('click', e=>{
        console.log(e.target)
          if(e.target.textContent == "Eliminar campo"){
            e.preventDefault();
            let linea = e.target.parentElement.parentElement
            $tbody.removeChild(linea)            
            campos = campos.filter((data) => data.Nombre != linea.children[0].textContent)
        }
        if(e.target.textContent == "Editar"){
            let idFormulario = e.target.dataset.idformulario;
            let idPagina = e.target.dataset.idpagina;
            fetch(`/api/formulario-pagina/${idFormulario}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idPagina
                })
            })
            .then((data) =>{
                return data.json()
            })
            .then((data) =>{
                if(data.ok){
                    $TituloPagina.value = data.pagina.TituloPagina;
                    $Pagina.value = data.pagina.Pagina;
                    $Descripcion.value = data.pagina.Descripcion;
                    $btnCrearPagina.textContent = "Editar página";
                    $tbody.innerHTML = "";
                    for(i=0; i< data.pagina.Inputs.length; i++){
                        let tr = d.createElement('tr');
                        tr.innerHTML = `
                        <td> <input type="text" class="form-control" value="${data.pagina.Inputs[i].Nombre}"></td>
                        <td>
                            <select class="form-control">
                                <option value="${data.pagina.Inputs[i].Tipo}" selected>${data.pagina.Inputs[i].Tipo}</option>
                                <option value="textarea">Area de texto</option>
                                <option value="file">Archivo</option>
                                <option value="checkbox">Casilla de verificación</option>
                                <option value="email">Correo electronico</option>
                                <option value="date">Fecha</option>
                                <option value="number">Numero</option>
                                <option value="text">Texto</option>
                            </select>
                        </td>
                        <td>
                            <select class="form-control">
                                <option value="${data.pagina.Inputs[i].Opcional}" selected>${data.pagina.Inputs[i].Opcional}</option>
                                <option value="Si">Si</option>
                                <option value="No">No</option>
                            </select>
                        </td>
                        <td>
                            <select class="form-control">
                                <option value="${data.pagina.Inputs[i].Espacio}" selected>${data.pagina.Inputs[i].Espacio}</option>    
                                <option value="1 Columna">1 Columna</option>
                                <option value="2 Columnas">2 Columna</option>
                                <option value="3 Columnas">3 Columna</option>
                                <option value="4 Columnas">4 Columna</option>
                            </select>
                        </td>
                        <td><button class="btn btn-danger" data-id="${data.pagina.Inputs[i]._id}">Eliminar campo</button></td>
                        `;
                        $tbody.appendChild(tr);
                    }
                    window.scrollTo(0, 0);

                    _idFocus = idPagina;
                }
            })
        }
        if(e.target.textContent == "Eliminar"){
            Swal.fire({
                title: '¿Está seguro de eliminar esta página?',
                text: "No podrá revertir esta acción",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar'
            }).then((result) => {
                if (result.isConfirmed) {
                    let idFormulario = e.target.dataset.idformulario;
                    let idPagina = e.target.dataset.idpagina;
                    fetch(`/api/eliminar-pagina/${idFormulario}`,{
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            idPagina
                        })
                    })
                    .then((data) =>{
                        return data.json()
                    }).then((data) =>{
                        if(data.ok){
                            Swal.fire(
                                'Página eliminada',
                                'La página fue eliminada correctamente',
                                'success'
                            ).
                            then(()=>{
                                location.reload();
                            })
                        }else{
                            Swal.fire(
                                'Error',
                                'Ha ocurrido un error. Comunicate con soporte',
                                'error'
                            )
                        }
                    })
                }
            })
        }
        if(e.target == $btnCrearPagina){
            fetch(`/api/solicitar-formulario/${$TituloSeccion.dataset._id}`)
            .then((data) =>{
                return data.json()
            })
            .then((data) =>{
                if($TituloPagina.value == ''){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'El titulo de la página es obligatorio',
                    })
                    return
                }
                if($tbody.children.length == 0){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Debe agregar al menos un campo a la lista',
                    })
                    return
                }

                let validacionPagina = data.formulario.Paginas.find((data) => data.Pagina == $Pagina.value)
                let campos = $tbody.children;
                let Inputs = [];
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
                                for(i=0; i< campos.length; i++){
                                    let subdataInputs = {
                                        Nombre: campos[i].children[0].firstElementChild.value,
                                        Tipo: campos[i].children[1].firstElementChild.value,
                                        Opcional: campos[i].children[2].firstElementChild.value,
                                        Espacio: campos[i].children[3].firstElementChild.value
                                    }
                                    Inputs.push(subdataInputs)
                                }
                                let dataEnvio = {
                                    TituloPagina: $TituloPagina.value,
                                    Descripcion: $Descripcion.value,
                                    _idFormulario : $TituloSeccion.dataset._id,
                                    TiempoEstimado: $TiempoEstimado.value,
                                    Precio: $Precio.value,
                                    Pagina: $Pagina.value,
                                    Inputs,
                                }
                                crearPagina(dataEnvio)
                            }
                        })
                    }
                else{
                    let cols = ""

                    for(i=0; i< camposCrear.length; i++){
                        let col = ""
                        let subdataInputs = {
                            Nombre: camposCrear[i].Nombre,
                            Tipo: camposCrear[i].Tipo,
                            Opcional: camposCrear[i].Opcional,
                            Espacio: camposCrear[i].Espacio
                        }
                        Inputs.push(subdataInputs)
                    }

                    let dataEnvio = {
                        TituloPagina: $TituloPagina.value,
                        Descripcion: $Descripcion.value,
                        TiempoEstimado: $TiempoEstimado.value,
                        Precio: $Precio.value,
                        _idFormulario : $TituloSeccion.dataset._id,
                        Pagina: $Pagina.value,
                        Inputs,
                    }

                    crearPagina(dataEnvio)

                }
            })
        }
        if(e.target.matches('.configButton')){
            let idPagina = e.target.dataset.idpagina;
            let idFormulario = e.target.dataset.idformulario;
            evaluarConfiguracion(idPagina, idFormulario)
        }
        if(e.target.matches('.moneyButton')){
            let idPagina = e.target.dataset.idpagina;
            let idFormulario = e.target.dataset.idformulario;
            evaluarPrecios(idPagina, idFormulario)
        }
    })

