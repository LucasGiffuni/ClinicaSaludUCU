let carnetSaludFile = document.getElementById("documentationFile").files[0];

const submitButton = document.getElementById("submitButton");

const documentationBtn = document.getElementById("documentation-btn");
const agendaBtn = document.getElementById("agenda-btn");

const userData = JSON.parse(localStorage.getItem("userData"));

documentationBtn.addEventListener("click", function () {
  window.location.href = `http://127.0.0.1:5500/Frontend/${dataUser}/documentation.html`;
});

agendaBtn.addEventListener("click", function () {
  window.location.href = `http://127.0.0.1:5500/Frontend/${dataUser}/agenda.html`;
});

submitButton.addEventListener("submit", sendFile);

function sendFile() {
  if (validarArchivo(carnetSaludFile)) {
    convertirABase64(carnetSaludFile, function (base64String) {
      // Realizar la solicitud POST con la cadena base64 en el cuerpo de la solicitud
      fetch(`/funcionario/${userData.cedula}/cargarCarnetSalud`, {
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
    console.error(
      "Tipo de archivo no permitido. Por favor, elige una imagen (JPEG o PNG) o un archivo PDF."
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
