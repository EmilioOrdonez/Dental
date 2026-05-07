/**
 * Vercel Serverless Function para VIANDENT
 * Ruta automática: /api/chat
 */
module.exports = async function handler(req, res) {
    // Configuración de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Solo aceptar peticiones POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
    }

    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'El cuerpo de la petición debe incluir "message"' });
        }

        // Obtener la API Key desde Vercel
        const API_KEY = process.env.GEMINI_API_KEY;
        if (!API_KEY) {
            console.error("Falta la variable GEMINI_API_KEY en Vercel");
            return res.status(500).json({ error: 'Falta la GEMINI_API_KEY en la configuración de Vercel' });
        }

        const systemPrompt = `Eres el asistente virtual experto de VIANDENT, un consultorio y depósito dental en Iztacalco, México... 
        IMPORTANTE: Aclara siempre que eres una IA y anima a contactar por WhatsApp. Responde de forma concisa.`;

        // ESTRATEGIA DE FALLBACK: Probamos modelos de mayor a menor probabilidad de soporte
        const modelsToTry = ['gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-pro'];
        let aiText = null;
        let lastError = null;

        for (const model of modelsToTry) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
            
            const geminiResponse = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Pregunta: ${message}` }] }],
                    systemInstruction: { parts: [{ text: systemPrompt }] }
                })
            });

            const data = await geminiResponse.json();

            // Si la petición es exitosa, guardamos el texto y salimos del bucle
            if (geminiResponse.ok && data.candidates) {
                aiText = data.candidates[0].content.parts[0].text;
                break; 
            } else {
                // Si falla, guardamos el error e intentamos con el siguiente modelo
                lastError = data.error?.message || 'Error desconocido';
                console.warn(`El modelo ${model} falló:`, lastError);
            }
        }

        // Si después de probar todos los modelos ninguno funcionó
        if (!aiText) {
            return res.status(500).json({ error: `La API de Google rechazó los modelos. Último error: ${lastError}` });
        }
        
        return res.status(200).json({ response: aiText });

    } catch (error) {
        console.error("Error crítico en el servidor:", error);
        return res.status(500).json({ error: 'Error del servidor: ' + error.message });
    }
}