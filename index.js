const express = require('express');
const bodyParser = require('body-parser');

const app = express().use(bodyParser.json());

const VERIFY_TOKEN = "mibot123"; // tu token personalizado

// 🔹 Verificación inicial del webhook (paso obligatorio de Meta)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verificado correctamente");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// 🔹 Recepción de mensajes de WhatsApp
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object) {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      const message = body.entry[0].changes[0].value.messages[0];
      console.log("📩 Nuevo mensaje:", message);

      const from = message.from; // número del usuario
      const text = message.text?.body || "";

      console.log(`💬 ${from} dice: ${text}`);
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Webhook escuchando en puerto ${PORT}`));
