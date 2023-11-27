document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#report-btn").onclick = async () => {
    try {
      const contenido = await fetchGeneratePeriod();
      if (contenido.length > 0) {
        guardarArchivoDeTexto(JSON.stringify(contenido), "reporte.txt");
      } else {
        console.warn("La respuesta del servidor está vacía");
      }
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      swal("Error al generar el reporte", "Pida ayuda a soporte", "info");
    }
  };

  function guardarArchivoDeTexto(contenido, nombre) {
    const a = document.createElement("a");
    const archivo = new Blob([contenido], { type: "text/plain" });
    const url = URL.createObjectURL(archivo);
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
  }

  security();

  function security() {
    const cedulaUsuario = localStorage.getItem("userData");
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("logId");
    if (!cedulaUsuario || !token || admin !== "admin") {
      window.location.href = "index.html";
    }
  }

  async function fetchGeneratePeriod() {
    const token = localStorage.getItem("token");

    const url = "http://127.0.0.1:8080/funcionario/obtenerReporte";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }

    const data = await response.json();
    console.log(data.funcionarios);
    return data.funcionarios;
  }
});
