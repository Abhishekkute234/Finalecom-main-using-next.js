import type { Metadata } from "next";
import "@/styles/styles.scss";
import GlobalProvider from "./GlobalProvider";
import ModalCart from "@/components/Modal/ModalCart";
import ModalWishlist from "@/components/Modal/ModalWishlist";
import ModalSearch from "@/components/Modal/ModalSearch";
import ModalQuickview from "@/components/Modal/ModalQuickview";
import ModalCompare from "@/components/Modal/ModalCompare";
import CountdownTimeType from "@/type/CountdownType";
import { countdownTime } from "@/store/countdownTime";
import ShopMainMenu from "@/components/Shop/ShopMainMenu";
import TopNavOne from "@/components/Home/TopNavOne";
import Footer from "@/components/Home/Footer";

const serverTimeLeft: CountdownTimeType = countdownTime();



export const metadata: Metadata = {
  title: "ImagingGifts",
  description: "Best Camera Shop",
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
          <TopNavOne
            props="style-marketplace bg-[#263587] border-b border-surface1"
            slogan="New customers save 10% with the code GET10"
          />
          <ShopMainMenu />
          {children}

          <ModalCart serverTimeLeft={serverTimeLeft} />
          <ModalWishlist />
          <ModalSearch />
          <ModalQuickview />
          <ModalCompare />
          <Footer />
        </body>
      </html>
    </GlobalProvider>
  );
}
