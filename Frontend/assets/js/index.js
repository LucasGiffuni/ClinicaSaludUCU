/* variables */
const loginForm = document.getElementById("login-form");
const showPassword = document.getElementById("showPassword");

// Campos de formulario de login
const loginIdInput = document.getElementById("loginId");
const passwordInput = document.getElementById("password");

/* llamados */
loginForm.addEventListener("submit", loginFormHandler);
showPassword.addEventListener("click", togglePasswordVisibility);

/* funciones */
function togglePasswordVisibility() {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    showPassword.src = "assets/img/hide.png";
  } else {
    passwordInput.type = "password";
    showPassword.src = "assets/img/show.png";
  }
}

function validateData() {
  if (loginIdInput.value.trim() != "" && passwordInput.value.trim != "") {
    return true;
  } else {
    alert("Por favor, completa todos los campos correctamente.");
    return false;
  }
}

function loginFormHandler(event) {
  event.preventDefault();
  if (validateData()) {
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
          localStorage.setItem("token", data.jwt);
          localStorage.setItem("userData", data.cedula);
        } else {
          console.error("Error: Token JWT no válido.");
        }
        console.log("Respuesta del backend:", data);
        // Si todo va bien, redirigir a la página deseada
        window.location.href = "schedule.html";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    alert("datos malos");
  }
}
