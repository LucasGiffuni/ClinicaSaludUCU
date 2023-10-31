const form_login_register = document.querySelector("#forms-login-register");
const form_login_css = document.querySelector("#login-form");
const form_register_css = document.querySelector("#register-form");
const background_login = document.querySelector("#button-inicio-sesion");
const background_register = document.querySelector("#button-register");

const register_form = document.getElementById("register-form");
const login_form = document.getElementById("login-form");

let nameInput = document.getElementById("name");
let lastNameInput = document.getElementById("lastName");
let birthdateInput = document.getElementById("birthdate");
let addressInput = document.getElementById("address");
let phoneInput = document.getElementById("phone");
let ciInput = document.getElementById("ci");
let passwordInput = document.getElementById("password");
let emailInput = document.getElementById("email");
let loginIdInput = document.getElementById("loginIdRegister");

const showPasswordBtn = document.getElementById("showPasswordBtn");

/* functions */
register_form.addEventListener("submit", registerForm);
/* login_form.addEventListener("submit", loginForm); */

background_login.addEventListener("click", inicioSesionSwap);
background_register.addEventListener("click", registerSwap);
window.addEventListener("resize", redimention);
showPasswordBtn.addEventListener("click", showPassword);

redimention();

/* animations */
function registerSwap() {
  if (window.innerWidth > 850) {
    form_register_css.style.display = "block";
    form_login_register.style.left = "410px";
    form_login_css.style.display = "none";
    background_register.style.opacity = "0";
    background_login.style.opacity = "1";
  } else {
    form_register_css.style.display = "block";
    form_login_register.style.left = "0px";
    form_login_css.style.display = "none";
    background_register.style.display = "none";
    background_login.style.display = "block";
    background_login.style.opacity = "1";
  }
}

function inicioSesionSwap() {
  if (window.innerWidth > 850) {
    form_login_css.style.display = "block";
    form_login_register.style.left = "10px";
    form_register_css.style.display = "none";
    background_register.style.opacity = "1";
    background_login.style.opacity = "0";
  } else {
    form_login_css.style.display = "block";
    form_login_register.style.left = "0px";
    form_register_css.style.display = "none";
    background_login.style.display = "none";
  }
}

function redimention() {
  if (window.innerWidth > 850) {
    background_register.style.display = "block";
    background_login.style.display = "block";
  } else {
    background_register.style.display = "block";
    background_register.style.opacity = "1";
    background_login.style.display = "none";
    form_login_css.style.display = "block";
    form_login_register.style.left = "0px";
    form_register_css.style.display = "none";
  }
}

/* password show */
function showPassword() {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}

/* validations */
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

function verifyData() {
  const isValidEmailInput = isValidEmail(emailInput.value);
  const isValidPasswordInput = isValidPassword(passwordInput.value);
  const isValidLoginIdInput = isValidNumeric(loginIdInput.value);
  const isValidCiInput = isValidNumeric(ciInput.value);

  if (
    nameInput.value.trim() !== "" &&
    lastNameInput.value.trim() !== "" &&
    birthdateInput.value.trim() !== "" &&
    addressInput.value.trim() !== "" &&
    phoneInput.value.trim() !== "" &&
    ciInput.value.trim() !== "" &&
    emailInput.value.trim() !== "" &&
    passwordInput.value.trim() !== "" &&
    loginIdInput.value.trim() !== "" &&
    isValidEmailInput &&
    isValidPasswordInput &&
    isValidLoginIdInput &&
    isValidCiInput
  ) {
    return true;
  } else {
    alert("Por favor, completa todos los campos correctamente.");
    return false;
  }
}

function registerForm() {
  if (verifyData) {
    // Enviar solicitud POST al backend
    fetch("/backend/endpoint_de_registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nameInput.value,
        lastName: lastNameInput.value,
        birthdate: birthdateInput.value,
        address: addressInput.value,
        phone: parseInt(phoneInput.value),
        ci: parseInt(ciInput.value),
        email: emailInput.value,
        password: passwordInput.value,
        loginId: parseInt(loginIdInput.value),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // registro existoso
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function loginForm() {}
// Código para manejar las solicitudes POST desde el formulario
document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

    // Obtener datos del formulario
    const loginId = document.getElementById("loginId").value;
    const password = document.getElementById("LoginPassword").value;

    // Enviar solicitud POST al backend
    fetch("/backend/endpoint_de_login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ loginId: loginId, password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Manejar la respuesta del backend si es necesario
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
