let logId = localStorage.getItem("logId");

if (logId === "admin") {
  let navbar = document.getElementById("nav-links");

  let li = document.createElement("li");
  let a = document.createElement("a");

  a.href = "changeDate.html";
  a.textContent = "Cambiar periodo";

  li.appendChild(a);
  navbar.insertBefore(li, navbar.firstChild);
}
