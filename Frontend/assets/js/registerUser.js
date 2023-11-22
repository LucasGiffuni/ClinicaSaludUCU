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
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    showPassword.src = "assets/img/hide.png";
  } else {
    passwordInput.type = "password";
    showPassword.src = "assets/img/show.png";
  }
}

function isValidPassword(password) {
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

  if (regexPassword.test(password)) {
    swal(
      "Contraseña invalida",
      "Ingrese una contraseña con 8 caracteres, una mayuscula y un numero como minimo",
      "error"
    );
  }
  return regexPassword.test(password);
}

function isValidLogId(logId) {
  const regexLogIn = /^[A-Z]+$/i;
  
  if (regexLogIn.test(logId)) {
    swal("Login ID invalido", "Ingrese un Login ID solo con letras", "error");
  }
  return regexLogIn.test(logId);
}

function validateData() {
  const isValidPasswordInput = isValidPassword(passwordInput.value);
  const isValidLogIdInput = isValidLogId(loginIdInput.value);

  if (
    loginIdInput.value.trim() != "" &&
    isValidPasswordInput &&
    isValidLogIdInput
  ) {
    return true;
  } else {
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
        console.log("Respuesta del backend:", data);
        window.location.href = "registerFuncionario.html";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
