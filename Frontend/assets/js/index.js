const form_css = document.querySelector("#forms");
const form_login_css = document.querySelector("#login-form");
const form_register_css = document.querySelector("#register-form");
const background_login_css = document.querySelector("#background-login-btn");
const background_register_css = document.querySelector(
  "#background-register-btn"
);

const register_form = document.getElementById("register-form");
const login_form = document.getElementById("login-form");

/* register */
let nameInput = document.getElementById("name");
let lastNameInput = document.getElementById("lastName");
let birthdateInput = document.getElementById("birthdate");
let addressInput = document.getElementById("address");
let phoneInput = document.getElementById("phone");
let ciInput = document.getElementById("ci");
let passwordInput = document.getElementById("password-register");
let emailInput = document.getElementById("email");
let loginIdInput = document.getElementById("loginId-Register");

/* login */
let loginIdInputLogin = document.getElementById("loginId-login");
let passwordInputLogin = document.getElementById("password-login");

const showPasswordBtn = document.getElementById("showPasswordBtn");

/* functions */
register_form.addEventListener("submit", registerForm);
login_form.addEventListener("submit", loginForm);

background_login_css.addEventListener("click", inicioSesionSwap);
background_register_css.addEventListener("click", registerSwap);
window.addEventListener("resize", redimention);
showPasswordBtn.addEventListener("click", showPassword);

redimention();

/* animations */
function registerSwap() {
  if (window.innerWidth > 850) {
    form_register_css.style.display = "block";
    form_css.style.left = "410px";
    form_login_css.style.display = "none";
    background_register_css.style.opacity = "0";
    background_login_css.style.opacity = "1";
  } else {
    form_register_css.style.display = "block";
    form_css.style.left = "0px";
    form_login_css.style.display = "none";
    background_register_css.style.display = "none";
    background_login_css.style.display = "block";
    background_login_css.style.opacity = "1";
  }
}

function inicioSesionSwap() {
  if (window.innerWidth > 850) {
    form_login_css.style.display = "block";
    form_css.style.left = "10px";
    form_register_css.style.display = "none";
    background_register_css.style.opacity = "1";
    background_login_css.style.opacity = "0";
  } else {
    form_login_css.style.display = "block";
    form_css.style.left = "0px";
    form_register_css.style.display = "none";
    background_login_css.style.display = "none";
  }
}

function redimention() {
  if (window.innerWidth > 850) {
    background_register_css.style.display = "block";
    background_login_css.style.display = "block";
  } else {
    background_register_css.style.display = "block";
    background_register_css.style.opacity = "1";
    background_login_css.style.display = "none";
    form_login_css.style.display = "block";
    form_css.style.left = "0px";
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
  alert("el email " + regexEmail.test(email));
  return regexEmail.test(email);
}

function isValidPassword(password) {
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  alert("la contrasena " + regexPassword.test(password));
  return regexPassword.test(password);
}

function isValidNumeric(value) {
  const regexNumeric = /^[0-9]+$/;
  alert("el numero " + regexNumeric.test(value));
  return regexNumeric.test(value);
}

function verifyData(value) {
  if (value === "register") {
    const isValidEmailInput = isValidEmail(emailInput.value);
    const isValidPasswordInput = isValidPassword(passwordInput.value);
    const isValidLoginIdInput = isValidNumeric(loginIdInput.value);
    const isValidCiInput = isValidNumeric(ciInput.value);
    const isValidPhone = isValidNumeric(phoneInput.value);

    if (
      nameInput.value.trim() !== "" &&
      lastNameInput.value.trim() !== "" &&
      addressInput.value.trim() !== "" &&
      phoneInput.value.trim() !== "" &&
      ciInput.value.trim() !== "" &&
      emailInput.value.trim() !== "" &&
      passwordInput.value.trim() !== "" &&
      loginIdInput.value.trim() !== "" &&
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
  } else {
    const isValidLoginIdInputLogin = isValidNumeric(loginIdInputLogin.value);
    const isValidPasswordInputLogin = isValidPassword(passwordInputLogin.value);

    if (
      passwordInputLogin.value.trim() !== "" &&
      loginIdInputLogin.value.trim() !== "" &&
      isValidLoginIdInputLogin &&
      isValidPasswordInputLogin
    ) {
      return true;
    } else {
      alert("Por favor, completa todos los campos correctamente.");
      return false;
    }
  }
}

function registerForm() {
  if (verifyData("register")) {
    fetch("/backend/endpoint_de_registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        birthdate: birthdateInput.value,
        address: addressInput.value,
        phone: parseInt(phoneInput.value.trim()),
        ci: parseInt(ciInput.value.trim()),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
        loginId: parseInt(loginIdInput.value.trim()),
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

function loginForm() {
  if (verifyData("login")) {
    fetch("/backend/endpoint_de_login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginId: parseInt(loginIdInputLogin.value.trim()),
        password: passwordInputLogin.value.trim(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Manejar la respuesta del backend si es necesario
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
