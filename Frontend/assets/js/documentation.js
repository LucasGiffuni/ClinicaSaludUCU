const documentationForm = document.getElementById("documentationForm");

// cache
const cedulaUsuario = localStorage.getItem("userData");
const token = localStorage.getItem("token");

/* llamadas */
documentationForm.addEventListener("submit", sendFile);

/* seguridad */
if (!cedulaUsuario || !token) {
  window.location.href = "/index.html";
}

/* name file */
document
  .getElementById("documentationFile")
  .addEventListener("change", function (event) {
    const fileName = event.target.files[0].name;
    document.getElementById("nameFile").textContent = `${fileName}`;
    // Verificar el tipo de archivo al cambio
    isValidFileType(event.target.files[0].type)
      ? console.log("Tipo de archivo válido.")
      : alert("Por favor, seleccione un archivo PDF o JPEG.");
  });

/* funciones */
function sendFile() {
  // Obtener el elemento de input de archivo
  const fileInput = document.getElementById("documentationFile");
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
    return;
  } else {
    const url =
      "http://127.0.0.1:8080/funcionario/" +
      cedulaUsuario +
      "/cargarCarnetSalud";
    const carnetSaludBlob = new Blob([carnetSaludFile]);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
        Authorization: "Bearer " + token,
      },
      body: carnetSaludBlob,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Respuesta del backend:", data);
        alert("EXITO");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

// Función para verificar el tipo de archivo
function isValidFileType(fileType) {
  const allowedTypes = ["application/pdf", "image/jpeg"];
  return allowedTypes.includes(fileType);
}
