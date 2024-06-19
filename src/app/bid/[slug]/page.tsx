"use client";
import { useEffect, useState, useContext } from "react";
import { getProductDetail } from "@/app/product/[slug]/action";
import Image from "next/image";
import { formatCurrency } from "@/components/formatCurrency";
import { UserContext } from "@/components/login/UserContext";
import BidInput from "@/components/BID/BidInput";
import { useRouter } from "next/navigation";

const API_URL_SPRING = process.env.NEXT_PUBLIC_API_URL_SPRING || "";

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
  imageUrl: string; // 이미지 URL을 추가
}

const BidPage = ({ params }: { params: { slug: number } }) => {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [bidPrice, setBidPrice] = useState<number>(0);

  useEffect(() => {
    const fetchProduct = async () => {
      const product_id = params.slug;
      const productDetail = await getProductDetail(product_id);
      setProduct(productDetail);
      setBidPrice(productDetail.highest_price + productDetail.term_price);
    };

    fetchProduct();
  }, [params.slug]);

  const handleBidSubmit = async () => {
    if (!userContext || !userContext.user || !product) {
      console.error("User not logged in or product not loaded");
      return;
    }

    const userinfo = JSON.stringify({
      bidProductId: product.product_id,
      bidMemberID: userContext.user.memberId,
      bidPrice: bidPrice,
    });

    const blob = new Blob([userinfo], { type: "application/json" });
    const formData = new FormData();
    formData.append("BidReqInfo", blob);

    try {
      const response = await fetch(`${API_URL_SPRING}/api/spring/bid`, {
        method: "POST",
        body: formData,
        mode: "cors", // CORS 모드 설정
      });

      if (response.ok) {
        router.push(`/product/${product.product_id}`);
      } else {
        console.error("Failed to submit bid:", await response.text());
      }
    } catch (error) {
      console.error("Failed to submit bid:", error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-20">
      <div className="w-full lg:w-1/3 lg:sticky top-20 h-max">
        <Image
          src={`https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/${product.product_id}/1.jpg`}
          alt={product?.product_name}
          className="object-cover w-full h-auto rounded-md"
          width={200}
          height={200}
        />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product?.product_name}</h1>
        <p className="text-lg mb-2">
          현재 가격: {formatCurrency(product?.highest_price)}
        </p>
        <p className="text-lg mb-2">
          최소 입찰 단가: {formatCurrency(product?.term_price)}
        </p>
        <p className="text-lg mb-2">현재 입찰자 수: {product?.num_bid} 명</p>
        <p className="text-lg mb-2">현재 입찰자 명: {product?.bid_member}</p>
        <BidInput
          highestPrice={product?.highest_price}
          termPrice={product?.term_price}
          bidPrice={bidPrice}
          setBidPrice={setBidPrice}
        />
        <button
          className="w-1/2 text-sm rounded-3xl ring-1 ring-dapanda text-dapanda py-2 px-4 hover:bg-dapanda hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none"
          onClick={handleBidSubmit}
        >
          입찰 확인
        </button>
      </div>
    </div>
  );
};

export default BidPage;
