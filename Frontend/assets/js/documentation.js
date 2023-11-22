const documentationForm = document.getElementById("documentationForm").addEventListener("submit", sendFile);

function security(){
  const cedulaUsuario = localStorage.getItem("userData");
  const token = localStorage.getItem("token");
  
  if (!cedulaUsuario || !token) {
    window.location.href = "index.html";
  }
}

function isValidFileType(fileType) {
  const allowedTypes = ["application/pdf", "image/jpeg"];
  return allowedTypes.includes(fileType);
}

async function sendFile(event) {
  event.preventDefault();
  const cedulaUsuario = localStorage.getItem("userData");
  const token = localStorage.getItem("token");

  let fileInput = document.getElementById("documentationFile");
  const carnetSaludFile = fileInput.files[0];

  if (!carnetSaludFile || !isValidFileType(carnetSaludFile.type)) {
    alert("Por favor, seleccione un archivo PDF o JPEG");
    return;
  } else {
    await fetchData(cedulaUsuario, token);
    await fetchComprobante(carnetSaludFile, cedulaUsuario, token);
  }
}

async function fetchData(cedulaUsuario, token) {
  let fechaVencimiento = document.getElementById("fechaVencimiento");
  let fechaEmision = document.getElementById("fechaEmision");
  const url =
    "http://127.0.0.1:8080/funcionario/" + cedulaUsuario + "/cargarCarnetSalud";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      Fch_Emision: fechaEmision.value,
      Fch_Vencimiento: fechaVencimiento.value,
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
      alert("data enviada bien");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function fetchComprobante(comprobante, cedulaUsuario, token) {

  const carnetSaludBlob = new Blob([comprobante]);
  const carnetSaludbytes = new Uint8Array(carnetSaludBlob);
  console.log(carnetSaludBlob);
  console.log(carnetSaludbytes);

  const url =
    "http://127.0.0.1:8080/funcionario/" + cedulaUsuario + "/cargarComprobante";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/blob",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
      Authorization: "Bearer " + token,
    },
    body: { blob: carnetSaludbytes },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Respuesta del backend:", data);
      alert("comprobante enviado bien");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

