/* variables */
const registerForm = document.getElementById("register-form");
const showPassword = document.getElementById("showPassword");

// Campos de formulario de registro
const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("lastName");
const birthdateInput = document.getElementById("birthdate");
const addressInput = document.getElementById("address");
const phoneInput = document.getElementById("phone");
const ciInput = document.getElementById("ci");
const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");
const loginIdInput = document.getElementById("loginId");

//cache
const logIdCache = localStorage.getItem("logId");
const tokenCache = localStorage.getItem("token");

/* llamados */
registerForm.addEventListener("submit", registerFormHandler);

/* seguridad */
if (logIdCache && tokenCache) {
  //nice to meet you
} else {
  // Si no hay userData en el almacenamiento local, redirige al usuario al inicio de sesión
  window.location.href = "/registerUser.html";
}

/* funciones */
function togglePasswordVisibility() {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}

function isValidEmail(email) {
  const regexEmail =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  return regexEmail.test(email);
}

function isValidNumeric(value) {
  const regexNumeric = /^[0-9]+$/;
  return regexNumeric.test(value);
}

function validateCi(ci) {
  ci = clean_ci(ci);
  const dig = ci[ci.length - 1];
  ci = ci.replace(/[0-9]$/, "");
  return dig == validationDigit(ci);
}

function clean_ci(ci) {
  return ci.replace(/\D/g, "");
}

function validationDigit(ci) {
  var a = 0;
  var i = 0;
  if (ci.length <= 6) {
    for (i = ci.length; i < 7; i++) {
      ci = "0" + ci;
    }
  }
  for (i = 0; i < 7; i++) {
    a += (parseInt("2987634"[i]) * parseInt(ci[i])) % 10;
  }
  if (a % 10 === 0) {
    return 0;
  } else {
    return 10 - (a % 10);
  }
}

function validateData() {
  const isValidEmailInput = isValidEmail(emailInput.value);
  const isValidCiInput = validateCi(ciInput.value);
  const isValidPhone = isValidNumeric(phoneInput.value);

  if (isValidEmailInput && isValidCiInput && isValidPhone) {
    return true;
  } else {
    alert("Por favor, completa todos los campos correctamente.");
    return false;
  }
}

function registerFormHandler(event) {
  event.preventDefault();

  if (validateData()) {
    const url =
      "http://127.0.0.1:8080/funcionario/" +
      ciInput.value +
      "/createFuncionario";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokenCache,
      },
      body: JSON.stringify({
        Nombre: nameInput.value.trim(),
        Apellido: lastNameInput.value.trim(),
        Fch_Nacimiento: birthdateInput.value,
        Direccion: addressInput.value,
        Telefono: phoneInput.value.trim(),
        Email: emailInput.value.trim(),
        LogId: logIdCache,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        return response.json();
      })
      .then((data) => {
        // Aquí puedes manejar la respuesta del backend
        console.log("Respuesta del backend:", data);

        // Si todo va bien, redirigir a la página deseada
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    alert("datos malos");
  }
}
