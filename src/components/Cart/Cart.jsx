"use client";

import { FiX, FiTrash2, FiMinus, FiPlus, FiPhone } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import "./Cart.css";
import { useEffect } from "react";

export default function Cart({ open, onClose }) {
    const {
        cart,
        changeQty,
        removeFromCart,
        clearCart,
        totalPrice,
        totalCount,
    } = useCart();

    useEffect(() => {
        if (open) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }
        return () => document.body.classList.remove("no-scroll");
    }, [open]);

    const format = (p) => p.toLocaleString("ru-RU") + " so'm";

    const handleOrder = () => {
        if (cart.length === 0) return;
        const lines = cart.map(
            (i) => `• ${i.name} x${i.qty} — ${format(i.price * i.qty)}`
        );
        const text = encodeURIComponent(
            `Assalomu alaykum! Buyurtma:\n${lines.join("\n")}\n\nJami: ${format(
                totalPrice
            )}`
        );
        window.location.href = `tel:+998906369400`;
        // если есть Telegram — можно вместо этого:
        // window.open(`https://t.me/sushitano?text=${text}`, "_blank");
    };

    return (
        <>
            <div
                className={`cart-overlay ${open ? "open" : ""}`}
                onClick={onClose}
            />
            <aside className={`cart ${open ? "open" : ""}`}>
                <div className="cart__header">
                    <h3>
                        Savat <span>({totalCount})</span>
                    </h3>
                    <button className="cart__close" onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <div className="cart__body">
                    {cart.length === 0 ? (
                        <div className="cart__empty">
                            <p>Savat bo'sh</p>
                            <span>Menyudan mazali taom tanlang 🍣</span>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="cart__item">
                                <img src={item.image} alt={item.name} />
                                <div className="cart__item-info">
                                    <div className="cart__item-name">{item.name}</div>
                                    <div className="cart__item-price">
                                        {format(item.price)}
                                    </div>
                                    <div className="cart__item-controls">
                                        <button onClick={() => changeQty(item.id, -1)}>
                                            <FiMinus />
                                        </button>
                                        <span>{item.qty}</span>
                                        <button onClick={() => changeQty(item.id, 1)}>
                                            <FiPlus />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    className="cart__item-remove"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart__footer">
                        <div className="cart__total">
                            <span>Jami:</span>
                            <strong>{format(totalPrice)}</strong>
                        </div>
                        <a
                            href="tel:+998906369400"
                            className="cart__order-btn"
                            onClick={handleOrder}
                        >
                            <FiPhone /> Buyurtma berish
                        </a>
                        <button className="cart__clear" onClick={clearCart}>
                            Savatni tozalash
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}