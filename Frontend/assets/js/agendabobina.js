document.addEventListener("DOMContentLoaded", function () {
    const agendaForm = document.getElementById("scheduleForm");
    const submitButton = document.getElementById("schedule-btn");
  
    // Cache
    const cedulaUsuario = localStorage.getItem("userData");
    const token = localStorage.getItem("token");
  
    if (cedulaUsuario && token) {
      fetchUpdatePeriod();
    } else {
      window.location.href = "/index.html";
    }
  
    async function fetchUpdatePeriod() {
      const url = "http://127.0.0.1:8080/agenda/obtenerPeriodosActualizacion";
  
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            Authorization: "Bearer " + token,
          },
        });
  
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
  
        const data = await response.json();
        console.log(data);
        setPeriodo(data);
      } catch (error) {
        console.error("Error al obtener el período de actualización:", error);
      }
    }
  
    async function fetchObtenerCupones(year, semestre) {
      const url = `http://127.0.0.1:8080/agenda/obtenerFechasAgendas?anio=${year}&semestre=${semestre}`;
  
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            Authorization: "Bearer " + token,
          },
        });
  
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
  
        const data = await response.json();
        console.log(data);
        return data;
      } catch (error) {
        console.error("Error al obtener los cupos:", error);
        return [];
      }
    }
  
    function setPeriodo(data) {
      const periodoSelect = document.getElementById("periodo");
      const scheduleSelect = document.getElementById("schedule");
  
      data.forEach((periodo) => {
        let option = document.createElement("option");
        option.text = `Semestre ${periodo.semestre}, Año ${periodo.year}`;
        periodoSelect.appendChild(option);
      });
  
      periodoSelect.addEventListener("change", async function () {
        const selectedPeriodoIndex = periodoSelect.selectedIndex;
        const selectedPeriodo = data[selectedPeriodoIndex];
  
        // Limpiar las opciones anteriores
        scheduleSelect.innerHTML = "";
  
        if (selectedPeriodo) {
          let cupos = await fetchObtenerCupones(selectedPeriodo.year, selectedPeriodo.semestre);
  
          if (cupos.length > 0) {
            let option = document.createElement("option");
            option.text = "Fecha";
            scheduleSelect.appendChild(option);
  
            cupos.forEach((fecha) => {
              option = document.createElement("option");
              option.text = new Date(fecha).toLocaleDateString("es-ES");
              scheduleSelect.appendChild(option);
            });
          }
        }
      });
    }
  });
  