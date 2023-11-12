const agendaForm = document.getElementById("scheduleForm");
const submitButton = document.getElementById("schedule-btn");

//cache
const cedulaUsuario = localStorage.getItem("userData");
const token = localStorage.getItem("token");

if (cedulaUsuario && token) {
  fetchUpdatePeriod();
} else {
  window.location.href = "/index.html";
}

// Función para obtener y mostrar el período de actualización desde el backend
function fetchUpdatePeriod() {
  const url = "http://127.0.0.1:8080/agenda/obtenerPeriodosActualizacion";

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      return response.json();
    })
    .then((data) => {
/*       const semestre = data.semestre;
      const year = data.anio;
      const nuevaFechaInicio = data.fch_inicio;
      const nuevaFechaFinal = data.fch_fin; */
      // Supongamos que data es la respuesta del fetch
      const listaDeObjetos = data; // Asigna la lista de objetos JSON

      // Obtener los elementos select del formulario
      const periodoSelect = document.getElementById("periodo");
      const scheduleSelect = document.getElementById("schedule");

      // Función para agregar opciones a un elemento select
      function llenarSelect(selectElement, lista, propiedad) {
        lista.forEach((item) => {
          const option = document.createElement("option");
          option.value = item; // Solo un ejemplo, ajusta esto según la estructura real de tu respuesta
          option.text = item; // Igual que arriba, ajusta según la estructura real
          selectElement.add(option);
        });
      }

      // Llenar las opciones del periodo con la propiedad 'semestre'
      llenarSelect(periodoSelect, listaDeObjetos, "semestre");

      // Llenar las opciones del schedule con la propiedad 'FechaInicio'
      llenarSelect(scheduleSelect, listaDeObjetos, "FechaInicio");
    })
    .catch((error) => {
      console.error("Error al obtener el período de actualización:", error);
    });
}
