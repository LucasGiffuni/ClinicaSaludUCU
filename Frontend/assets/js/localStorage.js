const logOut = document.getElementById("logOut");

logOut.addEventListener("click", function () {
  localStorage.removeItem("userData");
  localStorage.removeItem("token");
});
