import axios from 'axios';
import wppconnect from '@wppconnect-team/wppconnect';

const notificadorSimulacrosController = {};

// Helper sleep
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//HOME PARA SIMULACROS
notificadorSimulacrosController.home = (req, res) => {
    console.log("Entró a home simulacros");
    res.render('simulacros/home.hbs');
};

// PARA AQUELLOS ALUMNOS QUE TIENEN EXAMEN (MANDAR EL MISMO DÍA)
notificadorSimulacrosController.index = async (req, res) => {
    try {
        const { nombre_examen } = req.body;
        console.log(`✅ Slug recibido: ${nombre_examen}`);

        const url = `https://enam.pe/api/estadisticas/bi/alumnos_asignados_por_examen/${nombre_examen}`;
        console.log(`✅ URL construida: ${url}`);

        const response = await axios.get(url);
        const usuarios = response.data.data;

        console.log(`✅ Usuarios a notificar: ${usuarios.length}`);

        if (!usuarios || usuarios.length === 0) {
            console.log('⚠️ No hay usuarios.');
            return res.json({ status: 'ok', message: 'No hay usuarios para enviar.' });
        }

        const client = await wppconnect.create({
            session: 'quiz-bot',
            headless: true,
            folderName: './tokens',
            puppeteerOptions: { args: ['--no-sandbox'] },
            autoClose: false,
        });

        console.log('✅ Cliente conectado, empezando envíos...');

        const batchSize = 30; // Lote de 30

        for (let i = 0; i < usuarios.length; i += batchSize) {
            const batch = usuarios.slice(i, i + batchSize);
            console.log(`🚀 Batch ${Math.floor(i / batchSize) + 1} iniciado.`);

            for (const usuario of batch) {
                const numero = `51${usuario.phone}@c.us`;

                const fechaExamen = usuario.init_at
                    ? new Date(usuario.init_at).toLocaleString('es-PE', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })
                    : '';

                const mensajes = [
                    `👋🏼 *¡Hola ${usuario.alumno || ''}!*  
📚 Te recordamos que tu *Examen ENAM* está programado para el *${fechaExamen}*.  
Ingresa ahora y revisa tu avance 👉🏼 https://enam.pe/ingreso-estudiante  
¡Te deseamos muchos éxitos! 💙`,

                    `Hola ${usuario.alumno || ''}! 👋🏼  
Recuerda que tu *Examen ENAM* es el *${fechaExamen}*.  
✅ Puedes revisar tu plan aquí: https://enam.pe/ingreso-estudiante  
¡Éxitos y a dar lo mejor! 💪🏼`,

                    `¡Hey ${usuario.alumno || ''}! 📚  
Tu *Examen ENAM* será el *${fechaExamen}*.  
Accede a la plataforma 👉🏼 https://enam.pe/ingreso-estudiante  
¡Estamos contigo, vamos con todo! 💙`
                ];

                const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];

                try {
                    await client.sendText(numero, mensaje);
                    console.log(`✅ Enviado a ${numero}`);

                    //API PARA GUARDAR LOS DATOS 
                    await axios.post('https://enam.pe/api/log-reminders/node-js', {
                        user_id: usuario.user_id,  
                        type: 'alerta_examen',
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

                // Pausa random 5–15s entre usuarios
                const delay = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
                console.log(`⏸️ Delay ${delay} ms...`);
                await sleep(delay);
            }

            // Espera entre lotes para disimular tráfico masivo
            console.log(`⏳ Batch ${Math.floor(i / batchSize) + 1} terminado. Pausa 1–2 min...`);
            const batchPause = Math.floor(Math.random() * (120000 - 60000 + 1)) + 60000;
            await sleep(batchPause);
        }

        console.log('✅ Todos los mensajes enviados.');

        return res.json({ status: 'ok', message: 'Notificaciones completadas.' });

    } catch (error) {
        console.error('❌ Error general:', error.message);
        res.status(500).json({ error: 'Error en el notificador.' });
    }
};

export { notificadorSimulacrosController };
