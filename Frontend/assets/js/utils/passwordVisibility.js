document.addEventListener("DOMContentLoaded", function () {
  const showPassword = document.getElementById("showPassword");
  showPassword.addEventListener("click", togglePasswordVisibility);

  function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      showPassword.src = "assets/img/hide.png";
    } else {
      passwordInput.type = "password";
      showPassword.src = "assets/img/show.png";
    }
  }
});
