import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const SITE_URL = "https://www.sushitano.uz";
const PHONE = "+998906369400";
const TITLE = "Sushi va roll buyurtma qilish | Sushi Tano";
const DESCRIPTION =
  "Sushi Tano — premium roll va setlar. Nozik ta'm, tez yetkazib berish. Har kuni 10:00–00:00. Buyurtma: +998 90 636 94 00.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Sushi Tano",
  },
  description: DESCRIPTION,
  keywords: [
    "Sushi Tano",
    "sushi",
    "roll",
    "set",
    "sushi yetkazib berish",
    "sushi Toshkent",
    "premium sushi",
    "суши",
    "доставка суши",
  ],
  authors: [{ name: "Sushi Tano" }],
  creator: "Sushi Tano",
  publisher: "Sushi Tano",
  applicationName: "Sushi Tano",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: SITE_URL,
    siteName: "Sushi Tano",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 800,
        alt: "Sushi Tano — Premium Sushi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  other: {
    "format-detection": "telephone=no",
  },
};

export const viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Sushi Tano",
    image: `${SITE_URL}/images/logo.png`,
    url: SITE_URL,
    telephone: PHONE,
    servesCuisine: "Sushi",
    priceRange: "$$",
    slogan: "Har luqmada did!",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "00:00",
      },
    ],
    sameAs: ["https://www.instagram.com/sushi.tano_premium/"],
  };

  return (
    <html lang="uz">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}