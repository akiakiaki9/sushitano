import { FiClock, FiTruck, FiStar } from "react-icons/fi";
import "./Hero.css";

export default function Hero() {
    return (
        <section className="hero">
            <div className="container hero__inner">
                <div className="hero__content">
                    <div className="hero__tag">
                        <FiStar /> PREMIUM SUSHI
                    </div>
                    <h1 className="hero__title">
                        Sushi Tano — <br />
                        <span>Har luqmada did!</span>
                    </h1>
                    <p className="hero__desc">
                        Yangi roll va setlar. Tez yetkazib berish. Har kuni 10:00–00:00.
                    </p>
                    <div className="hero__actions">
                        <a href="#menu" className="btn btn--gold">
                            Menyuni ko'rish
                        </a>
                        <a href="tel:+998906369400" className="btn btn--outline">
                            Buyurtma berish
                        </a>
                    </div>
                    <div className="hero__features">
                        <div className="hero__feature">
                            <FiTruck />
                            <span>Tez yetkazib berish</span>
                        </div>
                        <div className="hero__feature">
                            <FiClock />
                            <span>10:00 – 00:00</span>
                        </div>
                        <div className="hero__feature">
                            <FiStar />
                            <span>Premium sifat</span>
                        </div>
                    </div>
                </div>
                <div className="hero__image">
                    <img
                        src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800"
                        alt="Sushi Tano"
                    />
                </div>
            </div>
        </section>
    );
}