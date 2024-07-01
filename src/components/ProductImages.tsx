"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface Product {
  product_id: string;
  product_name: string;
  file_count: number;
}

interface ProductImagesProps {
  product: Product;
  isSoldOut?: boolean;
}

const ProductImages = ({ product, isSoldOut = false }: ProductImagesProps) => {
  const [index, setIndex] = useState(0);
  const images = Array.from({ length: product.file_count }, (_, i) => ({
    id: i + 1,
    url: `https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/${
      product.product_id
    }/${i + 1}.jpg`,
  }));

  useEffect(() => {
    console.log("Image URLs:", images);
  }, [images]);

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
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Image
              src="/images/soldout.png" // "SOLD OUT" 이미지의 경로
              alt="Sold Out"
              width={500} // 필요한 크기로 조정
              height={500} // 필요한 크기로 조정
              className="object-contain"
            />
          </div>
        )}
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
