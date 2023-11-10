/* variables */
const registerForm = document.getElementById("register-form");
const showPassword = document.getElementById("showPassword");

// Campos de formulario de login
const loginIdInput = document.getElementById("loginId");
const passwordInput = document.getElementById("password");

/* llamados */
registerForm.addEventListener("submit", RegisterFormHandler);
showPassword.addEventListener("click", togglePasswordVisibility);

/* funciones */
function togglePasswordVisibility() {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}

function isValidPassword(password) {
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  return regexPassword.test(password);
}

function validateData() {
  const isValidPasswordInput = isValidPassword(passwordInput.value);

  if (loginIdInput.value.trim() != "" && isValidPasswordInput) {
    return true;
  } else {
    alert("Por favor, completa todos los campos correctamente.");
    return false;
  }
}

function RegisterFormHandler(event) {
  event.preventDefault();
  if (validateData()) {
    const url =
      "http://127.0.0.1:8080/public/register?user=" +
      loginIdInput.value.trim() +
      "&clave=" +
      passwordInput.value.trim();

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
          let token = data.jwt;
          localStorage.setItem("token", token);
          localStorage.setItem("logId", loginIdInput.value.trim());
        } else {
          console.error("Error: Token JWT no válido.");
        }
        // Aquí puedes manejar la respuesta del backend
        console.log("Respuesta del backend:", data);

        // Si todo va bien, redirigir a la página deseada
        window.location.href = "/register.html";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    alert("datos malos");
  }
}
