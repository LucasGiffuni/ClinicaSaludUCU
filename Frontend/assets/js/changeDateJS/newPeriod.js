document
  .getElementById("date-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    if (validateForm()) {
      fetchAgregarDate();
    }
  });

  security();

function security() {
  const cedulaUsuario = localStorage.getItem("userData");
  const token = localStorage.getItem("token");
  const admin = localStorage.getItem("logId");
  if (!cedulaUsuario || !token || admin !== "admin") {
    window.location.href = "index.html";
  }
}

function validateForm() {
  const periodoSelect = document.getElementById("periodo");
  const selectedPeriodIndex = periodoSelect.selectedIndex;
  let inicialDate = document.getElementById("inicialDate").value;
  let finalDate = document.getElementById("finalDate").value;

  if (selectedPeriodIndex <= 0) {
    swal("Error", "Por favor, seleccione un periodo", "error");
    return false;
  }

  if (!inicialDate) {
    swal("Error", "Por favor, seleccione una fecha inicial", "error");
    return false;
  }

  if (!finalDate) {
    swal("Error", "Por favor, seleccione una fecha final", "error");
    return false;
  }

  inicialDate = new Date(inicialDate);
  finalDate = new Date(finalDate);

  if (finalDate < inicialDate) {
    swal("Error", "La fecha final es anterior a la de inicio", "error");
    return;
  }

  return true;
}

function fetchAgregarDate() {
  const periodoSelect = document.getElementById("periodo").value;
  let inicialDate = document.getElementById("inicialDate").value;
  let finalDate = document.getElementById("finalDate").value;

  inicialDate = new Date(inicialDate).toISOString().split("T")[0];
  finalDate = new Date(finalDate).toISOString().split("T")[0];
  let year = new Date(inicialDate).getFullYear();

  const token = localStorage.getItem("token");

  const url = "http://127.0.0.1:8080/agenda/cargarPeriodoActualizacion";

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
      Year: year,
      Semestre: periodoSelect,
      Fch_Inicio: inicialDate,
      Fch_Fin: finalDate,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      return response.json();
    })
    .then((data) => {
      swal(
        "Nuevo periodo cargado",
        "nuevo periodo: " + inicialDate + " al " + finalDate,
        "success"
      );
    })
    .catch((error) => {
      console.error("Error al obtener el período de actualización:", error);
      swal(
        "No se pudo obtener el periodo de actualizacion",
        "Pida ayuda a soporte",
        "info"
      );
    });
}
