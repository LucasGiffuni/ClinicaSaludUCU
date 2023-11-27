document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("register-form")
    .addEventListener("submit", registerFormHandler);

  // Verifica la seguridad del usuario basándose en la existencia de datos en el almacenamiento local
  security();

  function security() {
    const logIdCache = localStorage.getItem("logId");
    const token = localStorage.getItem("token");

    if (!logIdCache || !token) {
      window.location.href = "/registerUser.html";
    }
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

  function isValidString(value) {
    return typeof value === "string" && /^[a-zA-Z]+$/.test(value);
  }

  function isValidBirtAge(value) {
    const birthdate = new Date(value);
    const ageDifference = Date.now() - birthdate.getTime();
    const ageInYears = ageDifference / (1000 * 60 * 60 * 24 * 365.25);
    return ageInYears >= 18;
  }

  function validateData(email, ci, phone, name, lastname, birthdate) {
    const isValidEmailInput = isValidEmail(email.value);
    const isValidCiInput = validateCi(ci.value);
    const isValidPhone = isValidNumeric(phone.value);
    const isValidName = isValidString(name.value);
    const isValidLastName = isValidString(lastname.value);
    const isValidBirthdate = isValidBirtAge(birthdate.value);

    switch (true) {
      case !isValidEmailInput:
        swal("Email invalido", "Ingrese un email valido", "error");
        return;

      case !isValidCiInput:
        swal("Cedula invalida", "Ingrese una cedula valido", "error");
        return;

      case !isValidPhone:
        swal("Numero invalido", "Ingrese un celular valido", "error");
        return;

      case !isValidName:
        swal("Nombre invalido", "Ingrese solo letras", "error");
        return;

      case !isValidLastName:
        swal("Apellido invalido", "Ingrese solo letras", "error");
        return;

      case !isValidBirthdate:
        swal(
          "Edad invalido",
          "La diferencia de edad es menor a 18 años",
          "error"
        );
        return;

      default: {
        return true;
      }
    }
  }

  function registerFormHandler(event) {
    event.preventDefault();

    const logIdCache = localStorage.getItem("logId");
    const token = localStorage.getItem("token");

    const nameInput = document.getElementById("name");
    const lastNameInput = document.getElementById("lastName");
    const birthdateInput = document.getElementById("birthdate");
    const addressInput = document.getElementById("address");
    const phoneInput = document.getElementById("phone");
    const ciInput = document.getElementById("ci");
    const emailInput = document.getElementById("email");

    if (
      validateData(
        emailInput,
        ciInput,
        phoneInput,
        nameInput,
        lastNameInput,
        birthdateInput
      )
    ) {
      const url =
        "http://127.0.0.1:8080/funcionario/" +
        ciInput.value +
        "/createFuncionario";

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
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
          console.log("Respuesta del backend:", data);
          swal(
            "Registro existoso",
            "presione aceptar para iniciar sesion",
            "success"
          );
          localStorage.removeItem("logId");
          window.location.href = "index.html";
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
});
