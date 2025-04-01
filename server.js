const express = require("express");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "tu_token_secreto";

app.use(express.json());

// Ruta de verificación del webhook
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verificado correctamente");
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Ruta para recibir mensajes de WhatsApp
app.post("/webhook", (req, res) => {
    console.log("Mensaje recibido:", JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
});

app.listen(PORT, () => console.log(Servidor webhook activo en puerto ${PORT}));
