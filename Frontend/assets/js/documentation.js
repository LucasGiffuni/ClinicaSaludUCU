/* variables */

let carnetSaludFile = document.getElementById("documentationFile").files[0];
const submitButton = document.getElementById("documentation-btn");

//cache
const cedulaUsuario = localStorage.getItem("userData");
const token = localStorage.getItem("token");

/* llamadas */

submitButton.addEventListener("submit", sendFile);

/* seguridad */

if (cedulaUsuario && token) {
  fetchUpdatePeriod();
} else {
  window.location.href = "/logIn.html";
}

/* name file */
document
  .getElementById("documentationFile")
  .addEventListener("change", function (event) {
    const fileName = event.target.files[0].name;
    document.getElementById("nameFile").textContent = `${fileName}`;
  });

/* funciones */

function sendFile() {
  if (validarArchivo(carnetSaludFile)) {
    convertirABase64(carnetSaludFile, function (base64String) {
      const url =
        "http://127.0.0.1:8080/funcionario/" +
        cedulaUsuario +
        "/cargarCarnetSalud";

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          carnetSalud: base64String,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error en la solicitud");
          }
          return response.json();
        })
        .then((data) => {
          // Aquí puedes manejar la respuesta del backend
          console.log("Respuesta del backend:", data);
          alert("DATOS ENVIADOS CORRECTAMENTE");

          // Si todo va bien, redirigir a la página deseada
        })
        .catch((error) => {
          console.error("Error:", error);
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
