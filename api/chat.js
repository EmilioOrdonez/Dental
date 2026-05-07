/**
 * Vercel Serverless Function para VIANDENT
 * Ruta automática: /api/chat
 */
module.exports = async function handler(req, res) {
    // 1. CORS
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

        // 2. Unimos las instrucciones y el mensaje en un solo texto
        const systemPrompt = `Eres el asistente virtual experto de VIANDENT. Aclara siempre que eres una IA y anima a agendar cita por WhatsApp. Responde de forma concisa y en español.`;
        const fullMessage = `${systemPrompt}\n\nPregunta del paciente: ${message}`;

        // 3. Llamada 100% segura a Google Gemini
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const geminiResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // Ya no usamos "systemInstruction", todo va dentro de "contents"
                contents: [{ parts: [{ text: fullMessage }] }]
            })
        });

        const data = await geminiResponse.json();

        if (!geminiResponse.ok) {
            return res.status(500).json({ error: data.error?.message || "Error en Google API" });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return res.status(200).json({ response: aiText });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}