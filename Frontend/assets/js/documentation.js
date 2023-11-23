document.addEventListener("DOMContentLoaded", function () {
  // Obtiene el formulario de documentación y agrega un listener para el evento de envío
  document
    .getElementById("documentationForm")
    .addEventListener("submit", sendFileHandler);

  // Verifica la seguridad del usuario basándose en la existencia de datos en el almacenamiento local
  security();

  function security() {
    const cedulaUsuario = localStorage.getItem("userData");
    const token = localStorage.getItem("token");

    if (!cedulaUsuario || !token) {
      window.location.href = "index.html";
    }
  }

  // Función que verifica si el tipo de archivo es válido (PDF o JPEG)
  function isValidFileType(fileType) {
    const allowedTypes = ["application/pdf", "image/jpeg"];
    return allowedTypes.includes(fileType);
  }

  // Maneja el evento de envío del formulario, procesa los archivos y realiza llamadas asincrónicas al servidor
  async function sendFileHandler(event) {
    event.preventDefault();
    const cedulaUsuario = localStorage.getItem("userData");
    const token = localStorage.getItem("token");

    //Toma el primer elemento de los archivos subidos
    let fileInput = document.getElementById("documentationFile");
    const carnetSaludFile = fileInput.files[0];

    // Verifica la existencia del archivo y su tipo
    if (!carnetSaludFile || !isValidFileType(carnetSaludFile.type)) {
      swal("Error", "Por favor, seleccione un archivo PDF o JPEG.", "error");
      return;
    } else {
      // Realiza llamadas asincrónicas para enviar datos y archivos al servidor
      await fetchData(cedulaUsuario, token);
      await fetchComprobante(carnetSaludFile, cedulaUsuario, token);
    }
  }

  // Realiza una llamada al servidor para enviar datos relacionados con la Fch_Emision y Fch_Vencimiento
  async function fetchData(cedulaUsuario, token) {
    let fechaVencimiento = document.getElementById("fechaVencimiento");
    let fechaEmision = document.getElementById("fechaEmision");
    const url =
      "http://127.0.0.1:8080/funcionario/" +
      cedulaUsuario +
      "/cargarCarnetSalud";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        Fch_Emision: fechaEmision.value,
        Fch_Vencimiento: fechaVencimiento.value,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Respuesta del backend:", data);
        swal(
          "",
          "Su Fch_Emision y Fch_Vencimiento han sido ingresadas con exito",
          "success"
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Realiza una llamada al servidor para enviar datos relacionados con la documentacion blob
  async function fetchComprobante(comprobante, cedulaUsuario, token) {
    const carnetSaludBlob = new Blob([comprobante]);
    const aux = await carnetSaludBlob.text();
    /*     console.log(aux);
     */
    const url =
      "http://127.0.0.1:8080/funcionario/" +
      cedulaUsuario +
      "/cargarComprobante";
    fetch(url, {
      method: "POST",
      body: JSON.stringify(aux),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Respuesta del backend:", data);
        swal("Su documentacion ha sido ingresa con exito", "", "success");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});
