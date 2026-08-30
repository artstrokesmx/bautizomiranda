import type { Metadata } from "next";
import { Cormorant_Garamond, MonteCarlo} from "next/font/google";
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

export const metadata: Metadata = {
  title: "Bautizo de Sofía Miranda",
  description: "Amando a Dios, la vida y la familia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${monteCarlo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
