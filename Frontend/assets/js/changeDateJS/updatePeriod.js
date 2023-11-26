document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("update-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      if (validateForm()) {
        fetchUpdatePeriod();
      }
    });

  security();

  function validateForm() {
    const periodoSelect = document.getElementById("periodo2");
    const selectedPeriodIndex = periodoSelect.selectedIndex;
    let inicialDate = document.getElementById("inicialDate2").value;
    let finalDate = document.getElementById("finalDate2").value;

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

  function security() {
    const cedulaUsuario = localStorage.getItem("userData");
    const token = localStorage.getItem("token");
    if (!cedulaUsuario || !token) {
      window.location.href = "index.html";
    } else {
      fetchObtenerPeriod();
    }
  }

  function fetchObtenerPeriod() {
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
    const periodoSelect = document.getElementById("periodo2");

    data.forEach((periodo) => {
      let option = document.createElement("option");
      option.text = `Semestre ${periodo.semestre}, Año ${periodo.year}`;
      periodoSelect.appendChild(option);
    });

    periodoSelect.addEventListener("change", function () {
      const selectedPeriodoIndex = periodoSelect.selectedIndex;
      const selectedPeriodo = data[selectedPeriodoIndex];
      console.log(selectedPeriodo);

    });
  }

  /* falta pedir el dato seleccionado y la fecha de inicio y fin*/
/*   function fetchUpdatePeriod(){
    
  } */
});
