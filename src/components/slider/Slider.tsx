"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProductList } from "@/components/action";

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

interface ISlide {
  id: number;
  title: string;
  description: string;
  image: string;
  url: string;
  bg: string;
  products: IProduct[];
}

const Slider = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slides, setSlides] = useState<ISlide[]>([
    {
      id: 1,
      title: "당신이 주인공이 될 수도 있다.",
      description: "저렴하게 원하는 물건을 GET!",
      image: "/images/originbid.gif",
      url: "/list",
      bg: "/images/onlinebid.",
      products: [],
    },
    {
      id: 2,
      title: "인기폭발!",
      description: "현재 입찰 많은\n상품 TOP 3",
      image: "",
      url: "",
      bg: "/images/bidimage.png",
      products: [],
    },
    {
      id: 3,
      title: "긴급! 마감임박",
      description: "마감되기 전에\n관심 있는 상품을\n경매해보세요",
      image: "",
      url: "",
      bg: "/images/bidimage.png",
      products: [],
    },
    {
      id: 4,
      title: "Luxury",
      description: "현재 최고가 상품을\n확인해보세요",
      image: "",
      url: "",
      bg: "/images/bidimage.png",
      products: [],
    },
  ]);

  const imgUrl = "https://d3jzg5ylljnsnd.cloudfront.net"; // 이미지 URL 설정

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const products: IProduct[] = await getProductList();

        // 입찰 많은 순으로 정렬
        const sortedByBids = [...products].sort(
          (a, b) => b.num_bid - a.num_bid
        );

        // 남은 시간 순으로 정렬
        const sortedByTime = [...products].sort(
          (a, b) =>
            new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
        );

        // 현재 가격 높은 순으로 정렬
        const sortedByPrice = [...products].sort(
          (a, b) => b.highest_price - a.highest_price
        );

        setSlides((prevSlides) =>
          prevSlides.map((slide, index) => {
            if (slide.id === 2) {
              // 2번째 슬라이드는 입찰 많은 상품 TOP 3
              return {
                ...slide,
                products: sortedByBids.slice(0, 3),
              };
            } else if (slide.id === 3) {
              // 3번째 슬라이드는 남은 시간이 적은 상품 TOP 3
              return {
                ...slide,
                products: sortedByTime.slice(0, 3),
              };
            } else if (slide.id === 4) {
              // 4번째 슬라이드는 현재 가격 높은 상품 TOP 3
              return {
                ...slide,
                products: sortedByPrice.slice(0, 3),
              };
            }
            return {
              ...slide,
              products: products.slice(index * 4, index * 4 + 4),
            };
          })
        );
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProductList();

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const formatTimeDifference = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const totalMinutes = Math.ceil(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}일`);
    if (hours > 0) {
      const displayHours = minutes >= 59 ? hours + 1 : hours;
      if (displayHours > 0) parts.push(`${displayHours}시간`);
    }
    if (minutes > 0 || (hours > 0 && minutes < 59) || days > 0)
      parts.push(`${minutes}분`);
    if (parts.length === 0) parts.push("1분");

    return parts.join(" ");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(value);
  };

  return (
    <div className="container mx-auto py-8">
      <div
        className="relative rounded-lg overflow-hidden ring-2 ring-lime-800 ring-offset-4 ring-offset-slate-50 dark:ring-offset-slate-900 bg-no-repeat bg-left"
        style={{ backgroundImage: `url('/images/bamboo.jpg')` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide) => (
              <div
                className="w-full flex-shrink-0 flex items-center justify-center py-8"
                key={slide.id}
              >
                {slide.id === 1 ? (
                  <>
                    <div className="flex justify-center items-center w-full">
                      <div className="text-center mb-4">
                        <h2 className="text-xl lg:text-3xl text-white">
                          <span className="relative">
                            <span
                              className="block absolute -inset-1 -skew-y-3 bg-green-900"
                              aria-hidden="true"
                            ></span>
                            <span className="relative text-white">
                              저렴하게 원하는 물건을 GET!
                            </span>
                          </span>
                        </h2>
                        <h1 className="text-2xl lg:text-4xl font-semibold text-white mt-2">
                          <span className="relative">
                            <span
                              className="block absolute -inset-1 -skew-y-3 bg-green-900"
                              aria-hidden="true"
                            ></span>
                            <span className="relative text-white">
                              당신이 주인공이 될 수도 있다.
                            </span>
                          </span>
                        </h1>
                        <Link href={slide.url}>
                          <div className="inline-block mt-3 px-4 py-2 bg-black text-white rounded-md">
                            참여하기
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="flex justify-center items-center w-full h-full">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        width={900}
                        height={450}
                        className="object-contain rounded-md w-full h-full"
                        style={{ maxHeight: "450px" }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col md:flex-row justify-center items-center w-full">
                    <div className="text-center mb-4 md:mr-8">
                      <h2 className="text-xl lg:text-3xl text-white">
                        <span className="relative">
                          <span
                            className="block absolute -inset-1 -skew-y-3 bg-green-900"
                            aria-hidden="true"
                          ></span>
                          <span className="relative text-white">
                            {slide.title}
                          </span>
                        </span>
                      </h2>
                      <h1
                        className="text-2xl lg:text-4xl font-semibold text-white mt-2"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        <span className="relative">
                          <span
                            className="block absolute -inset-1 -skew-y-3 bg-green-900"
                            aria-hidden="true"
                          ></span>
                          <span className="relative text-white">
                            {slide.description}
                          </span>
                        </span>
                      </h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 relative">
                      {slide.products.slice(0, 3).map((product, index) => (
                        <div
                          className="flex bg-white p-4 rounded-lg shadow-lg h-[360px] w-[350px]"
                          key={product.product_id}
                        >
                          <Link href={"/product/" + product.product_id}>
                            <div className="relative">
                              {slide.id === 2 && index === 0 && (
                                <img
                                  src="/images/crown.gif"
                                  alt="Crown"
                                  width={70}
                                  height={70}
                                  className="absolute top-[-50px] left-[-50px]"
                                />
                              )}
                              {slide.id === 3 && index === 0 && (
                                <img
                                  src="/images/alarm.gif"
                                  alt="Alarm"
                                  width={70}
                                  height={70}
                                  className="absolute top-[-50px] left-[-50px]"
                                />
                              )}
                              {slide.id === 4 && index === 0 && (
                                <img
                                  src="/images/flymoney.gif"
                                  alt="Alert"
                                  width={100}
                                  height={100}
                                  className="absolute top-[-50px] left-[-50px]"
                                />
                              )}
                              <Image
                                src={`${imgUrl}/${product.product_id}/1.jpg`}
                                alt={product.product_name}
                                width={360}
                                height={300}
                                className="object-cover border border-gray-500 rounded-md h-[230px] w-[340px]" // 고정된 높이 설정
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    "/images/expired.png";
                                }}
                              />
                              <div className="mt-4">
                                <h4 className="text-xl font-bold text-black">
                                  <span className="relative">
                                    <span
                                      className="block absolute -inset-1 -skew-y-3 bg-pink-500"
                                      aria-hidden="true"
                                    ></span>
                                    <span className="relative text-white">
                                      {product.product_name}
                                    </span>
                                  </span>
                                </h4>
                                {slide.id === 2 ? (
                                  <p className="text-l font-semibold text-red-500 mt-2">
                                    현재 입찰 횟수: {product.num_bid}
                                  </p>
                                ) : slide.id === 3 ? (
                                  <p className="text-l font-semibold text-red-500 mt-2">
                                    남은 시간:{" "}
                                    {formatTimeDifference(
                                      new Date(product.end_date).getTime() -
                                        Date.now()
                                    )}
                                  </p>
                                ) : slide.id === 4 ? (
                                  <p className="text-l font-semibold text-red-500 mt-2">
                                    현재 가격:{" "}
                                    {formatCurrency(product.highest_price)}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-y-0 left-1 flex items-center">
          <button
            className="p-2 bg-black text-white rounded-full"
            onClick={() =>
              setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
            }
          >
            &#8249;
          </button>
        </div>
        <div className="absolute inset-y-0 right-1 flex items-center">
          <button
            className="p-2 bg-black text-white rounded-full"
            onClick={() =>
              setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
            }
          >
            &#8250;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Slider;
