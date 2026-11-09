// src/app/api/bot/route.js
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

// ===== GET — установка/проверка вебхука через браузер =====
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

// ===== POST — обработка апдейтов от Telegram =====
export async function POST(req) {
    try {
        const update = await req.json();

        if (update.message) {
            const { chat, text = "" } = update.message;
            if (text === "/start" || text === "/help") {
                await sendMessage(
                    chat.id,
                    `🍣 <b>Sushi Tano</b> — Har luqmada did!\n\nPremium roll va setlar. Tez yetkazib berish.\n\nBo'limni tanlang:`,
                    mainKeyboard
                );
            } else {
                await sendMessage(
                    chat.id,
                    `Buyurtma uchun: <a href="tel:+998906369400">+998 90 636 94 00</a>`,
                    mainKeyboard
                );
            }
        }

        if (update.callback_query) {
            const cq = update.callback_query;
            const chatId = cq.message.chat.id;
            await answerCallback(cq.id);

            const replies = {
                menu: `📋 <b>Menyu</b>\n\n` +
                    `🍱 Setlar — 60 000 – 230 000 so'm\n` +
                    `🍣 Rollar — 65 000 – 170 000 so'm\n` +
                    `🥢 Qo'shimcha — 15 000 so'm\n\n` +
                    `To'liq menyu va rasmlar: <a href="https://www.sushitano.uz/#menu">sushitano.uz</a>`,

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

            await sendMessage(
                chatId,
                replies[cq.data] || "Noma'lum buyruq.",
                mainKeyboard
            );
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Bot error:", err);
        return NextResponse.json({ ok: true });
    }
}