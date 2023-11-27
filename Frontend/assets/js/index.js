document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("login-form")
    .addEventListener("submit", loginFormHandler);

  function loginFormHandler(event) {
    event.preventDefault();

    const loginIdInput = document.getElementById("loginId");
    const passwordInput = document.getElementById("password");

    const url =
      "http://127.0.0.1:8080/public/login?user=" +
      loginIdInput.value.trim() +
      "&clave=" +
      passwordInput.value.trim();

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.jwt) {
          localStorage.setItem("logId", loginIdInput.value);
          localStorage.setItem("token", data.jwt);
          localStorage.setItem("userData", data.cedula);
          console.log("Respuesta del backend:", data);
          window.location.href = "schedule.html";
        } else {
          console.error("Error: Token JWT no válido.");
          swal(
            "Datos invalidos",
            "Ingrese un Login id y contraseña valida",
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        swal(
          "Datos invalidos",
          "Ingrese un Login id y contraseña valida",
          "error"
        );
      });
  }
});
