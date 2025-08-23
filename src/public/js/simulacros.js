document.addEventListener('DOMContentLoaded', () => {
    //
    let timerInterval;
    let seconds = 0

    document.getElementById('form_simulacros').addEventListener('submit', function (e) {
        e.preventDefault();
        const nombre_examen = document.getElementById('nombre_examen').value;
        console.log('Nombre examen: ' + nombre_examen);
        
        simulacro(nombre_examen);
    });

    function simulacro(nombre_examen) {

        let btn = document.getElementById('enviar_simulacro');
        let btnText = document.getElementById('btn_text_simulacro');
        let btnSpinner = document.getElementById('btn_spinner_simulacro');
        let statusText = document.getElementById('status_text_simulacro');

        $.ajax({
            type: 'POST',
            url: '/notificador-bot-ti/usuarios-examen-programado-apertura/enam/simulacros',
            data: {
                nombre_examen: nombre_examen
            },

            beforeSend: function () {
                // Reiniciar timer
                seconds = 0;

                // Desactivar botón y mostrar spinner
                btn.disabled = true;
                btnText.textContent = "Enviando Datos...";
                btnSpinner.classList.remove("d-none");

                // Iniciar contador en vivo
                timerInterval = setInterval(() => {
                    seconds++;
                    statusText.textContent = `⏳ Enviando datos... ${seconds} segundos`;
                }, 1000);
            },

            success: function (response) {
                clearInterval(timerInterval); // parar el timer
                if (response.status === 'ok') {
                    statusText.textContent = `✅ Datos enviados correctamente en ${seconds} segundos.`;
                } else {
                    statusText.textContent = `❌ Error en la respuesta del servidor en ${seconds} segundos.`;
                }
            },

            error: function (xhr) {
                clearInterval(timerInterval);
                console.error(xhr.responseText);
                statusText.textContent = `❌ Error al enviar datos en ${seconds} segundos.`;
            },

            complete: function () {
                // Siempre reactivar botón
                btn.disabled = false;
                btnText.textContent = "Enviar";
                btnSpinner.classList.add("d-none");
            }
        });
    }

});