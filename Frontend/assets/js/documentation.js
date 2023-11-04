let carnetSaludFile = document.getElementById("documentationFile").files[0];

const submitButton = document.getElementById("submitButton");

submitButton.addEventListener("submit", sendFile);

function sendFile() {
  var ci = document.getElementById("ci").value;
  var carnetSaludFile = document.getElementById("documentationFile").files[0];

  if (validarArchivo(carnetSaludFile)) {
    convertirABase64(carnetSaludFile, function (base64String) {
      // Realizar la solicitud POST con la cadena base64 en el cuerpo de la solicitud
      fetch(`/funcionario/${ci}/cargarCarnetSalud`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ci: ci,
          carnetSalud: base64String,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Respuesta del servidor:", data);
          data.response.defaultResponse.code = "200";
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
  const tiposPermitidos = ["image/jpeg", "image/png", "application/pdf"];
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
