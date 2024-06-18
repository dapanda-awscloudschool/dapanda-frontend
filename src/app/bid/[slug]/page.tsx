import { getProductDetail } from "@/app/product/[slug]/action";
import { products } from "@wix/stores";
import { getProductList } from "@/components/action";
import BidInput from "@/components/BID/BidInput";
import Image from "next/image";

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

const BidPage = async ({ params }: { params: { slug: number } }) => {
  const product_id = params.slug;
  const product = await getProductDetail(product_id);

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-20">
      <div className="w-full lg:w-1/3 lg:sticky top-20 h-max">
        <Image
          src={`https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/${product_id}/1.jpg`}
          alt={product?.product_name}
          className="object-cover w-full h-auto rounded-md"
          width={200}
          height={200}
        />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product?.product_name}</h1>
        <p className="text-lg mb-2">현재 가격: {product?.highest_price} 원</p>
        <p className="text-lg mb-2">현재 입찰자 수: {product?.bid_member} 명</p>
        <p className="text-lg mb-2">
          현재 입찰자 명: {product?.bid_member_name}
        </p>
        <div className="flex items-center mb-4">
          <label
            htmlFor="bid                                                                                          Price"
            className="mr-2"
          >
            입찰:
          </label>
          <input
            type="number"
            id="bidPrice"
            className="border rounded-md p-2"
          />{" "}
          원
        </div>
        <button className="w-1/2 text-sm rounded-3xl ring-1 ring-dapanda text-dapanda py-2 px-4 hover:bg-dapanda hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none">
          입찰 확인
        </button>
      </div>
    </div>
  );
};

export default BidPage;

export const revalidate = 0;
