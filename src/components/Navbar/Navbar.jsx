"use client";

import { useState } from "react";
import Image from "next/image";
import { FiPhone, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import "./Navbar.css";

export default function Navbar({ onCartOpen }) {
    const { totalCount } = useCart();
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = [
        { href: "#menu", label: "Menu" },
        { href: "#contact", label: "Aloqa" },
    ];

    return (
        <header className="navbar">
            <div className="container navbar__inner">
                <a href="#" className="navbar__logo">
                    <div className="navbar__logo-img">
                        <Image
                            src="/images/logo.png"
                            alt="Sushi Tano"
                            width={48}
                            height={48}
                            priority
                        />
                    </div>
                    <div>
                        <div className="navbar__logo-title">Sushi Tano</div>
                        <div className="navbar__logo-sub">PREMIUM</div>
                    </div>
                </a>

                <nav className={`navbar__links ${mobileOpen ? "open" : ""}`}>
                    {links.map((l) => (
                        <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>
                            {l.label}
                        </a>
                    ))}
                    <a href="tel:+998906369400" className="navbar__phone-mobile">
                        <FiPhone /> +998 90 636 94 00
                    </a>
                </nav>

                <div className="navbar__actions">
                    <a href="tel:+998906369400" className="navbar__phone">
                        <FiPhone />
                        <span>+998 90 636 94 00</span>
                    </a>
                    <button
                        className="navbar__cart"
                        onClick={onCartOpen}
                        aria-label="Savat"
                    >
                        <FiShoppingBag />
                        {totalCount > 0 && (
                            <span className="navbar__cart-badge">{totalCount}</span>
                        )}
                    </button>
                    <button
                        className="navbar__burger"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label="Menu"
                    >
                        {mobileOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>
        </header>
    );
}