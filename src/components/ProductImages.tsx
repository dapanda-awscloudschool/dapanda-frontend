"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface Product {
  product_id: number;
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
    url: `https://d37s44h8v1f2oo.cloudfront.net/${product.product_id}/${
      i + 1
    }.jpg`,
  }));

  // 디폴트 이미지 설정
  const defaultImage = {
    id: 0,
    url: "/images/expired.png",
  };

  // 이미지 배열이 비어 있는 경우 디폴트 이미지 사용
  const displayedImages = images.length > 0 ? images : [defaultImage];

  useEffect(() => {
    console.log("Image URLs:", displayedImages);
  }, [displayedImages]);

  return (
    <div className="">
      <div className="h-[500px] relative">
        <Image
          src={displayedImages[index].url}
          alt={`${product.product_name} 이미지 ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain rounded-md border border-gray-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/expired.png";
          }}
        />
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Image
              src="/images/expired.png" // "SOLD OUT" 이미지의 경로
              alt="Sold Out"
              width={500} // 필요한 크기로 조정
              height={500} // 필요한 크기로 조정
              className="object-contain"
            />
          </div>
        )}
      </div>
      <div className="flex justify-between gap-4 mt-8">
        {displayedImages.map((item, i) => (
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
              className="object-cover rounded-md border border-gray-500"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/images/expired.png";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
