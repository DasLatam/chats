import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "whatsapp_bot_test"; // el mismo que usaste para verificar el webhook
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN; // tu token de Meta

// 🔹 Endpoint para verificación inicial del Webhook
app.get("/api/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// 🔹 Endpoint que recibe los mensajes de WhatsApp
app.post("/api/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (message && message.text?.body) {
      const from = message.from;
      const text = message.text.body.toLowerCase();

      console.log("📩 Mensaje recibido:", text);

      // Respuesta base
      let reply = "👋 Hola! Soy tu asistente automatizado de prueba.";

      if (text.includes("propiedad")) {
        reply = "🏠 Contanos más sobre la propiedad que querés alquilar o vender.";
      } else if (text.includes("hola")) {
        reply = "🙌 Hola! ¿Cómo estás? Puedo ayudarte con propiedades, alquileres o consultas.";
      }

      // Enviar la respuesta usando la API de WhatsApp
      await fetch(
        `https://graph.facebook.com/v22.0/${value.metadata.phone_number_id}/messages`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: { body: reply },
          }),
        }
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error procesando el webhook:", error);
    res.sendStatus(500);
  }
});

export default app;
