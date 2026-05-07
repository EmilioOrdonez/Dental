const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.')); // Servir archivos estáticos

// Configuración de Gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

// System prompt para VIANDENT
const systemPrompt = `Eres el asistente virtual experto de VIANDENT, un consultorio y depósito dental en Iztacalco, México, con más de 20 años de experiencia.
Tu objetivo es orientar a los pacientes sobre sus síntomas y recomendar el servicio adecuado (Odontología General, Ortodoncia o Estética).
IMPORTANTE:
1. Debes incluir SIEMPRE una nota indicando que eres una IA y que esto no reemplaza una consulta médica profesional.
2. Sé profesional, empático y anima a los usuarios a agendar una cita mediante el botón de WhatsApp de la página.
3. Menciona la calidad de nuestros materiales, ya que también somos depósito dental.
4. Responde de forma concisa y en español.`;

// Función para llamar a Gemini
async function callGemini(prompt, retries = 3, delay = 1000) {
    const url = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    // Agregar el system prompt al mensaje del usuario
    const fullPrompt = `${systemPrompt}\n\nPregunta del usuario: ${prompt}`;

    const payload = {
        contents: [{
            parts: [{ text: fullPrompt }]
        }]
    };

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error Response:', response.status, errorData);
                throw new Error(`API Error ${response.status}: ${errorData?.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text;
        } catch (error) {
            console.error(`Intento ${i + 1}/${retries} - Error:`, error.message);
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
}

// Endpoint para el chat
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: 'Mensaje requerido' });
        }

        if (message.length > 500) {
            return res.status(400).json({ error: 'Mensaje muy largo (máximo 500 caracteres)' });
        }

        console.log('Procesando mensaje:', message.substring(0, 50) + '...');

        const response = await callGemini(message);

        if (!response) {
            return res.status(500).json({ error: 'No se pudo generar respuesta' });
        }

        res.json({ response });

    } catch (error) {
        console.error('Error en /api/chat:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
});

// Endpoint de health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        model: GEMINI_MODEL
    });
});

// Ruta para servir el HTML principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/viandent.html');
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 VIANDENT Backend corriendo en puerto ${PORT}`);
    console.log(`📱 Frontend disponible en: http://localhost:${PORT}`);
    console.log(`🔗 API Health check: http://localhost:${PORT}/api/health`);
    console.log(`💬 API Chat endpoint: http://localhost:${PORT}/api/chat`);
});

module.exports = app;
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.')); // Servir archivos estáticos

// Configuración de Gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

// System prompt para VIANDENT
const systemPrompt = `Eres el asistente virtual experto de VIANDENT, un consultorio y depósito dental en Iztacalco, México, con más de 20 años de experiencia.
Tu objetivo es orientar a los pacientes sobre sus síntomas y recomendar el servicio adecuado (Odontología General, Ortodoncia o Estética).
IMPORTANTE:
1. Debes incluir SIEMPRE una nota indicando que eres una IA y que esto no reemplaza una consulta médica profesional.
2. Sé profesional, empático y anima a los usuarios a agendar una cita mediante el botón de WhatsApp de la página.
3. Menciona la calidad de nuestros materiales, ya que también somos depósito dental.
4. Responde de forma concisa y en español.`;

// Función para llamar a Gemini
async function callGemini(prompt, retries = 3, delay = 1000) {
    const url = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    // Agregar el system prompt al mensaje del usuario
    const fullPrompt = `${systemPrompt}\n\nPregunta del usuario: ${prompt}`;

    const payload = {
        contents: [{
            parts: [{ text: fullPrompt }]
        }]
    };

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error Response:', response.status, errorData);
                throw new Error(`API Error ${response.status}: ${errorData?.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text;
        } catch (error) {
            console.error(`Intento ${i + 1}/${retries} - Error:`, error.message);
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
}

// Endpoint para el chat
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: 'Mensaje requerido' });
        }

        if (message.length > 500) {
            return res.status(400).json({ error: 'Mensaje muy largo (máximo 500 caracteres)' });
        }

        console.log('Procesando mensaje:', message.substring(0, 50) + '...');

        const response = await callGemini(message);

        if (!response) {
            return res.status(500).json({ error: 'No se pudo generar respuesta' });
        }

        res.json({ response });

    } catch (error) {
        console.error('Error en /api/chat:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
});

// Endpoint de health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        model: GEMINI_MODEL
    });
});

// Ruta para servir el HTML principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/viandent.html');
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 VIANDENT Backend corriendo en puerto ${PORT}`);
    console.log(`📱 Frontend disponible en: http://localhost:${PORT}`);
    console.log(`🔗 API Health check: http://localhost:${PORT}/api/health`);
    console.log(`💬 API Chat endpoint: http://localhost:${PORT}/api/chat`);
});

module.exports = app;