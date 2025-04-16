// app/home/HomeServer.tsx
import BannerAbove from '@/components/Home/BannerAbove';
import BannerBelow from '@/components/Home/BannerBelow';
import Benefit from '@/components/Home/Benefit';
import BestSeller from '@/components/Home/BestSeller';
import Brand from '@/components/Home/Brand';
import Collection from '@/components/Home/Collection';
import Deal from '@/components/Home/Deal';
import Recommend from '@/components/Home/Recommend';
import SliderMarketplace from '@/components/Home/Slider';
import TopProduct from '@/components/Home/TopProduct';
import React from 'react';

// Helper function to fetch products by subcategory
async function fetchProductsBySubCategory(subCategory: string, limit: number = 5): Promise<any[]> {
  const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products?subcategory=${encodeURIComponent(subCategory)}&limit=${limit}&t=${Date.now()}`;
  
  const response = await fetch(url, {
    cache: 'no-store', // Prevent caching, ensure fresh data on every request
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products for ${subCategory}`);
  }

  const data = await response.json();
  return data.data || [];
}

export default async function HomeServer() {
  // Fetch products for different subcategories
  const [memoryCardsProducts, tripodsProducts, bestSellerProducts] = await Promise.all([
    fetchProductsBySubCategory('Camera Bags'),
    fetchProductsBySubCategory('Tripods'),
    fetchProductsBySubCategory('Memory Cards'),
  ]);

  return (
    <>
      <div id="header" className="relative w-full animate-fadeIn transition-opacity duration-500 ease-in-out">
        <SliderMarketplace />
      </div>
      <BannerAbove />
      <div>
        <Deal products={memoryCardsProducts} loading={false} />
      </div>
      <div className="animate-fadeIn transition-opacity duration-500 ease-in-out">
        <Collection />
      </div>
      <BestSeller products={bestSellerProducts} loading={false} />
      <BannerBelow />
      <TopProduct products={tripodsProducts} loading={false} />
      <Recommend products={tripodsProducts} loading={false} />
      <Benefit props="md:py-[60px] py-10 border-b border-line" />
      <Brand />
    </>
  );
}
