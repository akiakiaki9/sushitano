"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "sushi_tano_cart";

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [hydrated, setHydrated] = useState(false);

    // Загружаем корзину из localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setCart(JSON.parse(saved));
        } catch (e) {
            console.error("Cart load error", e);
        }
        setHydrated(true);
    }, []);

    // Сохраняем корзину при любом изменении
    useEffect(() => {
        if (!hydrated) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }, [cart, hydrated]);

    const addToCart = (item) => {
        setCart((prev) => {
            const found = prev.find((p) => p.id === item.id);
            if (found) {
                return prev.map((p) =>
                    p.id === item.id ? { ...p, qty: p.qty + 1 } : p
                );
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((p) => p.id !== id));
    };

    const changeQty = (id, delta) => {
        setCart((prev) =>
            prev
                .map((p) => (p.id === id ? { ...p, qty: p.qty + delta } : p))
                .filter((p) => p.qty > 0)
        );
    };

    const clearCart = () => setCart([]);

    const totalCount = cart.reduce((s, i) => s + i.qty, 0);
    const totalPrice = cart.reduce((s, i) => s + i.qty * i.price, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                changeQty,
                clearCart,
                totalCount,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
}