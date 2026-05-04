import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Consultoria Gastronomica",
  description: "MVP interno para gestion economica gastronomica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
