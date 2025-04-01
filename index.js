const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "MI_TOKEN_SECRETO"; // Cambia esto por un token seguro
const OPENAI_API_KEY = "TU_CLAVE_DE_OPENAI"; // Reemplaza con tu API Key de OpenAI

// Endpoint para verificar el webhook en Meta
app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Endpoint para recibir mensajes de WhatsApp, Messenger o Instagram
app.post("/webhook", async (req, res) => {
    console.log("Mensaje recibido:", JSON.stringify(req.body, null, 2));

    let messageEvent = req.body.entry?.[0]?.messaging?.[0];
    if (messageEvent && messageEvent.message?.text) {
        let senderId = messageEvent.sender.id;
        let receivedMessage = messageEvent.message.text;

        // Enviar el mensaje a ChatGPT
        let chatGPTResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4-turbo",
            messages: [{ role: "system", content: "Eres un asistente de Moscowa y Alya." }, { role: "user", content: receivedMessage }]
        }, { headers: { Authorization: Bearer ${OPENAI_API_KEY} } });

        let reply = chatGPTResponse.data.choices[0].message.content;

        // Enviar la respuesta al usuario
        await axios.post(https://graph.facebook.com/v19.0/${senderId}/messages, {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: senderId,
            text: { body: reply }
        }, { headers: { Authorization: Bearer TU_ACCESS_TOKEN_DE_META } });
    }

    res.sendStatus(200);
});

// Iniciar servidor en Vercel o Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Webhook activo en puerto ${PORT}));
