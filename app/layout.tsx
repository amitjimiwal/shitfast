import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShitFast  | Daily Neuro-boost for Builders",
  description:
    "Daily Neuro-boost for founders and makers who love to ship fast and build products",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ShitFast  | Daily Neuro-boost for Builders",
    description:
      "Daily Neuro-boost for founders and makers who love to ship fast and build products",
    url: "https://shitfast.stackforgelabs.icu",
    images: [
      "https://res.cloudinary.com/dejzy9q65/image/upload/v1744973411/Screenshot_Capture_-_2025-04-18_-_16-17-22_k1qjue.png",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShitFast  | Daily Neuro-boost for Builders",
    description:
      "Daily Neuro-boost for founders and makers who love to ship fast and build products",
    creator: "@notamit_dev",
    images: [
      "https://res.cloudinary.com/dejzy9q65/image/upload/v1744973411/Screenshot_Capture_-_2025-04-18_-_16-17-22_k1qjue.png",
    ],
  },
  keywords:
    "ShitFast, Daily Maxims, Founders, Makers, Ship Fast, Build Better, OpenAI, GroQ, ShipFast, Guide for Solopreneur, Indie Hackers",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-K4002PC7PK"
      ></Script>
      <Script id="google-analytics">
        {`  window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-K4002PC7PK');`}
      </Script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
