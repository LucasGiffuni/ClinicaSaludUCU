const showPassword = document.getElementById("showPassword");
const passwordInput = document.getElementById("password");

showPassword.addEventListener("click", togglePasswordVisibility);

function togglePasswordVisibility() {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    showPassword.src = "assets/img/hide.png";
  } else {
    passwordInput.type = "password";
    showPassword.src = "assets/img/show.png";
  }
}
