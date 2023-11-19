document.addEventListener("DOMContentLoaded", function () {
  const agendaForm = document.getElementById("scheduleForm");
  const submitButton = document.getElementById("schedule-btn");

  //cache
  const cedulaUsuario = localStorage.getItem("userData");
  const token = localStorage.getItem("token");

  if (!cedulaUsuario || !token) {
    window.location.href = "/index.html";
  }else{
    fetchUpdatePeriod()
  }

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

  function fetchObtenerCupones(year, semestre) {
    const url =
      "http://127.0.0.1:8080/agenda/obtenerFechasAgendas?anio=" +
      year +
      "&semestre=" +
      semestre;

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
        console.log(data);
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
      console.log(selectedPeriodoIndex);
      const selectedPeriodo = data[selectedPeriodoIndex];
      console.log(selectedPeriodo);
      const cupos = fetchObtenerCupones(
        selectedPeriodo.year,
        selectedPeriodo.semestre
      ); 
      console.log(cupos);

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
});
