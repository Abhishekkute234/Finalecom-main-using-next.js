import type { Metadata } from "next";
import "@/styles/styles.scss";
import GlobalProvider from "./GlobalProvider";
import ModalCart from "@/components/Modal/ModalCart";
import ModalWishlist from "@/components/Modal/ModalWishlist";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ModalQuickview from "@/components/Modal/ModalQuickview";
import ModalCompare from "@/components/Modal/ModalCompare";
import CountdownTimeType from "@/type/CountdownType";
import { countdownTime } from "@/store/countdownTime";
import ShopMainMenu from "@/components/Shop/ShopMainMenu";
import TopNavOne from "@/components/Home/TopNavOne";
import Footer from "@/components/Home/Footer";
import Script from "next/script";
import { ToastContainer } from "react-toastify";



const serverTimeLeft: CountdownTimeType = countdownTime();

export const metadata: Metadata = {
  title: "Imaging Gifts - Best Cameras and Photography Gear in India",
  description:
    "Explore India's top selection of cameras, including DSLRs, mirrorless, and action cameras, perfect for professionals, vloggers, and beginners. Find top-rated camera brands like Canon, Nikon, Sony, and Fujifilm. Discover photography accessories, lenses, tripods, and more to elevate your creativity. Shop the best deals, compare features, and get expert advice on choosing the right gear. Perfect imaging gifts for photographers of all levels.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GlobalProvider>
      <html lang="en">
        <head>

          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />


          <link rel="icon" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" sizes="16x16" href="/favicon-16x16.png" />


          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />


          <link rel="manifest" href="/site.webmanifest" />
          <link rel="icon" sizes="192x192" href="/android-chrome-192x192.png" />
          <link rel="icon" sizes="512x512" href="/android-chrome-512x512.png" />

          <meta name="theme-color" content="#ffffff" />
        </head>
        <body>

          <TopNavOne
            props="style-marketplace bg-[#263587] border-b border-surface1"
            slogan="New customers save 10% with the code GET10"
          />
          <ShopMainMenu />
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="afterInteractive" // Ensures the script loads early
          />
          <ToastContainer />

          {children}
          <SpeedInsights />
          <ModalCart serverTimeLeft={serverTimeLeft} />
          <ModalWishlist />
          <ModalQuickview />
          <ModalCompare />
          <Footer />

        </body>
      </html>
    </GlobalProvider>
  );
}
