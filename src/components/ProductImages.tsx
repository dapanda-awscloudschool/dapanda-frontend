"use client";

import Image from "next/image";
import { useState } from "react";

interface Product {
  product_id: string;
  product_name: string;
  file_count: number;
}

const ProductImages = ({ product }: { product: Product }) => {
  const [index, setIndex] = useState(0);
  const images = Array.from({ length: product.file_count }, (_, i) => ({
    id: i + 1,
    url: `https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/${
      product.product_id
    }/${i + 1}.jpg`,
  }));

  return (
    <div className="">
      <div className="h-[500px] relative">
        <Image
          src={images[index].url}
          alt={`${product.product_name} 이미지 ${index + 1}`}
          fill
          sizes=""
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex justify-between gap-4 mt-8">
        {images.slice(0, product.file_count).map((item, i) => (
          <div
            className="w-1/3 h-32 relative cursor-pointer"
            key={item.id}
            onClick={() => setIndex(i)}
          >
            <Image
              src={item.url}
              alt={`${product.product_name} 썸네일 ${i + 1}`}
              fill
              sizes="30vw"
              className="object-cover rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
