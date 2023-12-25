import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  icons: "EdgeBot.svg",
  title: "MERNIFIER AI Chatbot",
  description:
    "Discover the excellence of GPT-4 in a compact form with our Lite GPT-4 Chatbot. It's designed for advanced conversational interactions, aiming to boost user involvement and contentment, perfectly suited for a MERN-based AI assistant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
