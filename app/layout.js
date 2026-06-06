import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Egene Rideklub",
    template: "%s · Egene Rideklub",
  },
  description:
    "Egene Rideklub – et af Nordsjællands smukkest beliggende ridecentre. Rideskole, opstaldning og et stærkt springmiljø i Holte.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="da"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
