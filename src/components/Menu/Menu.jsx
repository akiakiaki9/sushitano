"use client";

import { useEffect, useState } from "react";
import { FiX, FiPlus, FiMinus } from "react-icons/fi";
import { categories, menuItems } from "@/data/menu";
import { useCart } from "@/context/CartContext";
import MenuCard from "./MenuCard";
import "./Menu.css";

export default function Menu() {
    const [active, setActive] = useState("all");
    const [selected, setSelected] = useState(null);
    const [qty, setQty] = useState(1);
    const { addToCart } = useCart();

    const filtered =
        active === "all"
            ? menuItems
            : menuItems.filter((i) => i.category === active);

    // Блокировка скролла при открытой модалке
    useEffect(() => {
        if (selected) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }
        return () => document.body.classList.remove("no-scroll");
    }, [selected]);

    // Закрытие по Escape
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && setSelected(null);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const openItem = (item) => {
        setSelected(item);
        setQty(1);
    };

    const format = (p) => p.toLocaleString("ru-RU") + " so'm";

    const handleAdd = () => {
        for (let i = 0; i < qty; i++) addToCart(selected);
        setSelected(null);
    };

    return (
        <section id="menu" className="menu">
            <div className="container">
                <div className="menu__header">
                    <h2 className="menu__title">
                        Bizning <span>menyu</span>
                    </h2>
                    <p className="menu__sub">Yangi roll va setlar har kuni</p>
                </div>

                <div className="menu__tabs">
                    {categories.map((c) => (
                        <button
                            key={c.id}
                            className={`menu__tab ${active === c.id ? "active" : ""}`}
                            onClick={() => setActive(c.id)}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>

                <div className="menu__grid">
                    {filtered.map((item) => (
                        <MenuCard key={item.id} item={item} onOpen={openItem} />
                    ))}
                </div>
            </div>

            {/* Модалка блюда */}
            {/* Модалка блюда */}
            {selected && (
                <div className="dish-modal" onClick={() => setSelected(null)}>
                    <div
                        className="dish-modal__content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="dish-modal__close"
                            onClick={() => setSelected(null)}
                            aria-label="Yopish"
                        >
                            <FiX />
                        </button>
                        <div className="dish-modal__image">
                            <img src={selected.image} alt={selected.name} />
                        </div>
                        <div className="dish-modal__body">
                            <h3>{selected.name}</h3>
                            <p>{selected.desc}</p>
                            <div className="dish-modal__price">{format(selected.price)}</div>

                            <div className="dish-modal__controls">
                                <div className="dish-modal__qty">
                                    <button
                                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                                        aria-label="Kamaytirish"
                                    >
                                        <FiMinus />
                                    </button>
                                    <span>{qty}</span>
                                    <button
                                        onClick={() => setQty((q) => q + 1)}
                                        aria-label="Ko'paytirish"
                                    >
                                        <FiPlus />
                                    </button>
                                </div>
                                <button className="dish-modal__add" onClick={handleAdd}>
                                    <FiPlus /> Savatga qo'shish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}