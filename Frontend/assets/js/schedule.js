document.addEventListener("DOMContentLoaded", function () {
  const agendaForm = document.getElementById("scheduleForm");

  // Cache
  const cedulaUsuario = localStorage.getItem("userData");
  const token = localStorage.getItem("token");

  if (!cedulaUsuario || !token) {
    window.location.href = "index.html";
  } else {
    fetchUpdatePeriod();
  }

  agendaForm.addEventListener("submit", function (event) {
    event.preventDefault();
    agendarConsulta();
  });

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
        setPeriodo(data);
      })
      .catch((error) => {
        console.error("Error al obtener el período de actualización:", error);
      });
  }

  function setPeriodo(data) {
    const periodoSelect = document.getElementById("periodo");
    const scheduleSelect = document.getElementById("schedule");

    data.forEach((periodo) => {
      let option = document.createElement("option");
      option.text = `Semestre ${periodo.semestre}, Año ${periodo.year}`;
      periodoSelect.appendChild(option);
    });

    periodoSelect.addEventListener("change", function () {
      const selectedPeriodoIndex = periodoSelect.selectedIndex;
      const selectedPeriodo = data[selectedPeriodoIndex];

      // Limpiar las opciones anteriores
      scheduleSelect.innerHTML = "";

      if (selectedPeriodo) {
        const fechaInicio = new Date(selectedPeriodo.fch_Inicio);
        const fechaFin = new Date(selectedPeriodo.fch_Fin);

        let option = document.createElement("option");
        option.text = "Fecha";
        scheduleSelect.appendChild(option);

        while (fechaInicio <= fechaFin) {
          let option = document.createElement("option");
          option.text = fechaInicio.toLocaleDateString("es-ES");
          scheduleSelect.appendChild(option);

          fechaInicio.setDate(fechaInicio.getDate() + 1);
        }
      }
    });
  }

  // Función para agendar la consulta
  function agendarConsulta() {
    const scheduleSelect = document.getElementById("schedule");
    const selectedScheduleIndex = scheduleSelect.selectedIndex;
    const selectedSchedule = scheduleSelect.options[selectedScheduleIndex].text;

    const url =
      "http://127.0.0.1:8080/agenda/" + cedulaUsuario + "/crearAgenda";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        fecha: selectedSchedule,
        
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        alert("Agenda realizada para el " + selectedSchedule);
      })
      .catch((error) => {
        console.error("Error al agendar la consulta:", error);
      });
  }
});
