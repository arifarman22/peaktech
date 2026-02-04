import { Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PeakTech - Premium Electronics & Tech Store",
  description: "Shop the latest electronics, gadgets, and tech accessories at PeakTech. Best prices, fast shipping, and excellent customer service.",
  keywords: "electronics, gadgets, tech, computers, smartphones, accessories",
  openGraph: {
    title: "PeakTech - Premium Electronics & Tech Store",
    description: "Shop the latest electronics, gadgets, and tech accessories.",
    url: "https://peaktech.example.com",
    siteName: "PeakTech",
    images: [{ url: "/og-image.jpg" }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body className={`${nunito.variable} antialiased font-nunito selection:bg-indigo-100 selection:text-indigo-900`}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
