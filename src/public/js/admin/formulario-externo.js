const d = document,
  $btnAnterior = d.getElementById("btnAnterior"),
  $paginaActual = d.getElementById("paginaActual"),
  $btnSiguiente = d.getElementById("btnSiguiente"),
  $insertarPaginas = d.getElementById("insertarPaginas"),
  Zelle = $insertarPaginas.dataset.zelle,
  Whatsapp = $insertarPaginas.dataset.whatsapp,
  NombreEmpresa = $insertarPaginas.dataset.nombreempresa,
  Paginaweb = $insertarPaginas.dataset.paginaweb,
  TiempoEstimado = $insertarPaginas.dataset.tiempoestimado,
  Precio = $insertarPaginas.dataset.precio,
  _idFormulario = $insertarPaginas.dataset._idformulario,
  _idSucursal = $insertarPaginas.dataset._idsucursal;

let tiempoTranscurrido = "";
let paginaActual = 0;
let files = [];
let ultimaPagina = false;
let paginaPago = true;
let contadorInicializado = false;
let PrecioFinal = 0;
let paginasOmitidas = [];

let dataPrecios = [
  {
    Precio,
    _idCampo: "Base",
  },
];

const vw = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);
const vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
);
let styles = `style="margin: 100px 50px 100px 50px; border-radius: 30px !important; "`;
let mb = "mb-4";
let marginInputs = "ml-3 mr-3";
if (+vw <= 1024) {
  styles = `style="border-radius: 30px !important; "`;
  mb = "mb-1";
  marginInputs = "";
}

const initContador = () => {
  var defaults = {},
    one_second = 1000,
    one_minute = one_second * 60,
    one_hour = one_minute * 60,
    one_day = one_hour * 24,
    startDate = new Date();

  var requestAnimationFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  tick();

  function tick() {
    var now = new Date(),
      elapsed = now - startDate,
      parts = [];

    parts[0] = "" + Math.floor((elapsed % one_hour) / one_minute);
    parts[1] =
      "" + Math.floor(((elapsed % one_hour) % one_minute) / one_second);

    parts[0] = parts[0].length == 1 ? "0" + parts[0] : parts[0];
    parts[1] = parts[1].length == 1 ? "0" + parts[1] : parts[1];

    tiempoTranscurrido = parts.join(":");
    let segundos = tiempoTranscurrido.split(":")[1];
    let minutos = tiempoTranscurrido.split(":")[0];
    let grados1 = 225;
    let grados2 = 222;

    if (document.getElementById("lazy")) {
      document.getElementById("lazy").innerText = tiempoTranscurrido;
    }

    if (+parts[1] < 31) {
      //rotate
      grados1 = 225 + 6 * segundos;
      if (d.querySelector(".minute")) {
        d.querySelector(
          ".minute"
        ).firstElementChild.firstElementChild.style.transform = `rotate(${225}deg)`;
        d.querySelector(
          ".minute"
        ).lastElementChild.firstElementChild.style.transform = `rotate(${grados1}deg)`;
      }
    } else {
      grados1 = 45 + 6 * segundos;
      if (d.querySelector(".minute")) {
        d.querySelector(
          ".minute"
        ).firstElementChild.firstElementChild.style.transform = `rotate(${grados1}deg)`;
      }
    }
    if (+parts[0] < 31) {
      //rotate
      grados1 = 225 + 6 * minutos;
      if (d.querySelector(".hour")) {
        d.querySelector(
          ".hour"
        ).firstElementChild.firstElementChild.style.transform = `rotate(${225}deg)`;
        d.querySelector(
          ".hour"
        ).lastElementChild.firstElementChild.style.transform = `rotate(${grados1}deg)`;
      }
    } else {
      grados1 = 45 + 6 * minutos;
      if (d.querySelector(".hour")) {
        d.querySelector(
          ".hour"
        ).firstElementChild.firstElementChild.style.transform = `rotate(${grados1}deg)`;
      }
    }

    requestAnimationFrame(tick);
  }
};

