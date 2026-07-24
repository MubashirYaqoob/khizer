import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CanonicalTag from "@/components/CanonicalTag";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Providers from "@/components/Providers";
import PageTransition from "@/components/PageTransition";
import Script from "next/script";
import AnnouncementBar from "@/components/AnnouncementBar";

// Load fonts
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-garamond",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jost",
  display: "swap",
  fallback: ["sans-serif"],
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Khizar Fabric Store | Premium Pakistani Unstitched & Ready-to-Wear",
  description:
    "Khizar Fabric Store — elevating traditional craftsmanship into contemporary luxury through meticulous fabric selection and design. Shop premium stitched, unstitched, and customized suits nationwide.",
  keywords: "Khizar Fabric Store, Pakistani suits, unstitched fabric, ready-to-wear, luxury pret, bridal wear, custom stitching, Pakistani clothing brand, KFS",
  icons: {
    icon: "/images/logo.jpg",
    shortcut: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
  openGraph: {
    title: "Khizar Fabric Store | Premium Pakistani Clothing",
    description: "Shop premium stitched, unstitched, and customized suits at Khizar Fabric Store. High-quality lawn, chiffon, and velvet fabrics.",
    url: "https://khizarfabrics.pk",
    siteName: "Khizar Fabric Store",
    images: [
      {
        url: "/images/logo.jpg",
        width: 800,
        height: 600,
        alt: "Khizar Fabric Store Logo",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${montserrat.variable} font-jost antialiased bg-surface text-primary min-h-screen flex flex-col`}>

        <Script id="clarity-script" strategy="afterInteractive">
          {`
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "x3j1wi8up6");
    `}
        </Script>
        <Providers>
          <CanonicalTag />
          {/* AnnouncementBar fixed at very top */}
          <div className="fixed w-full z-50 top-0 left-0 right-0">
            <AnnouncementBar />
          </div>
          {/* Navbar is self-fixed with its own z-40, sits below announcement bar */}
          <Navbar />
          {/* Page content — padded top so nothing hides behind fixed header */}
          <main className="flex-grow">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
