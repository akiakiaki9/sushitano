// scripts/set-webhook.js
// Запуск: node scripts/set-webhook.js

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL; // https://ваш-домен.vercel.app/api/bot

async function setWebhook() {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: WEBHOOK_URL,
      allowed_updates: ["message", "callback_query"],
      drop_pending_updates: true,
      // secret_token не указываем — по вашему запросу
    }),
  });

  const data = await res.json();
  console.log("setWebhook:", JSON.stringify(data, null, 2));

  // Проверка
  const info = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`
  ).then((r) => r.json());
  console.log("getWebhookInfo:", JSON.stringify(info, null, 2));
}

setWebhook().catch(console.error);