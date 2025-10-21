console.log("Body completo recibido:", JSON.stringify(req.body, null, 2));

import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID; // el del sandbox

// 1️⃣ Verificación inicial de Webhook
app.get("/api/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("Webhook verificado ✅");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// 2️⃣ Recepción de mensajes
app.post("/api/webhook", async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const message = changes?.value?.messages?.[0];

  if (message && message.text) {
    const from = message.from; // número del cliente
    const body = message.text.body.toLowerCase();

    console.log("Mensaje recibido:", body);

    let reply = "¡Hola! 👋 Soy el asistente de MCV Propiedades.";
    if (body.includes("propiedad") || body.includes("alquiler")) {
      reply = "Tenemos varias propiedades disponibles 🏡. ¿En qué zona te interesa buscar?";
    }

    // Enviar respuesta
    await axios.post(
      `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: { body: reply },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  }

  res.sendStatus(200);
});

export default app;