const solicitarPagina = (_id, pagina, tipo, campoSeleccionado, franquicia) => {
  Swal.fire({
      title: 'Cargando página',
      text: 'Espere...',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
          Swal.showLoading()
      }
  })
  fetch(`/api/solicitar-pagina-franquiciado/${_id}:${pagina}:${franquicia}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      campoSeleccionado: campoSeleccionado,
    }),
  })
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      Swal.close()
      if (data.ok) {
        let numeroPagina = pagina;
        ultimaPagina = data.ultimaPagina;
        paginasOmitidas = paginasOmitidas.filter(
          (numero) => numero != data.Pagina.Pagina
        );
        paginasOmitidas.push(...data.paginasOmitidas);
        paginaActual = data.Pagina.Pagina;
        if(data.saltarPago){
          paginaActual = +paginaActual + 1;

          let dataPrecios = localStorage.getItem("dataPrecios");

          if (dataPrecios == null) {
            dataPrecios = [];
          }

          dataPrecios = JSON.parse(dataPrecios);

          for (i = 0; i < dataPrecios.length; i++) {
            PrecioFinal = (+PrecioFinal + +dataPrecios[i].Precio).toFixed(2);
          }

          crearPaginaPago(PrecioFinal);
          
        }else{
          cargarPagina(data.Pagina, data.paginasTotales, tipo, numeroPagina);
        }
      } else {
        alert("Error");
      }
    });
};

solicitarPagina(_idFormulario, paginaActual, "siguiente", "", _idSucursal);

const crearPaginaContador = (tipo) => {
  let animacion = "";

  if (tipo == "siguiente") {
    animacion = "animate__animated animate__slideInRight";
  } else {
    animacion = "animate__animated animate__slideInLeft";
  }
  let card = `
        <div class="card ${animacion} " ${styles} id="contador">
            <div class="card-body">
                <div class="row">
                    <div class="col-12 col-sm-12 text-center">
                        <h2><strong id="tituloPagina">EL TIEMPO PROMEDIO PARA COMPLETAR ESTA APLICACIÓN ES DE ${TiempoEstimado}</strong></h2>
                    </div>
                    <div class="col-12 col-sm-12 text-center">
                   <div class="timer-group">
                       <div class="timer hour">
                           <div class="hand"><span></span></div>
                           <div class="hand"><span></span></div>
                       </div>
                       <div class="timer minute">
                           <div class="hand"><span></span></div>
                           <div class="hand"><span></span></div>
                       </div>
                       <div class="face">
                           <p id="lazy">00:00</p>  
                       </div>
                   </div>
               </div>
                </div>
            </div>
            <div class="outside">
                <div class="row">
                    <div class="col-6 col-sm-6">
                        <button class="btn btn-secondary w-100" id="btnAnterior" style="border-radius: 30px !important; font-size:14px" disabled>REGRESAR</button>
                    </div>
                    <div class="col-6  col-sm-6">
                        <button class="btn btn-inmigracion w-100" id="btnSiguiente" style="border-radius: 30px !important; font-size:14px" >SIGUIENTE</button>
                    </div>
                </div>
            </div>
        </div>
        `;
  setTimeout(() => {
    $insertarPaginas.firstElementChild.remove();
    $insertarPaginas.innerHTML = card;
    let margin = (+vh - +$insertarPaginas.firstElementChild.offsetHeight) / 2;
    $insertarPaginas.firstElementChild.style.marginTop = `${margin}px`;
    $insertarPaginas.firstElementChild.style.marginBottom = `${margin}px`;
    if (!contadorInicializado) {
      initContador();
      contadorInicializado = true;
    }
  }, 800);
};

if (paginaActual == 0) {
  crearPaginaContador("siguiente");
} else {
  solicitarPagina(_idFormulario, paginaActual, "siguiente", "", _idSucursal);
}

const crearPaginaFinal = () => {
  let animacion = "";

  animacion = "animate__animated animate__slideInRight";

  let card = `
              <div class="card ${animacion}" style="width:75vw; margin-top: 80px; margin-left:12%; margin-right: 12%; border-radius: 30px !important; ">
                <div class="card-body">
                    <div class="row">
                        <div class="col-12">
                            <h2 class="text-center">DATOS REGISTRADOS CORRECTAMENTE</h2>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-sm-6">
                            <div class="row">
                                <div class="col-sm-2"></div>
                                <div class="col-sm-10 col-12">
                                    <img src="/images/final.jpg" alt="" width="5500px" class="img-fluid" style="border-radius: 30px !important; " >
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6" style="margin-top: 50px;">
                            <div class="row">
                                <div class="col-sm-10 col-12 text-center">
                                    <h1>Muchas Gracias!</h1>
                                    <p class="h2">Hemos recibido toda la información del formulario</p> <br>
                                    <p class="h2">No dudes en llamarnos a través de nuestro servicio de atención al cliente via Whatsapp por el número ${Whatsapp}</p>
                                </div>
                                <div class="col-sm-2"></div>
                              
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  $insertarPaginas.firstElementChild.classList.remove("animate__slideInRight");
  $insertarPaginas.firstElementChild.classList.remove("animate__slideInLeft");
  $insertarPaginas.firstElementChild.classList.add(
    "animate__animated",
    "animate__bounceOutLeft"
  );
  setTimeout(() => {
    $insertarPaginas.firstElementChild.remove();
    $insertarPaginas.innerHTML = card;
    let margin = (+vh - +$insertarPaginas.firstElementChild.offsetHeight) / 2;
    $insertarPaginas.firstElementChild.style.marginTop = `${margin}px`;
    $insertarPaginas.firstElementChild.style.marginBottom = `${margin}px`;
  }, 800);
};

