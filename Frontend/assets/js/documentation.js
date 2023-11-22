const documentationForm = document.getElementById("documentationForm");

// cache
const cedulaUsuario = localStorage.getItem("userData");
const token = localStorage.getItem("token");

/* llamadas */
documentationForm.addEventListener("submit", sendFile);

/* seguridad */
if (!cedulaUsuario || !token) {
  window.location.href = "index.html";
}

/* funciones */
function sendFile(event) {
  event.preventDefault();
  // Obtener el elemento de input de archivo
  let fileInput = document.getElementById("documentationFile");
  let fechaVencimiento = document.getElementById("fechaVencimiento");
  let fechaEmision = document.getElementById("fechaEmision");
  // Obtener el archivo seleccionado
  const carnetSaludFile = fileInput.files[0];

  // Verificar si se seleccionó un archivo
  if (!carnetSaludFile) {
    alert("Por favor, seleccione un archivo.");
    return;
  }

  // Verificar el tipo de archivo (PDF o JPEG)
  if (!isValidFileType(carnetSaludFile.type)) {
    alert("Por favor, seleccione un archivo PDF o JPEG.");
  } else {
    const urlData =
      "http://127.0.0.1:8080/funcionario/" +
      cedulaUsuario +
      "/cargarCarnetSalud";

    const urlBlob =
      "http://127.0.0.1:8080/funcionario/" +
      cedulaUsuario +
      "/cargarCarnetSalud";

    const carnetSaludBlob = new Blob([carnetSaludFile]);

    console.log(carnetSaludBlob);
    console.log(fechaVencimiento.value);
    console.log(fechaEmision.value);

    fetch(urlBlob, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        Comprobante: carnetSaludBlob,
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
        alert("comprobante enviado bien");
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    fetch(urlData, {
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
        alert("data enviada bien");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function isValidFileType(fileType) {
  const allowedTypes = ["application/pdf", "image/jpeg"];
  return allowedTypes.includes(fileType);
}
