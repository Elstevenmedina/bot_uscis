let example1 = document.getElementById('example1');
let $resultadosPendientes = document.getElementById('resultadosPendientes');

fetch('/api/resultados-pendientes')
.then((data) =>{
  return data.json()
})
.then((data) =>{
  $resultadosPendientes.textContent = data
})

if(example1){
  $(function () {
    $("#example1").DataTable({
      "responsive": true, "lengthChange": false, "autoWidth": false,
    }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
  });
}