import Image from "next/image";
import ProductList from "@/components/ProductList";
import { Suspense } from "react";
import Filter from "@/components/Filter";

const ListPage = async ({ searchParams }: { searchParams: any }) => {
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 relative">
      {/* CAMPAIGN */}
      <div className="hidden bg-pink-50 p-4 sm:flex justify-between h-64">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
            경매를 통해 원하는 물품을
            <br /> 저렴하게 가져가세요
          </h1>
          <button className="rounded-3xl bg-dapanda text-white w-max py-3 px-5 text-sm">
            구매하기
          </button>
        </div>
        <div className="relative w-1/3">
          <Image src="/woman.png" alt="" fill className="object-contain" />
        </div>
      </div>
      {/* FILTER */}
      <Filter />
      {/* PRODUCT */}
      <h1 className="mt-12 text-xl font-semibold">something</h1>
      <Suspense fallback={"Loading..."}>
        <ProductList searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default ListPage;
