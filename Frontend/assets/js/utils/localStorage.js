document.addEventListener("DOMContentLoaded", function () {
  const logOut = document.getElementById("logOut");

  logOut.addEventListener("click", function (event) {
    event.preventDefault();
    swal({
      title: "Seguro que deseas salir?",
      text: "La sesion se cerrara",
      icon: "info",
      buttons: [true, "Yes"],
    }).then((willLogOut) => {
      if (willLogOut) {
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
        window.location.href = "index.html";
      }
    });
  });
});
