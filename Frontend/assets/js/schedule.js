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
    const selectedPeriodIndex = periodoSelect.selectedIndex;

    if (selectedPeriodIndex <= 0) {
      swal("Error", "Por favor, seleccione un periodo", "error");
      return false;
    }

    const selectedDate = flatpickrInstance.selectedDates[0];
    if (!selectedDate) {
      swal("Error", "Por favor, seleccione una fecha", "error");
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
  // Declara una variable global para almacenar la instancia de Flatpickr
  let flatpickrInstance;

  function setPeriodo(data) {
    const periodoSelect = document.getElementById("periodo");
    const scheduleContainer = document.getElementById("scheduleContainer");

    data.forEach((periodo) => {
      let option = document.createElement("option");
      option.text = `Semestre ${periodo.semestre}, Año ${periodo.year}`;
      periodoSelect.appendChild(option);
    });

    periodoSelect.addEventListener("change", function () {
      const selectedPeriodoIndex = periodoSelect.selectedIndex;
      const selectedPeriodo = data[selectedPeriodoIndex];

      if (selectedPeriodo) {
        const fechaInicio = new Date(selectedPeriodo.fch_Inicio);
        const fechaFin = new Date(selectedPeriodo.fch_Fin);

        if (flatpickrInstance) {
          flatpickrInstance.destroy();
        }

        const existingInputElement = document.getElementById("schedule");
        if (existingInputElement) {
          scheduleContainer.removeChild(existingInputElement);
        }

        let inputElement = document.createElement("input");
        inputElement.type = "text";
        inputElement.id = "schedule";
        inputElement.required = true;
        scheduleContainer.appendChild(inputElement);

        flatpickrInstance = flatpickr(inputElement, {
          dateFormat: "Y-m-d",
          minDate: fechaInicio,
          maxDate: fechaFin,
        });
      }
    });
  }

  // Función para agendar la consulta
  function agendarConsulta() {
    const cedulaUsuario = localStorage.getItem("userData");
    const token = localStorage.getItem("token");

    // Obtiene la fecha seleccionada de la instancia de Flatpickr
    const selectedDate = flatpickrInstance.selectedDates[0];
    const formattedDate = selectedDate
      ? flatpickrInstance.formatDate(selectedDate, "Y-m-d")
      : "";

    console.log(formattedDate);
    const url =
      "http://127.0.0.1:8080/agenda/" +
      cedulaUsuario +
      "/crearAgenda" +
      "?fecha=" +
      formattedDate;

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
          "Usted quedo agendado para el: " + formattedDate,
          "success"
        );
      })
      .catch((error) => {
        console.error("Error al agendar la consulta:", error);
        swal("Fallo al agendar", "Usted ya tiene una agenda", "info");
      });
  }
});
