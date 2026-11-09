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

// ===== МЕНЮ =====
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
    ],
    rolls: [
        { name: "Krevetka", desc: "8 dona", price: 80000 },
        { name: "Duet", desc: "Ikki xil ta'm", price: 75000 },
        { name: "Avokado s nejniy krab", desc: "Avokado va yumshoq krab", price: 65000 },
        { name: "Roll Mango", desc: "Mango ta'mli roll", price: 70000 },
        { name: "Love KH", desc: "Sevgi uchun maxsus roll", price: 170000 },
    ],
    extras: [
        { name: "Tar tar", desc: "Tar tar sousida", price: 15000 },
    ],
};

function formatPrice(p) {
    return p.toLocaleString("ru-RU") + " so'm";
}

function buildMenuText(categoryId) {
    const titles = {
        sets: "🍱 <b>Setlar</b>",
        rolls: "🍣 <b>Rollar</b>",
        extras: "🥢 <b>Qo'shimcha</b>",
    };
    const items = menuData[categoryId] || [];
    const list = items
        .map((i) => `• <b>${i.name}</b> — ${formatPrice(i.price)}\n  <i>${i.desc}</i>`)
        .join("\n\n");
    return `${titles[categoryId]}\n\n${list}\n\n📞 Buyurtma: <a href="tel:+998906369400">+998 90 636 94 00</a>`;
}

// ===== КЛАВИАТУРЫ =====
const mainKeyboard = {
    inline_keyboard: [
        [
            { text: "🍣 Menyu", callback_data: "menu" },
            { text: "📞 Buyurtma", callback_data: "order" },
        ],
        [
            { text: "🕐 Ish vaqti", callback_data: "hours" },
            { text: "📍 Manzil", callback_data: "location" },
        ],
    ],
};

const menuKeyboard = {
    inline_keyboard: [
        [
            { text: "🍱 Setlar", callback_data: "cat_sets" },
            { text: "🍣 Rollar", callback_data: "cat_rolls" },
        ],
        [
            { text: "🥢 Qo'shimcha", callback_data: "cat_extras" },
            { text: "⬅️ Orqaga", callback_data: "back" },
        ],
    ],
};

const categoryKeyboard = {
    inline_keyboard: [
        [
            { text: "⬅️ Menyuga", callback_data: "menu" },
            { text: "📞 Buyurtma", callback_data: "order" },
        ],
    ],
};

const locationKeyboard = {
    inline_keyboard: [
        [
            {
                text: "🗺 Marshrutni ochish",
                url: "https://www.google.com/maps/dir/?api=1&destination=39.748209,64.416663",
            },
        ],
        [
            { text: "📞 Qo'ng'iroq qilish", url: "tel:+998906369400" },
            { text: "⬅️ Orqaga", callback_data: "back" },
        ],
    ],
};

const replies = {
    menu: `📋 <b>Menyu</b>\n\nKategoriyani tanlang 👇`,
    order: `📞 <b>Buyurtma berish</b>\n\n` +
        `Qo'ng'iroq qiling:\n` +
        `<a href="tel:+998906369400">+998 90 636 94 00</a>\n\n` +
        `Yoki sayt orqali: <a href="https://www.sushitano.uz">sushitano.uz</a>\n\n` +
        `🚀 Tez yetkazib berish — 30–60 daqiqa`,
    hours: `🕐 <b>Ish vaqti</b>\n\n` +
        `Har kuni: <b>10:00 – 00:00</b>\n\n` +
        `Dam olish kunlarisiz! 🎉`,
    location: `📍 <b>Manzil</b>\n\n` +
        `<b>Buxoro shahar, 5-mikrorayon</b>\n` +
        `Korzinka yon tomoni\n\n` +
        `📞 <a href="tel:+998906369400">+998 90 636 94 00</a>`,
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

    const setRes = await fetch(`${API}/setWebhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            url: webhookUrl,
            allowed_updates: ["message", "callback_query"],
            drop_pending_updates: true,
        }),
    });
    const setData = await setRes.json();

    const infoData = await fetch(`${API}/getWebhookInfo`).then((r) => r.json());

    return NextResponse.json({ webhookUrl, setWebhook: setData, info: infoData });
}

// ===== POST — обработка апдейтов =====
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
                    `Premium roll va setlar, yangi masalliqlar, tez yetkazib berish — barchasi siz uchun.\n\n` +
                    `🕐 Har kuni 10:00 – 00:00\n` +
                    `🚀 Buxoro bo'ylab yetkazib berish\n` +
                    `📞 Buyurtma: +998 90 636 94 00\n\n` +
                    `Quyidagi bo'limlardan birini tanlang 👇`,
                    mainKeyboard
                );
            } else if (text === "/menu") {
                await sendMessage(chat.id, replies.menu, menuKeyboard);
            } else {
                await sendMessage(
                    chat.id,
                    `Buyurtma uchun: <a href="tel:+998906369400">+998 90 636 94 00</a>\n` +
                    `Yoki /start buyrug'ini yuboring.`,
                    mainKeyboard
                );
            }
        }

        if (update.callback_query) {
            const cq = update.callback_query;
            const chatId = cq.message.chat.id;
            await answerCallback(cq.id);

            const data = cq.data;

            if (data === "location") {
                await sendMessage(chatId, replies.location, locationKeyboard);
            } else if (data === "menu") {
                await sendMessage(chatId, replies.menu, menuKeyboard);
            } else if (data === "back") {
                await sendMessage(chatId, "Asosiy menyu 👇", mainKeyboard);
            } else if (data.startsWith("cat_")) {
                const categoryId = data.replace("cat_", "");
                await sendMessage(
                    chatId,
                    buildMenuText(categoryId),
                    categoryKeyboard
                );
            } else {
                await sendMessage(
                    chatId,
                    replies[data] || "Noma'lum buyruq.",
                    mainKeyboard
                );
            }
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Bot error:", err);
        return NextResponse.json({ ok: true });
    }
}