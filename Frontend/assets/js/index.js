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
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}

function isValidPassword(password) {
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  return regexPassword.test(password);
}

function isValidNumeric(value) {
  const regexNumeric = /^[0-9]+$/;
  return regexNumeric.test(value);
}

function validateData() {
  const isValidLoginIdInput = isValidNumeric(loginIdInput.value);
  const isValidPasswordInput = isValidPassword(passwordInput.value);

  if (isValidLoginIdInput && isValidPasswordInput) {
    return true;
  } else {
    alert("Por favor, completa todos los campos correctamente.");
    return false;
  }
}

function loginFormHandler(event) {
  event.preventDefault();
  if (validateData("login")) {
    fetch("/public/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginId: loginIdInput.value.trim(),
        password: passwordInput.value.trim(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.jwt) {
          // Almacena el token JWT en el almacenamiento local del navegador
          localStorage.setItem("token", data.jwt);

          const userData = data.jwt;
          localStorage.setItem("userData", JSON.stringify(userData));

          // Redirige a la página de agenda con la cédula en la URL
          window.location.href = `/Frontend/${userData.cedula}/agenda.html`;
        } else {
          console.error("Error: Token JWT no válido.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
