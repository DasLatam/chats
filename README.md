⚙️ GUÍA COMPLETA — Asistente WhatsApp con API oficial de Meta (DIY)
🧩 1. Crear o usar tu App en Meta Developers

Entrá a https://developers.facebook.com/apps
.

Clic en “Create App”.

Elegí tipo “Other” → “Business”.

Poné un nombre (por ejemplo, “Asistente WhatsApp”) y asociá tu cuenta de Business Manager.

Una vez creada, en el menú izquierdo, andá a “Add Product” → seleccioná “WhatsApp” → “Set up”.

✅ Te llevará al panel de configuración de WhatsApp Business API.

📞 2. Obtener el número de prueba

Meta te da un número temporal gratuito para probar el sistema.

En la sección Getting Started vas a ver:

Un número de prueba.

Un token temporal.

Un ejemplo de endpoint para enviar mensajes (https://graph.facebook.com/v19.0/FROM_PHONE_NUMBER_ID/messages).

Desde ahí ya podés enviar mensajes de prueba a tu propio número (registrado como “destinatario”).

💡 Tip: estos tokens duran 24 horas. Más adelante vas a generar uno permanente.

✅ 3. Vincular tu número real

Cuando ya quieras usar tu número de negocio:

En el panel de WhatsApp, clic en “Add Phone Number”.

Elegí un número que no esté activo en la app de WhatsApp ni WhatsApp Business normal.

Meta te pedirá verificar el número por llamada o SMS.

Luego ese número quedará asociado a tu Business Manager y tu App.

💬 Desde ese momento, ese número solo funcionará vía API (no más app móvil).

🧾 4. Verificar tu empresa (Business Verification)

Antes de enviar mensajes a clientes reales, Meta exige verificar la empresa:

Ir a https://business.facebook.com/settings/info
.

Asegurate de tener tu razón social, dirección y dominio cargados.

Iniciá el proceso de “Verificación de negocio”.

Te pedirá subir un documento oficial (estatuto, AFIP, registro mercantil, etc.) y verificar un dominio web.

⚠️ Sin esta verificación, solo podrás enviar mensajes de prueba.

🌐 5. Configurar el Webhook (para recibir mensajes)

El webhook es donde tu asistente recibe los mensajes entrantes.

En la sección “Webhooks”, hacé clic en “Configure Webhooks”.

Vas a necesitar:

Callback URL: una URL pública que reciba POST requests (por ejemplo, de un servidor Node.js, Python o usando Webhook.site
 para testear).

Verify Token: una palabra clave que inventás (ej. “mibot123”).

Luego de configurarlo, Meta te pedirá verificación automática (manda un GET con el token para validar).

✅ Si usás una URL válida, ya vas a poder recibir mensajes entrantes en tu servidor.

🤖 6. Enviar y recibir mensajes (tu primer prueba real)

Podés probar con este ejemplo de curl (desde tu terminal o Postman):

curl -i -X POST `
  https://graph.facebook.com/v19.0/<PHONE_NUMBER_ID>/messages `
  -H 'Authorization: Bearer <ACCESS_TOKEN>' `
  -H 'Content-Type: application/json' `
  -d '{
    "messaging_product": "whatsapp",
    "to": "<NUMERO_DESTINO>",
    "type": "text",
    "text": {"body": "Hola! Soy tu asistente automatizado 🚀"}
  }'


👉 Reemplazá:

<PHONE_NUMBER_ID> = el ID del número que te da Meta.

<ACCESS_TOKEN> = el token temporal (o permanente si ya lo creaste).

<NUMERO_DESTINO> = tu número en formato internacional (por ej. 5491123456789).

🔄 7. Armar tu lógica de respuestas

Ahora llega la parte divertida: tu asistente inteligente 🎯.

Podés hacerlo de tres formas:

Código propio (Node.js, Python, PHP, etc.) con tu servidor.

Usar una plataforma visual open source, como Flowise + API de Meta.

Conectar tu webhook a ChatGPT u otro modelo de IA, para respuestas naturales.

💡 Por ejemplo: cuando recibís un mensaje → tu servidor analiza el texto → genera una respuesta → la envía de vuelta vía API.

🔒 8. Token permanente

Los tokens de prueba expiran en 24h.
Para generar uno permanente:

En tu App → WhatsApp → Configuration.

“System User → Generate Token”.

Seleccioná los permisos whatsapp_business_messaging, whatsapp_business_management.

Copialo y guardalo en tu servidor (no lo publiques).

✅ 9. Plantillas y mensajes salientes

Para escribirle primero a un cliente, necesitás plantillas aprobadas por Meta (por ejemplo, mensajes de bienvenida, confirmación, etc.).
Las creás desde:
👉 https://business.facebook.com/wa/manage/message-templates