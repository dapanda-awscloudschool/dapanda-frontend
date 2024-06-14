"use client";

import Image from "next/image";
import { useState } from "react";

// 이미지 직접 가져올경우
// const images = [
//   {
//     id: 1,
//     url: "https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//   },
//   {
//     id: 2,
//     url: "https://images.pexels.com/photos/1233257/pexels-photo-1233257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//   },
//   {
//     id: 3,
//     url: "https://images.pexels.com/photos/8797943/pexels-photo-8797943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//   },
//   {
//     id: 4,
//     url: "https://images.pexels.com/photos/17630298/pexels-photo-17630298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//   },
// ];

const ProductImages = ({ items }: { items: any }) => {
  const [index, setIndex] = useState(0);
  return (
    <div className="">
      <div className="h-[500px] relative">
        <Image
          src={items[index].image?.url}
          alt=""
          fill
          sizes="50vw"
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex justify-between gap-4 mt-8">
        {items.map((item: any, i: number) => (
          <div
            className="w-1/4 h-32 relative gap-4 mt-8 cursor-pointer"
            key={item.id}
            onClick={() => setIndex(i)}
          >
            <Image
              src={item.image?.url}
              alt=""
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
