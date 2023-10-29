document.addEventListener('DOMContentLoaded', function () {
    var timeOptionsContainer = document.getElementById("timeOptions");
    var formContainer = document.getElementById("form");
    var submitButton = document.getElementById("submitButton");
    var selectedDateTime = null;

    flatpickr("#calendar", {
        inline: true,
        disable: [
            function(date) {
                // Deshabilitar fechas anteriores a noviembre 1, 2023 y posteriores a noviembre 18, 2023
                return (date.getMonth() !== 10 || date.getFullYear() !== 2023 || date.getDate() < 1 || date.getDate() > 18);
            }
        ],
        onChange: function (selectedDates) {
            while (timeOptionsContainer.firstChild) {
                timeOptionsContainer.removeChild(timeOptionsContainer.firstChild);
            }
            
            if (selectedDates.length > 0) {
                selectedDateTime = selectedDates[0];
                var availableTimes = ["14:00", "14:30", "15:00", "15:30"];
                availableTimes.forEach(function (time) {
                    var radioBtn = document.createElement("input");
                    radioBtn.type = "radio";
                    radioBtn.name = "time";
                    radioBtn.value = time;
                    radioBtn.className = "time-option-radio"; // Clase para los radio buttons (ocultos)
                    radioBtn.style.display = "none"; // Ocultar los radio buttons

                    var label = document.createElement("label");
                    label.className = "time-option-label"; // Clase para las etiquetas de horarios
                    label.textContent = time;
                    label.appendChild(radioBtn);

                    timeOptionsContainer.appendChild(label);

                    // Asociar evento click a las etiquetas de horarios
                    label.addEventListener("click", function() {
                        // Marcar el radio button correspondiente cuando se hace clic en la etiqueta
                        radioBtn.checked = true;
                    });
                });

                // Insertar los horarios después del elemento <p> dentro del div con id "form"
                var paragraphElement = formContainer.querySelector("p");
                if (paragraphElement) {
                    formContainer.insertBefore(timeOptionsContainer, paragraphElement.nextSibling);
                    formContainer.appendChild(submitButton);
                }
            }
        }
    });

    submitButton.addEventListener("click", function () {
        var selectedTime = document.querySelector('input[name="time"]:checked');
        if (selectedTime) {
            var timeValue = selectedTime.value;
            if (selectedDateTime) {
                var formattedDateTime = selectedDateTime.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) +
                    " a las " + timeValue;
                // Enviar formattedDateTime al backend
                alert("Has seleccionado: " + formattedDateTime);
            } else {
                alert("Por favor, selecciona una fecha y hora.");
            }
        } else {
            alert("Por favor, selecciona un horario.");
        }
    });
});
