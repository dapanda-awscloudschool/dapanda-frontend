"use client";

import Add from "@/components/Add";
import ProductImages from "@/components/ProductImages";
import { getProductDetail } from "./action";
import { formatCurrency } from "@/components/formatCurrency";
import useSWR from "swr";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0"); // 초 단위 추가

  return `${year}년 ${month}월 ${day}일 ${hours}시${minutes}분${seconds}초`;
};

const formatDateWithoutSeconds = (dateString: string) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}년 ${month}월 ${day}일 ${hours}시${minutes}분`;
};

const formatTimeDifference = (ms: number) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const totalMinutes = Math.ceil(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}일`);
  if (hours > 0) {
    const displayHours = minutes >= 59 ? hours + 1 : hours;
    if (displayHours > 0) parts.push(`${displayHours}시간`);
  }
  if (minutes > 0 || (hours > 0 && minutes < 59) || days > 0)
    parts.push(`${minutes}분`);
  if (parts.length === 0) parts.push("1분");

  return parts.join(" ");
};

const SinglePage = ({ params }: { params: { slug: number } }) => {
  const router = useRouter();
  const { data: product, error } = useSWR(`/api/product/${params.slug}`, () =>
    getProductDetail(params.slug)
  );

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "info",
        title: "경매 종료",
        text: "해당 물품의 경매가 종료되었습니다.",
        confirmButtonText: "확인",
      }).then(() => {
        router.push("/"); // 메인 페이지로 리다이렉션
      });
    }
  }, [error, router]);

  if (!product) return <div className="text-center">Loading...</div>;

  const remainingTime = new Date(product.end_date).getTime() - Date.now();

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16 mt-5">
      <div className="w-full lg:w-1/2 top-3 h-max relative">
        <ProductImages product={product} />
      </div>
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
          <h3 className="text-medium font-medium text-gray-700">
            마지막 입찰 시간:
          </h3>
          <h2 className="font-medium text-xl">
            {product.last_bid_date
              ? formatDateWithoutSeconds(product.last_bid_date)
              : ""}
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
          <h3 className="text-medium font-medium text-gray-700">조회수:</h3>
          <h2 className="font-medium text-xl">{product.view_num}</h2>
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
