"use client";

import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductList } from "./action";
import { Button } from "@nextui-org/react";
import { FaHeart } from "react-icons/fa";
import { formatCurrency } from "./formatCurrency";
import useSWR from "swr";
import { UserContext } from "@/context/userContext";
import FavoriteButton from "./FavoriteButton";

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

const ProductList = () => {
  const {
    data: productList,
    error,
    isLoading,
  } = useSWR("getProductList", getProductList);
  const imgUrl = process.env.NEXT_PUBLIC_API_URL_IMG;
  const API_URL = process.env.API_URL_DJANGO;

  const { userData } = useContext(UserContext);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    //console.log("API_URL:", API_URL);
    if (!imgUrl) {
      console.error("Image URL is not defined in the environment variables.");
    }
    //console.log("userData:", userData);
  }, [imgUrl, userData]);

  const handleFavoriteClick = async (
    e: React.MouseEvent,
    productId: number
  ) => {
    e.preventDefault(); // 링크로 이동하지 않도록 방지

    const memberId = userData[0]?.memberId;
    //console.log("memberId:", memberId);
    //console.log("productId:", productId);

    if (!API_URL || !memberId) {
      console.error("API_URL or memberId is not defined.");
      return;
    }

    if (favorites[productId]) {
      // 이미 찜된 상태라면 찜 목록에서 제거하는 로직을 추가할 수 있습니다.
      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        [productId]: !prevFavorites[productId],
      }));
      return;
    }

    const url = `${API_URL}/api/django/wishlist/${memberId}/${productId}/`;
    const body = JSON.stringify({
      member_id: memberId,
      product_id: productId,
    });

    // console.log("POST URL:", url);
    //console.log("POST Body:", body);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      // console.log("response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        throw new Error("Failed to add to wishlist");
      }

      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        [productId]: !prevFavorites[productId],
      }));
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  return (
    <div className="mt-12 flex gap-x-10 gap-y-16 flex-wrap">
      {isLoading && <p>Loading...</p>}
      {error && <p>Failed to load products</p>}
      {productList && productList.length > 0 ? (
        productList.map((product: IProduct) => {
          const remainingTime =
            new Date(product.end_date).getTime() - Date.now();
          const formattedTime = formatTimeDifference(remainingTime);

          return (
            <div className="relative w-full flex flex-col gap-4 sm:w-[45%] lg:w-[30%] border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
              <Link
                href={"/product/" + product.product_id}
                key={product.product_id}
              >
                <div className="relative w-full h-80">
                  <Image
                    src={`${imgUrl}/${product.product_id}/1.jpg`}
                    alt={product.product_name}
                    fill
                    sizes="25vw"
                    className="absolute object-cover rounded-md"
                    onError={(e) => {
                      console.error(
                        `Failed to load image for product ${product.product_id}: ${e.currentTarget.src}`
                      );
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
                <Link
                  href={"/product/" + product.product_id}
                  key={product.product_id}
                >
                  <Button
                    className="text-dapanda border-dapanda w-1/2 disabled:bg-pink-200 disabled:text-white disabled:ring-none"
                    variant="bordered"
                  >
                    상세보기
                  </Button>
                </Link>
                <FavoriteButton productId={product.product_id} />
              </div>
            </div>
          );
        })
      ) : (
        <p>상품이 없습니다.</p> // 아이템이 없을 때의 처리
      )}
    </div>
  );
};

export default ProductList;
