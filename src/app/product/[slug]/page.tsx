"use client";

import Add from "@/components/Add";
import ProductImages from "@/components/ProductImages";
import { getProductDetail } from "./action";
import { formatCurrency } from "@/components/formatCurrency";
import useSWR from "swr";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}년 ${month}월 ${day}일 ${hours}시${minutes}분`;
};

const formatTimeDifference = (ms: number) => {
  const totalMinutes = Math.floor(ms / 1000 / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  const parts = [];
  if (days > 0) parts.push(`${days}일`);
  if (hours > 0) parts.push(`${hours}시간`);
  if (minutes > 0) parts.push(`${minutes}분`);

  return parts.join(" ");
};

const SinglePage = ({ params }: { params: { slug: number } }) => {
  const { data: product, error } = useSWR(`/api/product/${params.slug}`, () =>
    getProductDetail(params.slug)
  );

  if (error) return <div>Failed to load product</div>;
  if (!product) return <div>Loading...</div>;

  const remainingTime = new Date(product.end_date).getTime() - Date.now();

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages product={product} />
      </div>
      {/* TEXTS */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product.product_name}</h1>
        <p className="text-gray-500">{product.product_info}</p>
        <div className="h-[2px] bg-gray-100" />
        <div className="flex items-center gap-4">
          <h3 className="text-medium font-medium text-gray-700">시작가:</h3>
          <h2 className="font-medium text-2xl">
            {formatCurrency(product.start_price)}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <h3 className="text-medium font-medium text-gray-700">현재가:</h3>
          <h2 className="font-medium text-2xl">
            {formatCurrency(product.highest_price)}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <h3 className="text-medium font-medium text-gray-700">시작 시간:</h3>
          <h2 className="font-medium text-xl">
            {formatDate(product.start_date)}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <h3 className="text-medium font-medium text-gray-700">종료 시간:</h3>
          <h2 className="font-medium text-xl">
            {formatDate(product.end_date)}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <h3 className="text-medium font-medium text-gray-700">남은 시간:</h3>
          <h2 className="font-medium text-xl text-red-600">
            {formatTimeDifference(remainingTime)}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <h3 className="text-medium font-medium text-gray-700">
            총 입찰 횟수:
          </h3>
          <h2 className="font-medium text-xl">{product.num_bid}</h2>
        </div>
        <div className="flex items-center gap-4">
          <h3 className="text-medium font-medium text-gray-700">
            현재 입찰자:
          </h3>
          <h2 className="font-medium text-xl">{product.bid_member}</h2>
        </div>
        <div className="h-[2px] bg-gray-100" />
        <Add id={product.product_id} />
        <div className="h-[2px] bg-gray-100" />
        {product.additionalInfoSections?.map((section: any) => (
          <div className="text-sm" key={section.title}>
            <h4 className="font-medium mb-4">{section.title}</h4>
            <p>{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SinglePage;
