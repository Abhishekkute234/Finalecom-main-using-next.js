// app/shop/page.tsx

import ShopBreadCrumb1 from "@/components/Shop/ShopBreadCrumb1";
import Breadcrumb from "@/components/Home/Heading";

export default function ShopPage() {
  return (
    <>
    <div className=" mt-8">

      {/* <Breadcrumb heading="Shop" subHeading="Shop" /> */}
      <ShopBreadCrumb1 />
    </div>
    </>
  );
}