enviarDatos = (paypal) => {
  //una vez se hayan enviado todos los datos cargamos ultima pagina
  let localStorage = window.localStorage;
  let inputsEnviar = [];
  for (i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key != "__paypal_storage__") {
      let value = localStorage.getItem(key);
      let valor = JSON.parse(value);

      let subdata = {
        Campo: key,
        Valor: valor.valor,
      };
      inputsEnviar.push(subdata);
    }
  }
  let dataEnvio = {
    _idFormulario: _idFormulario,
    inputs: inputsEnviar,
    _idFranquicia: _idSucursal,
    paypal,
    files: files,
  };

  fetch("/api/insertar-formulario-franquiciado", {
    method: "POST",
    body: JSON.stringify(dataEnvio),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      if (data.ok) {
        localStorage.clear();

        crearPaginaFinal();
      } else {
        alert("Error");
      }
    });
};

const generarStripe = () => {
  const stripe = Stripe("pk_live_jCn8dzrRmokZSc5f4Wv1pJpj");
  PrecioFinal = PrecioFinal == 0 ? 10 : PrecioFinal;

  let localStorage = window.localStorage;
  let inputsEnviar = [];
  for (i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if ((key != "__paypal_storage__" || key != "debug") && key.length == 24) {
      let value = localStorage.getItem(key);
      let valor = JSON.parse(value);

      let subdata = {
        Campo: key,
        Valor: valor.valor,
      };
      inputsEnviar.push(subdata);
    }
  }
  let purchase = {
    value: PrecioFinal,
    successURL: "https://inmigracion.herokuapp.com/payment-success",
    failedURL: window.location.href,
    _idFormulario: _idFormulario,
    _idFranquicia: _idSucursal,
    inputs: inputsEnviar,
    files: files,
    usuarioCliente: getUserIdFromUrl(),
  };

  fetch("/create-checkout-session-franquiciado", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(purchase),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (session) {
      return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then(function (result) {
      if (result.error) {
        alert(result.error.message);
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
};

const getUserIdFromUrl= () => {
  const url = window.location.href;
  const parts = url.split('/');
  const userId = parts.pop().split(':').pop().replace('#', '');
  return userId;
}

const generarZelleModal = () => {
  Swal.fire({
    title: "Por favor ingrese su información de compra",
    html: `
                <p><b>Precio total</b>: $${PrecioFinal}</p>
                <p>Aceptamos pagos por la plataforma de transferencia ZELLE. 
                Esta plataforma no tiene ningun costo adicional ( comisiones) y solo necesitas los  datos de correo y nombre. 
                El email para transacciones ZELLE es <b>${Zelle}</b> bajo el nombre ${NombreEmpresa}.
                Enviar el capture a nuestro <b>WhatsApp ${Whatsapp}</b> para finalizar el proceso. 
                La transferencia debe realizarse dentro de las proximas 24 horas una vez hagas clic
                en el boton de enviar o el sistema automaticamente borrara todo la informacion enviada.</p>
                <p><b>Email Zelle </b>: ${Zelle}</p>
                <p>Email: <input id="email" type="email" class="form-control" placeholder="customer@example.com"></p>
                <p>Fecha: <input id="date" type="date" class="form-control"></p>
                <p>Número de transacción: <input id="transaction" type="text" class="form-control" placeholder="123456789"></p>
            `,
    showCancelButton: true,
    confirmButtonText: "Enviar",
    onOpen: () => {
      // Access the input elements and set focus on the first one
      const input = swal.getInput();
      input.focus();
    },
    preConfirm: () => {
      // Get the values of the input fields
      const email = document.getElementById("email").value;
      const date = document.getElementById("date").value;
      const transaction = document.getElementById("transaction").value;

      // Validate the input values
      if (!email || !date || !transaction) {
        Swal.showValidationMessage("Por favor complete todos los campos");
      }

      // Return the input values as an object
      return {
        email: email,
        date: date,
        transaction: transaction,
      };
    },
  }).then((result) => {
    if (result.value) {
      const email = result.value.email;
      const date = result.value.date;
      const transaction = result.value.transaction;
      
      let Zelle = {
        email,
        date,
        transaction,
        PrecioFinal,
      };

      let localStorage = window.localStorage;
      let inputsEnviar = [];
      for (i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (
          (key != "__paypal_storage__" || key != "debug") &&
          key.length == 24
        ) {
          let value = localStorage.getItem(key);
          let valor = JSON.parse(value);

          let subdata = {
            Campo: key,
            Valor: valor.valor,
          };
          inputsEnviar.push(subdata);
        }
      }

      fetch("/api/enivar-pago-zelle-franquiciado", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _idFormulario: _idFormulario,
          _idFranquicia: _idSucursal,
          inputs: inputsEnviar,
          files: files,
          Zelle,
          usuarioCliente : getUserIdFromUrl()
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.clear();

          crearPaginaFinal();
        });
    }
  });
};

const crearPaginaPago = () => {
  let animacion = "";

  animacion = "animate__animated animate__slideInRight";

  let card = `
           <div class="card ${animacion}" ${styles}>
               <div class="card-body">
                  <div class="row">
                       <div class="col-12">
                           <h3 class="text-center">PAGO</h3>
                       </div>
                        <div class="col-6 text-center">
                            <p>Zelle:</p>
                            <a href="#" class="btnZelle">
                                <img src="/images/Zelle_logo.png" alt="" width="150px" class="img-fluid btnZelle" style="border-radius: 30px !important; " >
                            </a>   
                        </div>     
                        <div class="col-6 text-center mt-2">
                            <p>Tarjetas de credito / debito:</p>
                            <a href="#" class="btnStripe">
                                <img src="/images/cards.png" alt="" width="200px" class="img-fluid border border-dark btnStripe" >
                            </a>
                        </div>     
                  </div>
               </div>
               <div class="outside">
                   <div class="row">
                       <div class="col-6 col-sm-6">
                           <button class="btn btn-secondary w-100" id="btnAnterior" style="border-radius: 30px !important; font-size:14px">REGRESAR</button>
                       </div>
                       <div class="col-6  col-sm-6">
                           <button class="btn btn-inmigracion w-100" id="btnSiguiente" style="border-radius: 30px !important; font-size:14px" disabled >SIGUIENTE</button>
                       </div>
                   </div>
               </div>
           </div>
       `;
  $insertarPaginas.firstElementChild.classList.remove("animate__slideInRight");
  $insertarPaginas.firstElementChild.classList.remove("animate__slideInLeft");
  $insertarPaginas.firstElementChild.classList.add(
    "animate__animated",
    "animate__bounceOutLeft"
  );
  setTimeout(() => {
    $insertarPaginas.firstElementChild.remove();
    $insertarPaginas.innerHTML = card;
    let margin = (+vh - +$insertarPaginas.firstElementChild.offsetHeight) / 2;
    $insertarPaginas.firstElementChild.style.marginTop = `${margin}px`;
    $insertarPaginas.firstElementChild.style.marginBottom = `${margin}px`;
  }, 800);
};

const cargarPagina = (pagina, paginasTotales, tipo, numeroPagina) => {
  let disabled = "disabled";
  if (pagina.Pagina > 0) {
    disabled = "";
  }
  let inputs = "";

  for (i = 0; i < pagina.Inputs.length; i++) {
    let campo = pagina.Inputs[i];
    let col = "";
    let input = "";
    if (campo.Espacio == "1 Columna") {
      col = "col-12 col-sm-12";
    } else if (campo.Espacio == "2 Columnas") {
      col = "col-12 col-sm-6";
    } else if (campo.Espacio == "3 Columnas") {
      col = "col-12 col-sm-4";
    } else if (campo.Espacio == "4 Columnas") {
      col = "col-12 col-sm-3";
    }
    let Opcional = "true";
    if (campo.Opcional == "Si") {
      Opcional = "false";
    }

    if (campo.Tipo == "checkbox") {
      let registro = localStorage.getItem(campo._id);
      if (registro == null) {
        registro = {
          valor: "",
        };
      } else {
        registro = JSON.parse(registro);
        if (registro.valor === true) {
          registro.valor = "checked";
        } else {
          registro.valor = "";
        }
      }

      let preciosInputs = pagina.Precios
        ? pagina.Precios
        : [
            {
              _idCampo: campo._id,
              Precio: 0,
              Accion: "ninguna",
            },
          ];

      let precioInputEncontrado = preciosInputs.find(
        (data) => data._idCampo == campo._id
      );
      if (precioInputEncontrado) {
        registro.valor = "";
      }

      precioInputEncontrado = precioInputEncontrado
        ? precioInputEncontrado
        : { Precio: 0, Accion: "Suma" };

      input = `
                    <div class="${col}">
                        <div class="mb-4 border shadow p-3 mb-5 bg-white rounded">
                            <div class="form-check ">
                                <input  data-precio="${precioInputEncontrado.Precio}"  data-accion="${precioInputEncontrado.Accion}" 
                                class="form-check-input big-checkbox shadow-inputs inputForm"  data-page="${numeroPagina}" ${registro.valor} type="checkbox" name="${campo._id}" value="" required="${Opcional}" id="${campo._id}" >
                                <label class="form-check-label ml-3" for="${campo._id}">
                                    ${campo.Nombre}
                                </label>
                            </div>
                        </div>
                    </div>
                `;
    } else if (campo.Tipo == "file") {
      input = `
                    <div class="${col}">
                        <div class="mb-4">
                            <label for="${campo._id}">${campo.Nombre}</label>
                            <input type="file" class="form-control shadow-inputs inputForm" name="${campo._id}" id="${campo._id}" required="${Opcional}"  multiple="multiple">
                        </div>
                    </div>
                `;
    } else if (campo.Tipo == "textarea") {
      let registro = localStorage.getItem(campo._id);
      if (registro == null) {
        registro = {
          valor: "",
        };
      } else {
        registro = JSON.parse(registro);
      }
      input = `
                    <div class="${col}">
                        <div class="mb-4">
                            <label for="${campo._id}">${campo.Nombre}</label>
                            <textarea 
                            data-precio="0" 
                            data-accion="Suma" 
                            class="form-control shadow-inputs inputForm" name="${campo._id}" name="${campo._id}" required="${Opcional}" cols="30" rows="10" placeholder="${campo.Nombre}:">${registro.valor}</textarea>
                        </div>
                    </div>
                `;
    } else {
      let registro = localStorage.getItem(campo._id);
      if (registro == null) {
        registro = {
          valor: "",
        };
      } else {
        registro = JSON.parse(registro);
      }

      let preciosInputs = pagina.Precios
        ? pagina.Precios
        : [
            {
              _idCampo: campo._id,
              Precio: 0,
              Accion: "ninguna",
            },
          ];

      let precioInputEncontrado = preciosInputs.find(
        (data) => data._idCampo == campo._id
      );

      if (precioInputEncontrado) {
        registro.valor = "";
      }
      precioInputEncontrado = precioInputEncontrado
        ? precioInputEncontrado
        : { Precio: 0, Accion: "Suma" };
      input = `
                <div class="${col}">
                    <div class="${mb}">
                        <label for="${campo._id}">${campo.Nombre}</label>
                        <input type="${campo.Tipo}" required="${Opcional}" 
                        data-precio="${precioInputEncontrado.Precio}" 
                        data-accion="${precioInputEncontrado.Accion}" 
                        value="${registro.valor}" class="form-control shadow-inputs inputForm" id="${campo._id}" 
                        name="${campo._id}" placeholder="${campo.Nombre}:">
                    </div>
                </div>
            `;
    }

    inputs += input;
  }

  let animacion = "";

  if (tipo == "siguiente") {
    animacion = "animate__animated animate__slideInRight";
  } else {
    animacion = "animate__animated animate__slideInLeft";
  }

  let card = `
            <div class="card ${animacion}" style=" margin-top: 100px; margin-left:50px; margin-right: 50px; border-radius: 30px !important; ">
                <div class="card-body">
                    <div class="row">
                        <div class="col-12 text-right m-0">
                            <p style="font-size: 14px; " >Página <strong id="paginaActual">${pagina.Pagina}</strong> de ${paginasTotales}</p>
                        </div>
                        <div class="col-12 col-sm-12 text-center">
                            <h2><strong id="tituloPagina">${pagina.TituloPagina}</strong></h2>
                        </div>
                        <div class="col-12 col-sm-12 text-center">
                            <h4>${pagina.Descripcion}</h4>
                        </div>
                        <div class="col-12 col-sm-12">
                            <div class="row ml-3 mr-3">
                                ${inputs}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="outside">
                    <div class="row">
                        <div class="col-6 col-sm-6">
                            <button class="btn btn-secondary w-100" id="btnAnterior" style="border-radius: 30px !important; font-size:14px" ${disabled}>REGRESAR</button>
                        </div>
                        <div class="col-6  col-sm-6">
                            <button class="btn btn-inmigracion w-100" id="btnSiguiente" style="border-radius: 30px !important; font-size:14px" >SIGUIENTE</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
  if (tipo == "siguiente") {
    $insertarPaginas.firstElementChild.classList.remove(
      "animate__slideInRight"
    );
    $insertarPaginas.firstElementChild.classList.remove("animate__slideInLeft");
    $insertarPaginas.firstElementChild.classList.add(
      "animate__animated",
      "animate__bounceOutLeft"
    );
  } else {
    $insertarPaginas.firstElementChild.classList.remove(
      "animate__slideInRight"
    );
    $insertarPaginas.firstElementChild.classList.remove("animate__slideInLeft");
    $insertarPaginas.firstElementChild.classList.add(
      "animate__animated",
      "animate__bounceOutRight"
    );
  }
  setTimeout(() => {
    $insertarPaginas.firstElementChild.remove();

    $insertarPaginas.innerHTML = card;
    let margin = (+vh - +$insertarPaginas.firstElementChild.offsetHeight) / 2;
    $insertarPaginas.firstElementChild.style.marginTop = `${margin}px`;
    $insertarPaginas.firstElementChild.style.marginBottom = `${margin}px`;
  }, 800);
};

d.addEventListener("click", (e) => {
  if (e.target.matches("#btnSiguiente")) {
    let inputs = document.querySelectorAll("input");
    let textareas = document.querySelectorAll("textarea");
    let selects = document.querySelectorAll("select");
    let checkbox = document.querySelectorAll("checkbox");
    let file = document.querySelectorAll("file");
    let seguir = true;
    let unoCheked = 0;
    let campoSeleccionado = false;
    for (i = 0; i < inputs.length; i++) {
      if (inputs[i].type !== "checkbox" && inputs[i].type !== "file") {
        if (inputs[i].getAttribute("required") == "true") {
          if (inputs[i].value == "") {
            inputs[i].classList.add("shadow-inputs-danger");
            seguir = false;
          } else {
            inputs[i].classList.remove("shadow-inputs-danger");
          }
        }
      }
      if (inputs[i].type == "checkbox") {
        if (inputs[i].getAttribute("required") == "true") {
          if (!inputs[i].checked) {
            inputs[i].classList.add("shadow-inputs-danger");
            seguir = false;
          } else {
            campoSeleccionado = inputs[i].name;
            unoCheked++;
            inputs[i].classList.remove("shadow-inputs-danger");
          }
        }
      }
      if (inputs[i].type == "file") {
        if (inputs[i].getAttribute("required") == "true") {
          if (inputs[i].files.length == 0) {
            inputs[i].classList.add("shadow-inputs-danger");
            seguir = false;
          } else {
            inputs[i].classList.remove("shadow-inputs-danger");
          }
        }
      }
    }
    if (unoCheked > 0) {
      seguir = true;
    }

    for (i = 0; i < textareas.length; i++) {
      if (textareas[i].getAttribute("required") == "true") {
        if (textareas[i].value == "") {
          textareas[i].classList.add("shadow-inputs-danger");
          seguir = false;
          textareas[i].focus();
        } else {
          textareas[i].classList.remove("shadow-inputs-danger");
        }
      }
    }
    for (i = 0; i < selects.length; i++) {
      if (selects[i].getAttribute("required") == "true") {
        if (selects[i].value == "") {
          selects[i].classList.add("shadow-inputs-danger");
          seguir = false;
          selects[i].focus();
        } else {
          selects[i].classList.remove("shadow-inputs-danger");
        }
      }
    }
    if (seguir) {
      if (!ultimaPagina) {
        paginaActual = +paginaActual + 1;

        solicitarPagina(
          _idFormulario,
          paginaActual,
          "siguiente",
          campoSeleccionado,
          _idSucursal
        ); //aqui
      } else {
        paginaActual = +paginaActual + 1;

        //get the dataPrecios from the localstorage

        let dataPrecios = localStorage.getItem("dataPrecios");

        if (dataPrecios == null) {
          dataPrecios = [];
        }

        dataPrecios = JSON.parse(dataPrecios);

        for (i = 0; i < dataPrecios.length; i++) {
          PrecioFinal = (+PrecioFinal + +dataPrecios[i].Precio).toFixed(2);
        }

        crearPaginaPago(PrecioFinal);
      }
    }
  }
  if (e.target.matches("#btnAnterior")) {
    paginaActual = +paginaActual - 1;

    PrecioFinal = 0;

    for (i = 0; i < paginasOmitidas.length; i++) {
      let validacion = paginasOmitidas.find((pagina) => pagina == paginaActual);
      if (validacion) {
        paginaActual = paginaActual - 1;
      }
    }
    if (paginaActual == 0) {
      //cargar contador
      crearPaginaContador("regresar");
    } else {
      solicitarPagina(_idFormulario, paginaActual, "regresar", "", _idSucursal);
    }
  }
  if (e.target.classList.contains("btnStripe")) {
    generarStripe();
  }
  if (e.target.classList.contains("btnZelle")) {
    generarZelleModal();
  }
});

d.addEventListener("change", (e) => {
  if (e.target.classList.contains("inputForm")) {
    if (e.target.type != "file") {
      if (e.target.type == "checkbox") {
        let page = e.target.dataset.page;
        let inputs = d.querySelectorAll(`[data-page="${page}"]`);

        for (i = 0; i < inputs.length; i++) {
          let inputCheck = inputs[i];
          if (inputCheck.checked && inputCheck.id != e.target.id) {
            inputCheck.checked = false;
            localStorage.removeItem(inputCheck.id);
            dataPrecios = dataPrecios.filter(
              (data) => data._idCampo != inputCheck.id
            );
          }
        }
      }

      dataPrecios = dataPrecios.filter((data) => data._idCampo != e.target.id);

      if (e.target.dataset.accion == "Suma") {
        dataPrecios.push({
          _idCampo: e.target.id,
          Precio: e.target.dataset.precio,
          accion: "sumar",
        });
      } else {
        dataPrecios.push({
          _idCampo: e.target.id,
          Precio: (+e.target.dataset.precio * +e.target.value).toFixed(2),
          accion: "mutliplicar",
        });
      }

      //save the array dataprecios inside the localstorage and replace if exist
      localStorage.setItem("dataPrecios", JSON.stringify(dataPrecios));

      let data = {
        key: e.target.id,
        valor: e.target.value || e.target.checked,
        pagina: paginaActual,
        _idFormulario: _idFormulario,
      };

      localStorage.setItem(e.target.id, JSON.stringify(data));

      saveData(data, dataPrecios)


    } else {
      files = files.filter((file) => file.key != e.target.id);
      let valores = [];
      for (i = 0; i < e.target.files.length; i++) {
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[i]);
        reader.onload = function () {
          valores.push(reader.result);
          if (valores.length == e.target.files.length) {
            let data = {
              key: e.target.id,
              valor: valores,
              pagina: paginaActual,
              _idFormulario: _idFormulario,
            };
            files.push(data);
          }
        };
      }
    }
  }
});
