"use client";

import { FiPlus } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import "./MenuCard.css";

export default function MenuCard({ item, onOpen }) {
    const { addToCart } = useCart();

    const formatPrice = (p) => p.toLocaleString("ru-RU") + " so'm";

    return (
        <div className="menu-card">
            <button
                type="button"
                className="menu-card__image"
                onClick={() => onOpen(item)}
                aria-label={item.name}
            >
                <img src={item.image} alt={item.name} loading="lazy" />
            </button>
            <div className="menu-card__body">
                <h3 className="menu-card__name">{item.name}</h3>
                <p className="menu-card__desc">{item.desc}</p>
                <div className="menu-card__footer">
                    <span className="menu-card__price">{formatPrice(item.price)}</span>
                    <button
                        className="menu-card__add"
                        onClick={() => addToCart(item)}
                        aria-label="Savatga qo'shish"
                    >
                        <FiPlus />
                    </button>
                </div>
            </div>
        </div>
    );
}