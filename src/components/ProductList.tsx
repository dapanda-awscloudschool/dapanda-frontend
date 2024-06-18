import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import Pagination from "./Pagination";
import { getProductList } from "./action";
import { Button } from "@nextui-org/react";
import { CiHeart } from "react-icons/ci";
import { formatCurrency } from "./formatCurrency";

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

const PRODUCT_PER_PAGE = 8;

const ProductList = async ({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}) => {
  const res = await getProductList();

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {res && res.length > 0 ? (
        res.map((product: IProduct) => (
          <Link
            href={"/product/" + product.product_id}
            className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
            key={product.product_id}
          >
            <div className="relative w-full h-80">
              <Image
                src={`https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/${product.product_id}/1.jpg`} // 템플릿 리터럴을 사용하여 URL에 변수 삽입
                alt={product.product_name}
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md"
              />
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <p className="font-medium">{product.product_name}</p>
              <p className="font-semibold">
                현재가: {formatCurrency(product.highest_price)}
              </p>
              <Button
                className="text-dapanda border-dapanda w-1/2 disabled:bg-pink-200 disabled:text-white disabled:ring-none"
                variant="bordered"
                startContent={<CiHeart />}
              >
                찜하기
              </Button>
            </div>
          </Link>
        ))
      ) : (
        <p>상품이 없습니다.</p> // 아이템이 없을 때의 처리
      )}
      {/* <Pagination
        currentPage={res.currentPage || 0}
        hasPrev={res.hasPrev()}
        hasNext={res.hasNext()}
      /> */}
    </div>
  );
};

export default ProductList;
