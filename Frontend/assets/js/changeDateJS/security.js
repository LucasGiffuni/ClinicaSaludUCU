security();

function security() {
    const cedulaUsuario = localStorage.getItem("userData");
    const token = localStorage.getItem("token");
    const logId = localStorage.getItem("logId");
    if (!cedulaUsuario || !token || logId !== "admin") {
      window.location.href = "index.html";
    }
  }