import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text, replyMarkup = null) {
  const body = { chat_id: chatId, text, parse_mode: "HTML" };
  if (replyMarkup) body.reply_markup = replyMarkup;
  await fetch(`${API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function answerCallback(callbackId, text = "") {
  await fetch(`${API}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackId, text }),
  });
}

// ===== MENYU =====
const menuData = {
  sets: [
    { name: "Set Tano", desc: "Premium set", price: 210000 },
    { name: "Set Chikenset", desc: "Tovuqli set", price: 135000 },
    { name: "Set Zapichoni kuritsa", desc: "4 pors, 32 dona", price: 140000 },
    { name: "Set Femili", desc: "Oila uchun katta set", price: 230000 },
    { name: "Set Mini set", desc: "Mini to'plam", price: 110000 },
    { name: "Set Arizona", desc: "Ugur, ris, bodring, strushka clar, sir, unagi sous", price: 60000 },
    { name: "Set Sultan", desc: "40 dona", price: 180000 },
    { name: "Mini set (zapechonniy, filadelfiya, jareniy)", desc: "Assorti", price: 110000 },
    { name: "Set Tano mix", desc: "5 xil rol, 40 dona", price: 190000 },
    { name: "Kombo set 1", desc: "40 roll + tar tar xleb + 1 kola", price: 230000 },
    { name: "Set Sushi Tort", desc: "Bayram uchun sushi tort", price: 450000 },
    { name: "Set Speshl", desc: "Maxsus to'plam", price: 150000 },
    { name: "Set Kombo 2", desc: "Bonus: tar tar va kola", price: 230000 },
    { name: "Sushi qayiq", desc: "To'y va tantanalar uchun — narx bo'yicha qo'ng'iroq", price: 0 },
  ],
  rolls: [
    { name: "Krevetka", desc: "8 dona", price: 80000 },
    { name: "Duet", desc: "Ikki xil ta'm", price: 75000 },
    { name: "Avokado s nejniy krab", desc: "Avokado va yumshoq krab", price: 65000 },
    { name: "Roll Mango", desc: "Mango ta'mli roll", price: 70000 },
    { name: "Love KH", desc: "Sevgi uchun maxsus roll", price: 170000 },
    { name: "Roll Zapechonniy losos", desc: "8 dona", price: 45000 },
    { name: "Roll Filadelfiya", desc: "8 dona", price: 55000 },
    { name: "Roll Kaliforniya", desc: "8 dona", price: 55000 },
    { name: "Roll Mitaki", desc: "8 dona", price: 50000 },
  ],
  drinks: [
    { name: "Kola 1L", desc: "Sovuq ichimlik", price: 15000 },
    { name: "Kola 1.5L", desc: "Sovuq ichimlik", price: 20000 },
  ],
  extras: [
    { name: "Tar tar", desc: "Tar tar sousida", price: 15000 },
  ],
};

const fmt = (p) => p.toLocaleString("ru-RU") + " so'm";

function buildMenuText(categoryId) {
  const titles = {
    sets: "🍱 <b>Setlar</b>",
    rolls: "🍣 <b>Rollar</b>",
    drinks: "🥤 <b>Ichimliklar</b>",
    extras: "🥢 <b>Qo'shimcha</b>",
  };
  const items = menuData[categoryId] || [];
  const list = items
    .map((i) => {
      const price = i.price > 0 ? fmt(i.price) : "Narx bo'yicha qo'ng'iroq";
      return `• <b>${i.name}</b> — ${price}\n  <i>${i.desc}</i>`;
    })
    .join("\n\n");
  return `${titles[categoryId]}\n\n${list}\n\n📞 Buyurtma: +998 90 636 94 00`;
}

// ===== REPLY-КЛАВИАТУРА (внизу экрана) =====
const mainReplyKeyboard = {
  keyboard: [
    [{ text: "🍣 Menyu" }, { text: "📞 Buyurtma" }],
    [{ text: "🕐 Ish vaqti" }, { text: "📍 Manzil" }],
  ],
  resize_keyboard: true,
  is_persistent: true,
};

// ===== INLINE-КЛАВИАТУРЫ =====
const menuInlineKeyboard = {
  inline_keyboard: [
    [
      { text: "🍱 Setlar", callback_data: "cat_sets" },
      { text: "🍣 Rollar", callback_data: "cat_rolls" },
    ],
    [
      { text: "🥤 Ichimliklar", callback_data: "cat_drinks" },
      { text: "🥢 Qo'shimcha", callback_data: "cat_extras" },
    ],
  ],
};

