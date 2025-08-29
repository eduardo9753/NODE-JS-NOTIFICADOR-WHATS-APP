document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('frm_login').addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        $.ajax({
            type: 'POST',
            url: '/auth',
            data: { email, password },
            dataType: "json",
            success: function (response) {
                if (response.type == 1) {
                    Swal.fire({
                        title: '¡Hola!',
                        text: response.message,
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500 // 1.5 segundos
                    }).then(() => {
                        window.location.href = "/home/banquea";
                    })

                } else {
                    Swal.fire({
                        title: '¡Hola!',
                        text: response.message,
                        icon: 'success',
                        confirmButtonText: 'Entendido'
                    }).then(() => {
                    })
                }
            },
            error: function (xhr) {
                console.error("Error: ", xhr.responseText);
                alert("Error en login: " + xhr.responseText);
            }
        });
    });
});