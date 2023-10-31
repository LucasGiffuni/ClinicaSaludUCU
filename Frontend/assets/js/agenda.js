document.addEventListener("DOMContentLoaded", function() {
    flatpickr("#calendar", {
        minDate: "2023/11/01",
        maxDate: "2023/11/18",
        dateFormat: "d/m/y" 
    });

    document.getElementById("agendaForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const selectedDate = document.getElementById("calendar").value;
        const selectedHour = document.getElementById("hour").value;
        // Aquí puedes hacer lo que desees con la fecha y la hora seleccionadas
        console.log("Fecha seleccionada: " + selectedDate);
        console.log("Hora seleccionada: " + selectedHour);
    });
});
