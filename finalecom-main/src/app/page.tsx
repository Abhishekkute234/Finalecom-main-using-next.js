import blogData from "@/data/Blog.json";
import productData from "@/data/Product.json";
import ModalNewsletter from "@/components/Modal/ModalNewsletter";

import SliderMarketplace from "@/components/Home/Slider";
import BannerAbove from "@/components/Home/BannerAbove";
import Deal from "@/components/Home/Deal";
import Collection from "@/components/Home/Collection";
import BestSeller from "@/components/Home/BestSeller";
import BannerBelow from "@/components/Home/BannerBelow";
import TopProduct from "@/components/Home/TopProduct";
import Recommend from "@/components/Home/Recommend";
import NewsInsight from "@/components/Home/NewsInsight";
import Benefit from "@/components/Home/Benefit";
import Brand from "@/components/Home/Brand";

export default function Home() {
  return (
    <>
      <div id="header" className="relative w-full">
        <SliderMarketplace />
      </div>
      <BannerAbove />
      <Deal />
      <Collection />
      <BestSeller data={productData} start={0} limit={5} />
      <BannerBelow />
      <TopProduct />
      <Recommend />
      <NewsInsight data={blogData} start={18} limit={21} />
      <Benefit props="md:py-[60px] py-10 border-b border-line" />
      <Brand />

      {/* <ModalNewsletter /> */}
    </>
  );
}
