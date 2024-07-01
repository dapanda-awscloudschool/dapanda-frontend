import { Suspense } from "react";
import ProductList from "@/components/ProductList";
import Slider from "@/components/Slider";
import Link from "next/link";
import { BsFire } from "react-icons/bs";

const HomePage = async () => {
  return (
    <div className="">
      <Slider />
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <div className="flex justify-between items-center mb-4">
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
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold font-gothic">
            최근 올라온 상품
          </h1>
          <Link href="/new">
            <div className="text-sm text-gray-500 font-bold mr-16">
              더보기 &gt;
            </div>
          </Link>
        </div>
        <ProductList
          searchParams={undefined}
          maxItems={6}
          sortCriteria="register_date"
          sortOrder="desc"
        />
      </div>
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold flex items-center font-gothic">
            <BsFire className="text-red-500 mr-2" />
            인기 상품
          </h1>
          <Link href="/popular">
            <div className="text-sm text-gray-500 font-bold mr-16">
              더보기 &gt;
            </div>
          </Link>
        </div>
        <ProductList
          searchParams={undefined}
          maxItems={3}
          sortCriteria="num_bid"
          sortOrder="desc"
        />
      </div>
    </div>
  );
};

export default HomePage;
