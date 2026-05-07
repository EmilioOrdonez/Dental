/**
 * Vercel Serverless Function para VIANDENT
 * Ruta automática: /api/chat
 */
module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Usa POST.' });

    try {
        const { message } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ error: 'Falta la GEMINI_API_KEY en Vercel.' });
        }

        const systemPrompt = `Eres el asistente virtual experto de VIANDENT. Sé conciso y en español.`;
        const fullMessage = `${systemPrompt}\n\nPaciente: ${message}`;

        // ¡AQUÍ ESTÁ LA MAGIA! Cambiamos a gemini-2.5-flash que es el que tu cuenta soporta
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
        
        const geminiResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: fullMessage }] }]
            })
        });

        const data = await geminiResponse.json();

        if (!geminiResponse.ok) {
            return res.status(500).json({ error: `Error de Google: ${data.error?.message}` });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return res.status(200).json({ response: aiText });

    } catch (error) {
        return res.status(500).json({ error: 'Error interno: ' + error.message });
    }
}