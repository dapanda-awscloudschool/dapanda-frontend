import Image from "next/image";
import Link from "next/link";

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
  imageUrl: string;
}

const PRODUCT_PER_PAGE = 8;
const IMG_URL = process.env.API_URL_IMG;

const ProductList = async () => {
  const res = await getProductList();

  return (
    <div className="mt-12 flex gap-x-11 gap-y-16 justify-start flex-wrap">
      {res && res.length > 0 ? (
        res.map((product: IProduct) => (
          <Link
            href={"/product/" + product.product_id}
            className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
            key={product.product_id}
          >
            <div className="relative w-full h-80">
              <Image
                src={`${process.env.API_URL_IMG}/${product.product_id}/1.jpg`}
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
