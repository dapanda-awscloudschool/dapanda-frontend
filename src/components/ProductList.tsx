"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductList, searchProducts } from "./action";
import { Button } from "@nextui-org/react";
import { formatCurrency } from "./formatCurrency";
import useSWR from "swr";
import FavoriteButton from "./favoritelist/FavoriteButton";

interface IProduct {
  product_id: number;
  register_member: number;
  category: string;
  product_name: string;
  register_date: string;
  start_date: string;
  end_date: string;
  term_price: number;
  start_price: number;
  highest_price: number;
  bid_member_name: null | string;
  immediate_purchase_price: number;
  immediate_purchase_status: number;
  num_bid: number;
  auction_status: number;
  product_info: string;
  file_count: number;
  bid_member: null | number;
  register_member_name: string;
  imageUrl: string;
  view_num: number;
}

const formatTimeDifference = (ms: number) => {
  const totalMinutes = Math.floor(ms / 1000 / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  const parts = [];
  if (days > 0) parts.push({ value: `${days}`, unit: "일" });
  if (hours > 0) parts.push({ value: `${hours}`, unit: "시간" });
  if (minutes > 0) parts.push({ value: `${minutes}`, unit: "분" });

  return parts;
};

const ProductList = ({
  searchParams = {},
  maxItems,
  sortCriteria,
  sortOrder,
}: {
  searchParams?: any;
  maxItems?: number;
  sortCriteria?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const searchQuery = searchParams.name || "";
  const sortQuery = searchParams.sort || sortCriteria;
  const order = sortOrder || "desc";

  const fetcher = searchQuery
    ? () => searchProducts(searchQuery)
    : getProductList;

  const {
    data: productList,
    error,
    isLoading,
  } = useSWR(["getProductList", searchQuery], fetcher);

  const imgUrl = "https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com";

  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [user, setUser] = useState<number | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData.memberId);
    }
  }, []);

  useEffect(() => {
    if (!imgUrl) {
      console.error("Image URL is not defined.");
    }
  }, [imgUrl]);

  // Apply sorting logic based on sortQuery
  const sortedProducts = productList
    ? [...productList].sort((a, b) => {
        switch (sortQuery) {
          case "asc":
            return b.highest_price - a.highest_price;
          case "desc":
            return a.highest_price - b.highest_price;
          case "recent":
            return (
              new Date(b.start_date).getTime() -
              new Date(a.start_date).getTime()
            );
          case "old":
            return (
              new Date(a.start_date).getTime() -
              new Date(b.start_date).getTime()
            );
          case "bidders":
            return order === "asc"
              ? a.num_bid - b.num_bid
              : b.num_bid - a.num_bid;
          case "views":
            return order === "asc"
              ? a.view_num - b.view_num
              : b.view_num - a.view_num;
          default:
            return 0; // Default: no sorting
        }
      })
    : [];

  // Apply maxItems limit
  const limitedProducts = maxItems
    ? sortedProducts.slice(0, maxItems)
    : sortedProducts;

  return (
    <div className="mt-12 flex gap-x-10 gap-y-16 flex-wrap">
      {isLoading && <p>Loading...</p>}
      {error && <p>Failed to load products</p>}
      {limitedProducts && limitedProducts.length > 0 ? (
        limitedProducts.map((product: IProduct) => {
          const remainingTime =
            new Date(product.end_date).getTime() - Date.now();
          const formattedTime = formatTimeDifference(remainingTime);

          // 기본 이미지 URL
          const imageUrl = `${imgUrl}/${product.product_id}/1.jpg`;
          // 마우스 오버 시 보여줄 이미지 URL
          const hoverImageUrl = `${imgUrl}/${product.product_id}/2.jpg`;

          return (
            <div
              className="relative w-full flex flex-col gap-4 sm:w-[45%] lg:w-[30%] border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
              key={product.product_id}
              onMouseEnter={() => setHoveredProduct(product.product_id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Link href={"/product/" + product.product_id}>
                <div className="relative border border-black rounded-lg w-full h-80">
                  <Image
                    src={
                      product.file_count > 1 &&
                      hoveredProduct === product.product_id
                        ? hoverImageUrl
                        : imageUrl
                    }
                    alt={product.product_name}
                    fill
                    sizes="25vw"
                    className="absolute object-cover rounded-md"
                    onError={(e) => {
                      console.error(
                        `Failed to load image for product ${product.product_id}: ${e.currentTarget.src}`
                      );
                      (e.currentTarget as HTMLImageElement).src =
                        "/images/expired.png";
                    }}
                  />
                </div>
                <div className="flex flex-col justify-center items-center gap-2 mt-3">
                  <p className="font-bold font-sans text-xl">
                    {product.product_name}
                  </p>
                  <p className="font-semibold">
                    현재가: {formatCurrency(product.highest_price)}
                  </p>
                  <p className="font-semibold">
                    남은 시간:{" "}
                    {formattedTime.map((part, index) => (
                      <span key={index} className="text-xl text-red-500">
                        {part.value}
                        {part.unit}{" "}
                      </span>
                    ))}
                  </p>
                </div>
              </Link>
              <div className="flex flex-row gap-5 items-center justify-center">
                <Link href={"/product/" + product.product_id}>
                  <Button
                    className="text-dapanda border-dapanda w-1/2 disabled:bg-pink-200 disabled:text-white disabled:ring-none"
                    variant="bordered"
                  >
                    상세보기
                  </Button>
                </Link>
                {user !== null && (
                  <FavoriteButton
                    productId={product.product_id}
                    memberId={user}
                  />
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p>상품이 없습니다.</p>
      )}
    </div>
  );
};

export default ProductList;
