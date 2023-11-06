// Selectores de elementos
const formCss = document.querySelector("#forms");
const formLoginCss = document.querySelector("#login-form");
const formRegisterCss = document.querySelector("#register-form");
const backgroundLoginCss = document.querySelector("#background-login-btn");
const backgroundRegisterCss = document.querySelector(
  "#background-register-btn"
);
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

// Campos de formulario de registro
const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("lastName");
const birthdateInput = document.getElementById("birthdate");
const addressInput = document.getElementById("address");
const phoneInput = document.getElementById("phone");
const ciInput = document.getElementById("ci");
const passwordInput = document.getElementById("password-register");
const emailInput = document.getElementById("email");
const loginIdInput = document.getElementById("loginId-register");

// Campos de formulario de inicio de sesión
const loginIdInputLogin = document.getElementById("loginId-login");
const passwordInputLogin = document.getElementById("password-login");
const showPasswordBtn = document.getElementById("showPasswordBtn");

// Event listeners
registerForm.addEventListener("submit", registerFormHandler);
loginForm.addEventListener("submit", loginFormHandler);
backgroundLoginCss.addEventListener("click", showLoginForm);
backgroundRegisterCss.addEventListener("click", showRegisterForm);
window.addEventListener("resize", adjustLayout);
showPasswordBtn.addEventListener("click", togglePasswordVisibility);

adjustLayout();

// Funciones
function showRegisterForm() {
  formRegisterCss.style.display = "block";
  formCss.style.left = "410px";
  formLoginCss.style.display = "none";
  backgroundRegisterCss.style.opacity = "0";
  backgroundLoginCss.style.opacity = "1";
}

function showLoginForm() {
  formLoginCss.style.display = "block";
  formCss.style.left = "10px";
  formRegisterCss.style.display = "none";
  backgroundRegisterCss.style.opacity = "1";
  backgroundLoginCss.style.opacity = "0";
}

function adjustLayout() {
  if (window.innerWidth > 850) {
    backgroundRegisterCss.style.display = "block";
    backgroundLoginCss.style.display = "block";
  } else {
    backgroundRegisterCss.style.display = "block";
    backgroundRegisterCss.style.opacity = "1";
    backgroundLoginCss.style.display = "none";
    formLoginCss.style.display = "block";
    formCss.style.left = "0px";
    formRegisterCss.style.display = "none";
  }
}

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

function validateData(formType) {
  if (formType === "register") {
    const isValidEmailInput = isValidEmail(emailInput.value);
    const isValidPasswordInput = isValidPassword(passwordInput.value);
    const isValidLoginIdInput = isValidNumeric(loginIdInput.value);
    const isValidCiInput = validateCi(ciInput.value);
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

function registerFormHandler(event) {
  event.preventDefault();
  if (validateData("register")) {
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

function loginFormHandler(event) {
  event.preventDefault();
  if (validateData("login")) {
    fetch("/public/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginId: loginIdInputLogin.value.trim(),
        password: passwordInputLogin.value.trim(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.jwt) {
          // Almacena el token JWT en el almacenamiento local del navegador
          localStorage.setItem("token", data.jwt);

          // Decodifica el token JWT
          const userData = parseJwt(data.jwt);
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

/* revisar si esto es correcto */
function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
