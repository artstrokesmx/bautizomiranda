import type { Metadata } from "next";
import { Cormorant_Garamond, MonteCarlo } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const monteCarlo = MonteCarlo({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-monte-carlo",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : "https://bautizomiranda.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Bautizo de Sofía Miranda",
  description: "Amando a Dios, la vida y la familia.",
  openGraph: {
    title: "Bautizo de Sofía Miranda",
    description: "Amando a Dios, la vida y la familia.",
    url: "/",
    siteName: "Bautizo de Sofía Miranda",
    images: [
      {
        url: "/virgencitafb.png",
        width: 1200,
        height: 630,
        alt: "Bautizo de Sofía Miranda",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bautizo de Sofía Miranda",
    description: "Amando a Dios, la vida y la familia.",
    images: ["/virgencitafb.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${monteCarlo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}