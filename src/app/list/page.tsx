import Image from "next/image";
import ProductList from "@/components/ProductList";
import { Suspense } from "react";
import Filter from "@/components/Filter";
import { Pagination, Button } from "@nextui-org/react";

const ListPage = async ({ searchParams }: { searchParams: any }) => {
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* NAVBAR MARGIN */}
      <div className="mt-5"></div>

      {/* CAMPAIGN */}
      <div className="hidden bg-lime-50 p-4 sm:flex justify-between h-64 mb-12">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
            경매를 통해 원하는 물품을
            <br /> 저렴하게 가져가세요
          </h1>
          <button className="rounded-3xl bg-lime-600 text-white w-max py-3 px-5 text-sm">
            구매하기
          </button>
        </div>
        <div className="relative w-1/3">
          <Image src="/woman.png" alt="" fill className="object-contain" />
        </div>
      </div>

      {/* FILTER */}
      <div className="flex items-center justify-between mt-4 mb-4">
        <h1 className="text-2xl font-semibold">전체 상품</h1>
        <div className="flex-grow items-center w-48">
          <Filter />
        </div>
      </div>

      {/* PRODUCT */}
      <Suspense fallback={"Loading..."}>
        <ProductList searchParams={searchParams} />
      </Suspense>

      <div className="flex justify-center mt-8">
        <Pagination
          total={10}
          initialPage={1}
          classNames={{
            wrapper: "gap-0 overflow-visible h-12 rounded  border-divider",
            item: "w-10 h-10 text-medium rounded-none bg-transparent",
            cursor:
              "bg-gradient-to-b shadow-lg from-lime-200 to-lime-600 dark:from-default-300 dark:to-default-50 text-white font-bold",
          }}
        />
      </div>
    </div>
  );
};

export default ListPage;
