document.addEventListener("DOMContentLoaded", function () {
  const agendaForm = document.getElementById("agendaForm");
  const submitButton = document.getElementById("submitButton");
  let formularioEnviado = false;
  const bookedSlots = {};

  agendaForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!formularioEnviado) {
      const selectedDate = document.getElementById("calendar").value;
      const selectedHour = document.getElementById("hour").value;
      const ci = "cedula que no se de donde saco";

      if (selectedDate && selectedHour) {
        crearAgenda(ci, selectedDate, selectedHour)
          .then(() => {
            scheduleAppointment(selectedDate, selectedHour);
            disableFormSubmission();
          })
          .catch((error) => {
            alert(
              "Error al crear la agenda. Por favor, inténtalo de nuevo más tarde."
            );
            console.error("Error al crear la agenda:", error);
          });
      }
    } else {
      alert("¡Ya tienes una cita agendada!");
    }
  });

  // Función para crear la agenda en el backend
  async function crearAgenda(ci, selectedDate, selectedHour) {
    const agenda = {
      hora: selectedHour,
      dia: selectedDate,
    };

    return fetch(`/agenda/${ci}/crearAgenda`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(agenda),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Error al crear la agenda");
      })
      .then((responseData) => {
        console.log("Agenda creada exitosamente:", responseData);
        return responseData;
      })
      .catch((error) => {
        console.error("Error al crear la agenda:", error);
        throw error;
      });
  }

  function disableFormSubmission() {
    formularioEnviado = true;
    submitButton.disabled = true;
  }

  flatpickr("#calendar", {
    minDate: "2023-11-01",
    maxDate: "2023-11-18",
    dateFormat: "d/m/Y",
    disable: [
      function (date) {
        const dateString = date.toISOString().split("T")[0];
        return bookedSlots[dateString];
      },
    ],
  });

  function fetchUpdatePeriod() {
    fetch("/agenda/obtenerPeriodoDeActualizacion", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const nuevaFechaInicio = data.fch_inicio;
        const nuevaFechaFinal = data.fch_fin;

        document.getElementById("fechaInicio").innerText = nuevaFechaInicio;
        document.getElementById("fechaFinal").innerText = nuevaFechaFinal;
      })
      .catch((error) => {
        console.error("Error al obtener el período de actualización:", error);
      });
  }

  document
    .getElementById("calendar")
    .addEventListener("change", checkFormValidity);
  document.getElementById("hour").addEventListener("change", checkFormValidity);

  function checkFormValidity() {
    const selectedDate = document.getElementById("calendar").value;
    const selectedHour = document.getElementById("hour").value;

    if (selectedDate && selectedHour) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  }

  function scheduleAppointment() {
    const selectedDate = document.getElementById("calendar").value;
    const selectedHour = document.getElementById("hour").value;

    if (!bookedSlots[selectedDate]) {
      bookedSlots[selectedDate] = [];
    }

    if (!bookedSlots[selectedDate].includes(selectedHour)) {
      bookedSlots[selectedDate].push(selectedHour);

      const hourSelect = document.getElementById("hour");
      const optionToRemove = hourSelect.querySelector(
        `option[value="${selectedHour}"]`
      );
      hourSelect.removeChild(optionToRemove);

      alert("Cita agendada para el " + selectedDate + " a las " + selectedHour);
    } else {
      alert("¡Lo siento! Esta hora ya está ocupada.");
    }
  }

  fetchUpdatePeriod();
});