const categoryInlineKeyboard = {
  inline_keyboard: [[{ text: "⬅️ Menyuga", callback_data: "menu" }]],
};

const locationInlineKeyboard = {
  inline_keyboard: [
    [
      {
        text: "🗺 Marshrutni ochish",
        url: "https://www.google.com/maps/dir/?api=1&destination=39.748209,64.416663",
      },
    ],
  ],
};

// ===== GET — установка вебхука =====
export async function GET(req) {
  if (!BOT_TOKEN) {
    return NextResponse.json(
      { ok: false, error: "TELEGRAM_BOT_TOKEN не задан" },
      { status: 500 }
    );
  }
  const url = new URL(req.url);
  const webhookUrl = `${url.protocol}//${url.host}/api/bot`;

  const setData = await fetch(`${API}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ["message", "callback_query"],
      drop_pending_updates: true,
    }),
  }).then((r) => r.json());

  const infoData = await fetch(`${API}/getWebhookInfo`).then((r) => r.json());

  return NextResponse.json({ webhookUrl, setWebhook: setData, info: infoData });
}

// ===== POST =====
export async function POST(req) {
  try {
    const update = await req.json();

    if (update.message) {
      const { chat, text = "" } = update.message;

      if (text === "/start" || text === "/help") {
        await sendMessage(
          chat.id,
          `🍣 <b>Sushi Tano</b> — Har luqmada did!\n\n` +
            `Assalomu alaykum! 👋\n` +
            `Premium roll va setlar, tez yetkazib berish.\n\n` +
            `🕐 Har kuni 10:00 – 00:00\n` +
            `📞 Buyurtma: +998 90 636 94 00\n\n` +
            `Quyidagi tugmalardan foydalaning 👇`,
          mainReplyKeyboard
        );
      } else if (text === "🍣 Menyu" || text === "/menu") {
        await sendMessage(
          chat.id,
          `📋 <b>Menyu</b>\n\nKategoriyani tanlang 👇`,
          menuInlineKeyboard
        );
      } else if (text === "📞 Buyurtma") {
        await sendMessage(
          chat.id,
          `📞 <b>Buyurtma berish</b>\n\n` +
            `Qo'ng'iroq qiling: <a href="tel:+998906369400">+998 90 636 94 00</a>\n\n` +
            `Yoki sayt: <a href="https://www.sushitano.uz">sushitano.uz</a>\n\n` +
            `🚀 Yetkazib berish — 30–60 daqiqa`,
          mainReplyKeyboard
        );
      } else if (text === "🕐 Ish vaqti") {
        await sendMessage(
          chat.id,
          `🕐 <b>Ish vaqti</b>\n\nHar kuni: <b>10:00 – 00:00</b>\n\nDam olish kunlarisiz! 🎉`,
          mainReplyKeyboard
        );
      } else if (text === "📍 Manzil") {
        await sendMessage(
          chat.id,
          `📍 <b>Manzil</b>\n\n` +
            `<b>Buxoro shahar, 5-mikrorayon</b>\n` +
            `Korzinka yon tomoni\n\n` +
            `📞 <a href="tel:+998906369400">+998 90 636 94 00</a>`,
          locationInlineKeyboard
        );
      } else {
        await sendMessage(
          chat.id,
          `Iltimos, quyidagi tugmalardan foydalaning 👇`,
          mainReplyKeyboard
        );
      }
    }

    if (update.callback_query) {
      const cq = update.callback_query;
      const chatId = cq.message.chat.id;
      await answerCallback(cq.id);

      const data = cq.data;

      if (data === "menu") {
        await sendMessage(
          chatId,
          `📋 <b>Menyu</b>\n\nKategoriyani tanlang 👇`,
          menuInlineKeyboard
        );
      } else if (data.startsWith("cat_")) {
        const categoryId = data.replace("cat_", "");
        await sendMessage(
          chatId,
          buildMenuText(categoryId),
          categoryInlineKeyboard
        );
      } else {
        await sendMessage(chatId, "Asosiy menyu 👇", mainReplyKeyboard);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Bot error:", err);
    return NextResponse.json({ ok: true });
  }
}