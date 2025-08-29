import axios from 'axios';
import wppconnect from '@wppconnect-team/wppconnect';

const notificadorSoporteController = {};

// Helper sleep
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//HOME PARA NOTIFICADORES
notificadorSoporteController.home = (req, res) => {
    console.log("Entró a home notificador de soporte");
    res.render('soporte/home.hbs');
};

// PARA ALUMNOS QUE NO INGRESAN HACE MÁS DE 7 DÍAS
notificadorSoporteController.index = async (req, res) => {
    try {

        const { entidad } = req.body;
        let url = null;
        const sendEvent = (data) => {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        }
        if (entidad === 'Continental') {
            url = `https://enam.pe/notificador-bot-ti/usuarios-ingresan-hace-una-semana/enam/continental`;
        } else if (entidad === 'Cientifica') {
            url = `https://enam.pe/notificador-bot-ti/usuarios-ingresan-hace-una-semana/enam/cientifica`;
        } else {
            sendEvent({ status: "error", message: "Entidad no válida" });
            res.end();
            return;
        }

        const response = await axios.get(url);
        const usuarios = response.data;

        console.log(`✅ Usuarios inactivos: ${usuarios.length}`);

        if (!usuarios || usuarios.length === 0) {
            console.log('⚠️ No hay usuarios para enviar.');
            return res.json({ status: 'ok', message: 'No hay usuarios.' });
        }

        const client = await wppconnect.create({
            session: 'quiz-bot',
            headless: true,
            folderName: './tokens',
            puppeteerOptions: { args: ['--no-sandbox'] },
            autoClose: false,
        });

        console.log('✅ Cliente conectado, empezando envíos...');

        const batchSize = 30;


        //PRIMER FOR
        for (let i = 0; i < usuarios.length; i += batchSize) {
            const batch = usuarios.slice(i, i + batchSize);
            console.log(`🚀 Batch ${Math.floor(i / batchSize) + 1} iniciado.`);

            //SEGUNDO FOR
            for (const usuario of batch) {
                const numero = `51${usuario.phone}@c.us`;

                const mensajes = [
                    `👋🏼 *¡Hola ${usuario.name || ''}!*  
Recuerda que siempre cuentas con nuestro equipo de soporte 💙  
📞 [933 414 723](tel:933414723)  
📧 [soporte@benlos.com](mailto:soporte@benlos.com)  
¡Estamos para ayudarte! ✨`,

                    `¡Hey ${usuario.name || ''}! 💙  
¿Tienes dudas o necesitas ayuda?  
👉🏼 Escríbenos al 📞 [933 414 723](tel:933414723) o al 📧 [soporte@benlos.com](mailto:soporte@benlos.com)  
Nuestro equipo estará encantado de atenderte 🙌`,

                    `Hola ${usuario.name || ''} 👋🏼  
No olvides que puedes contar con soporte en cualquier momento 💙  
📞 [933 414 723](tel:933414723)  
📧 [soporte@benlos.com](mailto:soporte@benlos.com)  
¡Tu experiencia es nuestra prioridad! 🚀`
                ];


                const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];

                try {
                    await client.sendText(numero, mensaje);
                    console.log(`✅ Enviado a ${numero}`);

                    //API PARA GUARDAR LOS DATOS 
                    await axios.post('https://enam.pe/api/log-reminders/node-js', {
                        user_id: usuario.id,
                        type: 'mesa_de_ayuda_banquea',
                        chanel: 'whatsapp'
                    }, {
                        headers: {
                            'X-API-KEY': 'examenes_recordatorio_2025'
                        }
                    });

                    console.log(`📌 Log registrado para ${usuario.id}`);
                } catch (error) {
                    console.error(`❌ Error con ${numero}:`, error.message);
                }

                // Delay aleatorio entre usuarios
                const delay = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
                console.log(`⏸️ Esperando ${delay} ms...`);
                await sleep(delay);


            }
            //SEGUNDO FOR CERRADO

            // Pausa entre lotes de 1–2 minutos
            console.log(`⏳ Batch ${Math.floor(i / batchSize) + 1} terminado. Pausa 1–2 min...`);
            const batchPause = Math.floor(Math.random() * (120000 - 60000 + 1)) + 60000;
            await sleep(batchPause);
        }
        //PRIMER FOR CERRADO

        console.log('✅ Todos los mensajes enviados.');
        return res.json({ status: 'ok', message: 'Notificaciones completadas.' });

    } catch (error) {
        console.error('❌ Error general:', error.message);
        res.status(500).json({ error: 'Error en el notificador.' });
    }
};

export { notificadorSoporteController };
