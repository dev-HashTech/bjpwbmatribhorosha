import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600", "700", "800"],
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-noto-bengali",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "মাতৃশক্তি ভরসা কার্ড | BJP",
  description: "বিজেপি সরকার আসলেই — মাতৃশক্তি ভরসা কার্ড প্রকল্পে নাম নথিভুক্ত করুন",
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.variable} ${notoSansBengali.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
