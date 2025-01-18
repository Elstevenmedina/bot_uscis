    const d = document,
    $btnEliminar = d.getElementById('btnEliminar'),
    $button = d.getElementsByTagName('button');
    
    d.addEventListener('submit', e =>{
        for(i=0; i< $button.length; i++){
            if($button[i].getAttribute('type') == 'submit'){
                $button[i].setAttribute('disabled','')
            }
        }
    })

    $btnEliminar.onclick = () =>{
        Swal.fire({
            title: '¿Estas seguro de eliminar esta franquicia?',
            text: "No podras revertir esta accion",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = `/api/eliminar-franquicia/${$btnEliminar.getAttribute('data-idfranquicia')}`
            }
        })
    }