// app/layout.tsx
import { Metadata } from "next";
import "@/styles/styles.scss";
import AppProviders from "./providers/AppProviders";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ShopMainMenu from "@/components/Shop/ShopMainMenu";
import TopNavOne from "@/components/Home/TopNavOne";
import Footer from "@/components/Home/Footer";
import ModalContainer from "@/components/Modal/ModalContainer"; // client component
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Imaging Gifts - Best Cameras and Photography Gear in India",
  description:
    "Explore India's top selection of cameras, including DSLRs, mirrorless, and action cameras, perfect for professionals, vloggers, and beginners. Find top-rated camera brands like Canon, Nikon, Sony, and Fujifilm. Discover photography accessories, lenses, tripods, and more to elevate your creativity. Shop the best deals, compare features, and get expert advice on choosing the right gear. Perfect imaging gifts for photographers of all levels.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
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
          <ToastContainer />
          {children}
          <SpeedInsights />
          <ModalContainer />
          <Footer />
        </body>
      </html>
    </AppProviders>
  );
}
