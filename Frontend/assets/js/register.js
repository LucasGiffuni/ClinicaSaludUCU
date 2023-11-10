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

/* llamados */
registerForm.addEventListener("submit", registerFormHandler);
showPassword.addEventListener("click", togglePasswordVisibility);

/* funciones */
function togglePasswordVisibility() {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}

function isValidEmail(email) {
  const regexEmail =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  return regexEmail.test(email);
}

function isValidPassword(password) {
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  return regexPassword.test(password);
}

function isValidNumeric(value) {
  const regexNumeric = /^[0-9]+$/;
  return regexNumeric.test(value);
}

function validateCi(ci) {
  ci = cleanCi(ci);
  const dig = ci[ci.length - 1];
  ci = ci.replace(/[0-9]$/, "");
  return dig == validationDigit(ci);
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
  const isValidPasswordInput = isValidPassword(passwordInput.value);
  const isValidLoginIdInput = isValidNumeric(loginIdInput.value);
  const isValidCiInput = validateCi(ciInput.value);
  const isValidPhone = isValidNumeric(phoneInput.value);

  if (
    isValidEmailInput &&
    isValidPasswordInput &&
    isValidLoginIdInput &&
    isValidCiInput &&
    isValidPhone
  ) {
    return true;
  } else {
    alert("Por favor, completa todos los campos correctamente.");
    return false;
  }
}

function registerFormHandler(event) {
  event.preventDefault();
  if (validateData()) {
    fetch("/funcionario/" + ciInput.value + "/createFuncionario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Nombre: nameInput.value.trim(),
        Apellido: lastNameInput.value.trim(),
        Fch_Nacimineto: birthdateInput.value,
        Direccion: addressInput.value,
        Telefono: phoneInput.value.trim(),
        Mail: emailInput.value.trim(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Registro exitoso
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
