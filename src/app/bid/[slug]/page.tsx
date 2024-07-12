"use client";

import { useRouter } from "next/navigation"; // next/navigation로 변경 필요
import { useEffect, useState, useRef } from "react";
import { getProductDetail } from "@/app/product/[slug]/action";
import Image from "next/image";
import { formatCurrency } from "@/components/formatCurrency";
import BidInput from "@/components/BID/BidInput";

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
  last_bid_date: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}년 ${month}월 ${day}일 ${hours}시${minutes}분`;
};

const BidPage = ({ params }: { params: { slug: number } }) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bidPrice, setBidPrice] = useState<number>(0);
  const [userIsTyping, setUserIsTyping] = useState<boolean>(false); // 사용자 입력 상태를 관리
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null); // 타이핑 타임아웃을 관리

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product_id = params.slug;
        const productDetail = await getProductDetail(product_id);
        if (productDetail) {
          setProduct(productDetail);
          if (!userIsTyping) {
            // 사용자가 타이핑 중이 아닐 때만 값을 업데이트
            setBidPrice(productDetail.highest_price + productDetail.term_price);
          }
        } else {
          setError("데이터가 없습니다.");
        }
      } catch (error) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    const intervalId = setInterval(fetchProduct, 1000); // 1초마다 fetchProduct 호출

    return () => {
      clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
    };
  }, [params.slug, userIsTyping]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-20 mt-5">
      <div className="w-full lg:w-1/3 lg:sticky top-20 h-max">
        <Image
          src={`https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/${product.product_id}/1.jpg`}
          alt={product.product_name}
          className="object-cover w-full h-auto rounded-md"
          width={200}
          height={200}
        />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-6 mt-8">
        <h1 className="text-4xl font-medium">{product.product_name}</h1>
        <p className="text-lg mb-2">
          현재 가격: {formatCurrency(product.highest_price)}
        </p>
        <p className="text-lg mb-2">
          최소 입찰 단가: {formatCurrency(product.term_price)}
        </p>
        <p className="text-lg mb-2">
          마지막 입찰 시간: {formatDate(product.last_bid_date)}
        </p>
        <p className="text-lg mb-2">현재 입찰 횟수: {product.num_bid} 번</p>
        <p className="text-lg mb-2">현재 입찰자 명: {product.bid_member}</p>
        <BidInput
          highestPrice={product.highest_price}
          termPrice={product.term_price}
          bidPrice={bidPrice}
          setBidPrice={(price) => {
            setBidPrice(price);
            setUserIsTyping(true);
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
              setUserIsTyping(false);
            }, 1000); // 1초 동안 입력이 없으면 타이핑 상태를 false로 변경
          }}
          productId={product.product_id}
        />
      </div>
    </div>
  );
};

export default BidPage;
