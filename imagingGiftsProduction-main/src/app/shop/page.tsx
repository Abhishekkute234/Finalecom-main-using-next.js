// app/shop/page.tsx

import ShopBreadCrumb1 from "@/components/Shop/ShopBreadCrumb1";
import Breadcrumb from "@/components/Home/Heading";

export default function ShopPage() {
  return (
    <>
      <Breadcrumb heading="Shop" subHeading="Shop" />
      <ShopBreadCrumb1 />
    </>
  );
}
