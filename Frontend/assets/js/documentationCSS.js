document
  .getElementById("documentationFile")
  .addEventListener("change", function (event) {
    const fileName = event.target.files[0].name;
    document.getElementById("nameFile").textContent = `${fileName}`;
    // Verificar el tipo de archivo al cambio
    isValidFileType(event.target.files[0].type)
      ? console.log("Tipo de archivo válido.")
      : swal("Error", "Por favor, seleccione un archivo PDF o JPEG.", "error");
  });
