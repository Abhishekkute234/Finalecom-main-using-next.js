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

import ClientSessionProvider from "@/context/ClientSessionProvider";

const serverTimeLeft: CountdownTimeType = countdownTime();

export const metadata: Metadata = {
  title: "ImagingGifts",
  description: "Best Cameras In India",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GlobalProvider>
      <html lang="en">
        <body>
          <ClientSessionProvider>
            <TopNavOne
              props="style-marketplace bg-[#263587] border-b border-surface1"
              slogan="New customers save 10% with the code GET10"
            />
            <ShopMainMenu />
            {children}
            <SpeedInsights />
            <ModalCart serverTimeLeft={serverTimeLeft} />
            <ModalWishlist />

            <ModalQuickview />
            <ModalCompare />
            <Footer />
          </ClientSessionProvider>
        </body>
      </html>
    </GlobalProvider>
  );
}
