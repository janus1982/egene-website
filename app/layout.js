import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatBot from "./components/ChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://egene.dk"),
  title: {
    default: "Egene Rideklub",
    template: "%s · Egene Rideklub",
  },
  description:
    "Egene Rideklub – et af Nordsjællands smukkest beliggende ridecentre. Rideskole, opstaldning og et stærkt springmiljø i Holte.",
  openGraph: {
    siteName: "Egene Rideklub",
    locale: "da_DK",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// Strukturerede data til Google (LocalBusiness / SportsClub)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsClub",
  name: "Egene Rideklub",
  alternateName: "Egene Ridecenter",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Høje Sandbjergvej 4",
    addressLocality: "Holte",
    postalCode: "2840",
    addressCountry: "DK",
  },
  telephone: "+4527140133",
  email: "kontakt@egene.dk",
  url: "https://egene.dk",
  sameAs: [
    "https://www.facebook.com/pages/Ridecentret-Egene/141125835941239",
    "https://www.instagram.com/egeneridecenter_/",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="da"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <ChatBot />
      </body>
    </html>
  );
}
