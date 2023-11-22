document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("scheduleForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      if (validateForm()) {
        agendarConsulta();
      }
    });

  security();

  function validateForm() {
    const periodoSelect = document.getElementById("periodo");
    const scheduleSelect = document.getElementById("schedule");
    const selectedScheduleIndex = scheduleSelect.selectedIndex;
    const selectedPeriodIndex = periodoSelect.selectedIndex;

    if (selectedPeriodIndex <= 0) {
      swal("Error", "Por favor, seleccione un periodo", "error");
      return false;
    }
    if (selectedScheduleIndex <= 0) {
      swal("Error", "Por favor, seleccione una fecha.", "error");
      return false;
    }

    return true;
  }

  function security() {
    const cedulaUsuario = localStorage.getItem("userData");
    const token = localStorage.getItem("token");

    if (!cedulaUsuario || !token) {
      window.location.href = "index.html";
    } else {
      fetchUpdatePeriod();
    }
  }

  function fetchUpdatePeriod() {
    const token = localStorage.getItem("token");

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
        swal(
          "No se pudo obtener el periodo de actualizacion",
          "Pida ayuda a soporte",
          "info"
        );
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
          let year = fechaInicio.getFullYear();
          let month = fechaInicio.getMonth();
          let day = fechaInicio.getDay();
          let nuevaFechaInicio = year + "-" + month + "-" + day;

          let option = document.createElement("option");

          option.text = nuevaFechaInicio;
          scheduleSelect.appendChild(option);

          fechaInicio.setDate(fechaInicio.getDate() + 1);
        }
      }
    });
  }

  // Función para agendar la consulta
  function agendarConsulta() {
    const cedulaUsuario = localStorage.getItem("userData");
    const token = localStorage.getItem("token");

    const scheduleSelect = document.getElementById("schedule");
    const selectedScheduleIndex = scheduleSelect.selectedIndex;
    const selectedSchedule = scheduleSelect.options[selectedScheduleIndex].text;

    const url =
      "http://127.0.0.1:8080/agenda/" +
      cedulaUsuario +
      "/crearAgenda" +
      "?fecha=" +
      selectedSchedule;

    fetch(url, {
      method: "POST",
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
          throw new Error("Error en la solicitud: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        swal(
          "Agenda realizada",
          "Usted quedo agendado para el: " + selectedSchedule,
          "success"
        );
      })
      .catch((error) => {
        console.error("Error al agendar la consulta:", error);
        swal("Fallo al agendar", "Usted ya tiene una agenda", "info");
      });
  }
});
