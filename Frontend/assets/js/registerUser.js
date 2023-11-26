document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("register-form")
    .addEventListener("submit", RegisterFormHandler);

  function isValidPassword(password) {
    const regexPassword =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    return regexPassword.test(password);
  }

  function isValidLogId(logId) {
    const regexLogIn = /^[A-Z]+$/i;
    return regexLogIn.test(logId);
  }

  function validateData(loginIdInput, passwordInput) {
    const isValidPasswordInput = isValidPassword(passwordInput.value);
    const isValidLogIdInput = isValidLogId(loginIdInput.value);

    switch (true) {
      case !isValidLogIdInput:
        swal("Login ID invalido", "Ingrese un Login ID valido", "error");
        return false;

      case !isValidPasswordInput:
        swal(
          "Contrasena invalida",
          "Ingrese una contraseña con 8 caracteres, una minucula, una mayuscula y un numero como minimo.",
          "error"
        );
        return false;

      default: {
        return true;
      }
    }
  }

  function RegisterFormHandler(event) {
    event.preventDefault();
    const loginIdInput = document.getElementById("loginId");
    const passwordInput = document.getElementById("password");
    if (validateData(loginIdInput, passwordInput)) {
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
            console.log("Respuesta del backend:", data);
            window.location.href = "registerFuncionario.html";
          } else {
            console.error("Error: Token JWT no válido.");
            swal(
              "Usuario ya existente",
              "Parece que ya tienes un usuario",
              "info"
            );
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
});
