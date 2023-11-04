const form_login_register = document.querySelector("#forms-login-register");
const form_login = document.querySelector("#login-form");
const form_register = document.querySelector("#register-form");
const background_login = document.querySelector("#button-inicio-sesion");
const background_register = document.querySelector("#button-register");

let registerbtn = document.getElementById("registerbtn");

let nameInput = document.getElementById("name");
let lastNameInput = document.getElementById("lastiname");
let birthdateInput = document.getElementById("birthdate");
let addressInput = document.getElementById("address");
let phoneInput = document.getElementById("phone");
let ciInput = document.getElementById("ci");
let passwordInput = document.getElementById("password");
let emaiInput = document.getElementById("email");

const showPasswordBtn = document
  .getElementById("showPasswordBtn")
  .addEventListener("click", showPassword);

registerbtn.addEventListener("click", verifyData);
background_login.addEventListener("click", inicioSesionSwap);
background_register.addEventListener("click", registerSwap);
window.addEventListener("resize", redimention);

redimention();

/* animations */
function registerSwap() {
  if (window.innerWidth > 850) {
    form_register.style.display = "block";
    form_login_register.style.left = "410px";
    form_login.style.display = "none";
    background_register.style.opacity = "0";
    background_login.style.opacity = "1";
  } else {
    form_register.style.display = "block";
    form_login_register.style.left = "0px";
    form_login.style.display = "none";
    background_register.style.display = "none";
    background_login.style.display = "block";
    background_login.style.opacity = "1";
  }
}

function inicioSesionSwap() {
  if (window.innerWidth > 850) {
    form_login.style.display = "block";
    form_login_register.style.left = "10px";
    form_register.style.display = "none";
    background_register.style.opacity = "1";
    background_login.style.opacity = "0";
  } else {
    form_login.style.display = "block";
    form_login_register.style.left = "0px";
    form_register.style.display = "none";
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
    form_login.style.display = "block";
    form_login_register.style.left = "0px";
    form_register.style.display = "none";
  }
}

/* password show */
function showPassword() {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}

//totalmente roto

/* data checks */
function verifyData() {
  const regexEmail =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

  if (
    nameInput.value.trim() !== "" &&
    lastNameInput.value.trim() !== "" &&
    birthdateInput.value.trim() !== "" &&
    addressInput.value.trim() !== "" &&
    phoneInput.value.trim() !== "" &&
    ciInput.value.trim() !== "" &&
    emaiInput.value.trim() !== "" &&
    passwordInput.value.trim() !== "" &&
    regexEmail.test(email) &&
    regexPassword.test(password)
  ) {
    // Todos los datos son válidos y no están vacíos
    // enviar el formulario
  } else {
    alert("Por favor, completa todos los campos correctamente.");
  }
}
