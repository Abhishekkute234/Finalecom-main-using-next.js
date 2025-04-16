import SliderMarketplace from "@/components/Home/Slider";
import BannerAbove from "@/components/Home/BannerAbove";
import Deal from "@/components/Home/Deal";
import Collection from "@/components/Home/Collection";
import BestSeller from "@/components/Home/BestSeller";
import BannerBelow from "@/components/Home/BannerBelow";
import TopProduct from "@/components/Home/TopProduct";
import Recommend from "@/components/Home/Recommend";
import Benefit from "@/components/Home/Benefit";
import Brand from "@/components/Home/Brand";


// Fetch products by subcategory
async function fetchProductsBySubCategory(
  subCategory: string,
  limit: number = 5
): Promise<any[]> {
  try {
    const url = `${
      process.env.NEXT_PUBLIC_API_URL || "http://imagingv3.vercel.app/"
    }/api/products?subcategory=${encodeURIComponent(
      subCategory
    )}&limit=${limit}&t=${Date.now()}`; // Added timestamp to bypass caching

    const response = await fetch(url, {
      cache: "no-store", // Ensure no caching
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products for subcategory ${subCategory}: ${response.status}`
      );
    }

    const data = await response.json();

    return data.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Main Home Page Component
export default async function Home() {
  // Fetch products for specific subcategories
  const [memoryCardsProducts, tripodsProducts, bestSellerProducts] =
    await Promise.all([
      fetchProductsBySubCategory("Camera Bags"), // Fetch products with subcategory "Memory Cards"
      fetchProductsBySubCategory("Tripods"), // Fetch products with subcategory "Tripods"
      fetchProductsBySubCategory("Memory Cards"),
    ]);

  return (
    <>
      <div id="header" className="relative w-full animate-fadeIn transition-opacity duration-500 ease-in-out">
        <SliderMarketplace />
      </div>
      <BannerAbove />
      <div className="">

      <Deal products={memoryCardsProducts} loading={false} />
      </div>
<div className="animate-fadeIn transition-opacity duration-500 ease-in-out">

      <Collection />
</div>
      <BestSeller products={bestSellerProducts} loading={false} />
      <BannerBelow />
      <TopProduct products={tripodsProducts} loading={false}  />
      <Recommend products={tripodsProducts} loading={false} />
      <Benefit props="md:py-[60px] py-10 border-b border-line" />
      <Brand />
    </>
  );
}
