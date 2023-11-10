/* variables */

let carnetSaludFile = document.getElementById("documentationFile").files[0];
const submitButton = document.getElementById("documentation-btn");

const documentationBtn = document.getElementById("documentation-navbar-btn");
const agendaBtn = document.getElementById("agenda-navbar-btn");

//cache
const userData = JSON.parse(localStorage.getItem("userData"));
const cedulaUsuario = userData.cedula;

/* llamadas */
documentationBtn.addEventListener("click", function () {
  window.location.href = `/Frontend/${dataUser}/documentation.html`;
});

agendaBtn.addEventListener("click", function () {
  window.location.href = `/Frontend/${dataUser}/agenda.html`;
});

submitButton.addEventListener("submit", sendFile);

/* funciones */

function sendFile() {
  if (validarArchivo(carnetSaludFile)) {
    convertirABase64(carnetSaludFile, function (base64String) {
      // Realizar la solicitud POST con la cadena base64 en el cuerpo de la solicitud
      fetch(`/funcionario/${cedulaUsuario}/cargarCarnetSalud`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carnetSalud: base64String,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Respuesta del servidor:", data);
          data.response.defaultResponse.code = "200";
          alert("datos enviados corectamente");
        })
        .catch((error) => {
          console.error("Error al enviar la solicitud:", error);
        });
    });
  } else {
    alert(
      "Tipo de archivo no permitido. Por favor, elige una imagen JPG o un archivo PDF."
    );
  }
}

// Función para verificar el tipo de archivo
function validarArchivo(archivo) {
  const tiposPermitidos = ["image/jpg", "application/pdf"];
  return tiposPermitidos.includes(archivo.type);
}

// Función para convertir el archivo en una cadena base64
function convertirABase64(archivo, callback) {
  const reader = new FileReader();
  reader.onloadend = function () {
    callback(reader.result);
  };
  reader.readAsDataURL(archivo);
}
