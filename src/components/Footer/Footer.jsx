"use client";

import { useEffect, useState } from "react";
import { FiPhone, FiClock, FiInstagram } from "react-icons/fi";
import "./Footer.css";

export default function Footer() {
    const [year, setYear] = useState(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer id="contact" className="footer">
            <div className="container footer__inner">
                <div>
                    <div className="footer__logo">Sushi Tano</div>
                    <p className="footer__slogan">Har luqmada did!</p>
                    <p className="footer__desc">
                        Premium roll va setlar. Tez yetkazib berish. Har kuni 10:00–00:00.
                    </p>
                </div>
                <div>
                    <h4>Aloqa</h4>
                    <p>
                        <FiPhone /> <a href="tel:+998906369400">+998 90 636 94 00</a>
                    </p>
                    <p>
                        <FiInstagram />{" "}
                        <a
                            href="https://www.instagram.com/sushi.tano_premium/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            @sushi.tano_premium
                        </a>
                    </p>
                    <p>
                        <FiClock /> 10:00 – 00:00
                    </p>
                </div>
                <div>
                    <h4>Buyurtma</h4>
                    <a href="tel:+998906369400" className="footer__btn">
                        <FiPhone /> Qo'ng'iroq qilish
                    </a>
                </div>
            </div>
            <div className="footer__bottom">
                <span>
                    © {year ?? ""} Sushi Tano. Barcha huquqlar himoyalangan.
                </span>
                <span className="footer__dev">
                    Ishlab chiqildi{" "}
                    <a href="https://www.akbarsoft.uz" target="_blank" rel="noreferrer">
                        Akbar Soft
                    </a>
                </span>
            </div>
        </footer>
    );
}