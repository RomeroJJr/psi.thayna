import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Thayna Christer | Psicologia Clínica em João Pessoa e online",
  description:
    "Conheça Thayna Christer, psicóloga clínica CRP 13/11584. Psicoterapia para crianças, adolescentes e adultos, online e em João Pessoa, PB.",
  icons: { icon: "/favicon.svg" },
  alternates: { types: { "application/rss+xml": "/caderno.xml" } },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
