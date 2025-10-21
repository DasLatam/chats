export default function handler(req, res) {
  const VERIFY_TOKEN = "mibot123"; // Cambialo por tu token seguro

  if (req.method === "GET") {
    // 🔹 Verificación del webhook
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verificado correctamente");
      res.status(200).send(challenge);
    } else {
      res.status(403).send("Forbidden");
    }
  } else if (req.method === "POST") {
    // 🔹 Recepción de mensajes
    console.log("📩 Mensaje recibido:", req.body);

    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      const message = req.body.entry[0].changes[0].value.messages[0];
      const from = message.from; 
      const text = message.text?.body || "";

      console.log(`💬 ${from} dice: ${text}`);

      // Aquí podrías llamar a tu lógica de IA o respuestas automáticas
    }

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.status(404).send("Not Found");
  }
}
