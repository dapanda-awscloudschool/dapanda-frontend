import { Suspense } from "react";
import ProductList from "@/components/ProductList";
import Slider from "@/components/slider/Slider";
import Link from "next/link";
import Image from "next/image";

const HomePage = () => {
  return (
    <div className="">
      <Slider />
      <div className="mt-3 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-semibold font-gothic">주요 제품</h1>
          <Link href="/list">
            <div className="text-sm text-gray-500 font-bold mr-16">
              더보기 &gt;
            </div>
          </Link>
        </div>
        <Suspense fallback={"loading"}>
          <ProductList searchParams={undefined} maxItems={6} />
        </Suspense>
      </div>
      <div className="mt-12 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold font-gothic">
            최근 올라온 상품
          </h1>
          <Link href="/list">
            <div className="text-sm text-gray-500 font-bold mr-16">
              더보기 &gt;
            </div>
          </Link>
        </div>
        <ProductList
          searchParams={undefined}
          maxItems={6} // 최근 올라온 상품 6개로 제한
          sortCriteria="start_date" // 정렬 기준을 start_date로 설정
          sortOrder="desc" // 내림차순 정렬
        />
      </div>
      <div className="mt-12 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold flex items-center font-gothic">
            <Image
              src="/images/flame.gif"
              alt="Fire Gif"
              width={24} // 원하는 크기로 설정
              height={24} // 원하는 크기로 설정
              className="mr-2"
            />
            인기 상품
          </h1>
          <Link href="/list">
            <div className="text-sm text-gray-500 font-bold mr-16">
              더보기 &gt;
            </div>
          </Link>
        </div>
        <ProductList
          searchParams={undefined}
          maxItems={3} // 인기 상품 3개로 제한
          sortCriteria="num_bid"
          sortOrder="desc"
        />
      </div>
    </div>
  );
};

export default HomePage;
