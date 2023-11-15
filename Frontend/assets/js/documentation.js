/* variables */
let carnetSaludFile = document.getElementById("documentationFile").files[0];
const documentationForm = document.getElementById("documentationForm");

// cache
const cedulaUsuario = localStorage.getItem("userData");
const token = localStorage.getItem("token");

// Definir tipos permitidos
const tiposPermitidos = ["image/jpeg", "application/pdf"];

/* llamadas */
documentationForm.addEventListener("submit", function (event) {
  sendFile();
});

/* seguridad */
if (cedulaUsuario && token) {
  // todo bien maestro
} else {
  window.location.href = "/index.html";
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
  if (true /* validarArchivo(carnetSaludFile) */) {
    const url =
      "http://127.0.0.1:8080/funcionario/" +
      cedulaUsuario +
      "/cargarCarnetSalud";

    let formData = new FormData();
    formData.append("carnetSalud", carnetSaludFile);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
        Authorization: "Bearer " + token,
      },
      body: { carnetSalud: formData },
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
  } else {
    alert(
      "Tipo de archivo no permitido. Por favor, elige una imagen JPG o un archivo PDF."
    );
  }
}

// Función para verificar el tipo de archivo
function validarArchivo(archivo) {
  // Verificar si el archivo está definido y tiene la propiedad 'type'
  return archivo && archivo.type && tiposPermitidos.includes(archivo.type);
}
