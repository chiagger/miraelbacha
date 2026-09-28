import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mira El Bacha · Gestione del sito",
  description:
    "Pannello riservato per aggiornare portfolio, CV e contatti di Mira El Bacha.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <a className="skip-link" href="#main-content">
          Vai ai contenuti
        </a>
        {children}
      </body>
    </html>
  );
}
