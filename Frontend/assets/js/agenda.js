document.addEventListener("DOMContentLoaded", function () {
  let agendaForm = document.getElementById("agendaForm");
  let submitButton = document.getElementById("submitButton");
  let formularioEnviado = false;

  const bookedSlots = {}; // Objeto para realizar un seguimiento de las fechas y horas agendadas

  agendaForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!formularioEnviado) {
      schedule();
      formAlreadySent();
    } else {
      alert("¡Ya te haz agendado!");
    }
  });

  function formAlreadySent() {
    formularioEnviado = true;
    submitButton.disabled = true; // Deshabilitar el botón después de enviar el formulario
  }

  flatpickr("#calendar", {
    minDate: "2023/11/01",
    maxDate: "2023/11/18",
    dateFormat: "d/m/y",
    disable: [
      function (date) {
        const dateString = date.toISOString().split("T")[0];
        return bookedSlots[dateString];
      },
    ],
  });

  // Agrega event listeners para detectar cambios en la fecha y la hora
  document
    .getElementById("calendar")
    .addEventListener("change", enableSubmitButton);
  document
    .getElementById("hour")
    .addEventListener("change", enableSubmitButton);

  function enableSubmitButton() {
    // Habilita el botón de submit si se ha seleccionado una fecha y una hora
    const selectedDate = document.getElementById("calendar").value;
    const selectedHour = document.getElementById("hour").value;
    if (selectedDate && selectedHour) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  }

  function schedule() {
    const selectedDate = document.getElementById("calendar").value;
    const selectedHour = document.getElementById("hour").value;

    // Verificar si la hora está disponible
    if (!bookedSlots[selectedDate]) {
      bookedSlots[selectedDate] = [];
    }

    if (!bookedSlots[selectedDate].includes(selectedHour)) {
      bookedSlots[selectedDate].push(selectedHour);

      // Eliminar la opción del campo de selección de hora
      const hourSelect = document.getElementById("hour");
      const optionToRemove = hourSelect.querySelector(
        `option[value="${selectedHour}"]`
      );
      hourSelect.removeChild(optionToRemove);

      alert(
        "Fecha seleccionada: " +
          selectedDate +
          " Hora seleccionada: " +
          selectedHour
      );
    } else {
      alert("¡Lo siento! Esta hora ya está agendada.");
    }
  }
});
