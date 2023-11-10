const agendaForm = document.getElementById("scheduleForm");
const submitButton = document.getElementById("schedule-btn");
let formularioEnviado = false;
const bookedSlots = {};

const documentationBtn = document.getElementById("documentation-navbar-btn");
const agendaBtn = document.getElementById("schedule-navbar-btn");

//cache
const cedulaUsuario = localStorage.getItem("userData");
const token = localStorage.getItem("token");

documentationBtn.addEventListener("click", function () {
  window.location.href = `/Frontend/${cedulaUsuario}/documentation.html`;
});

agendaBtn.addEventListener("click", function () {
  window.location.href = `/Frontend/${cedulaUsuario}/schedule.html`;
});

if (cedulaUsuario && token) {
  fetchUpdatePeriod();
} else {
  // Si no hay userData en el almacenamiento local, redirige al usuario al inicio de sesión
  window.location.href = "/logIn.html";
}

agendaForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!formularioEnviado) {
    const selectedDate = document.getElementById("schedule").value;
    const selectedHour = document.getElementById("hour").value;

    if (selectedDate && selectedHour) {
      crearAgenda(cedulaUsuario, selectedDate, selectedHour)
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
async function crearAgenda(cedula, selectedDate, selectedHour) {
  const agenda = {
    hora: selectedHour,
    dia: selectedDate,
  };

  return fetch(`/agenda/${cedula}/crearAgenda`, {
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

function scheduleAppointment(selectedDate, selectedHour) {
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

// Función para obtener y mostrar el período de actualización desde el backend
function fetchUpdatePeriod() {
  const url = "http://127.0.0.1:8080/agenda/obtenerPeriodoDeActualizacion";

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + tokenCache, //no se si se es necesario
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const nuevaFechaInicio = data.fch_inicio;
      const nuevaFechaFinal = data.fch_fin;
      const nuevoPeriodo = data.periodo; //cambiar luego, no se donde integrar

      flatpickr("#schedule", {
        minDate: nuevaFechaInicio,
        maxDate: nuevaFechaFinal,
        dateFormat: "d/m/Y",
        disable: [
          function (date) {
            const dateString = date.toISOString().split("T")[0];
            return bookedSlots[dateString];
          },
        ],
      });
    })
    .catch((error) => {
      console.error("Error al obtener el período de actualización:", error);
    });
}

/* no se si es necesario */

flatpickr("#schedule", {
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

// Controladores de eventos para cambios en el calendario y la hora
document.getElementById("calendar").addEventListener("change", checkFormValidity);
document.getElementById("hour").addEventListener("change", checkFormValidity);

// Función para habilitar o deshabilitar el botón de envío del formulario según la validez del formulario
function checkFormValidity() {
  const selectedDate = document.getElementById("calendar").value;
  const selectedHour = document.getElementById("hour").value;

  if (selectedDate && selectedHour) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}