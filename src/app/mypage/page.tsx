"use client";

import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Tabs, Tab, Chip } from "@nextui-org/react";
import {
  member,
  pWishList,
  saleHistory,
  buyHistory,
  salebid,
  mybid,
  updateMember,
} from "./action";
import Image from "next/image";
import Link from "next/link";
import { GalleryIcon } from "./GalleryIcon";
import { MusicIcon } from "./MusicIcon";
import { VideoIcon } from "./videoIcon";
import { UserContext } from "@/context/userContext";
import { formatCurrency } from "@/components/formatCurrency";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import "./style.css"; // CSS 파일을 불러오기
import { getProductList } from "@/components/action";

interface IMember {
  name: string;
  phone_num: number;
  address: string;
  email: string;
}

interface IWishlist {
  id: number;
  product_name: string;
  price: number;
  my_bid: number | null;
  imageUrl: string;
}

interface Historyproduct {
  product_id: number;
  category: string;
  product_name: string;
  start_date: string;
  end_date: string;
  last_bid_date: string;
  term_price: number;
  start_price: number;
  end_price: number;
  num_bid: number;
  auction_status: number;
  file_count: number;
  product_info: string;
  view_num: number;
  register_member_id: number;
  award_member_id: number;
  imageUrl: string;
}

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
  view_num: number;
}

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const MyPage = () => {
  const router = useRouter();
  const { userData } = useContext(UserContext);
  const memberId = userData[0]?.memberId;

  const [profile, setProfile] = useState<IMember>({
    name: "이름",
    phone_num: 0,
    email: "name@domain.com",
    address: "서울특별시 마포구 독막로112",
  });
  const [wishList, setWishList] = useState<IWishlist[]>([]);
  const [history, setHistory] = useState<Historyproduct[]>([]);
  const [bHistory, setBHistory] = useState<Historyproduct[]>([]);
  const [saleBid, setSaleBid] = useState<IProduct[]>([]);
  const [myBid, setMyBid] = useState<IProduct[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formValues, setFormValues] = useState(profile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Historyproduct | null>(
    null
  );
  const [recommendedProducts, setRecommendedProducts] = useState<IProduct[]>(
    []
  );

  useEffect(() => {
    async function fetchMemberInfo() {
      try {
        if (!memberId) {
          throw new Error("User ID not found");
        }
        const data = await member(memberId);
        setProfile(data);
        setFormValues(data);
      } catch (error) {
        console.error("Failed to fetch member info:", error);
      }
    }

    async function fetchWishlist() {
      try {
        if (!memberId) {
          throw new Error("User ID not found");
        }
        const data = await pWishList(memberId);
        if (data && Array.isArray(data)) {
          setWishList(
            data.map((item) => ({
              id: item.product.product_id,
              product_name: item.product.product_name,
              price: item.product.highest_price,
              my_bid: null,
              imageUrl: `https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/${item.product.product_id}/1.jpg`,
            }))
          );
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    }

    async function fetchHistory() {
      try {
        if (!memberId) {
          throw new Error("User ID not found");
        }
        const data = await saleHistory(memberId);
        if (data && Array.isArray(data)) {
          setHistory(
            data.map((item) => ({
              ...item,
              imageUrl: `https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/${item.product_id}/1.jpg`,
            }))
          );
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    }

    async function fetchBuyHistory() {
      try {
        if (!memberId) {
          throw new Error("User ID not found");
        }
        const data = await buyHistory(memberId);
        if (data && Array.isArray(data)) {
          setBHistory(
            data.map((item) => ({
              ...item,
              imageUrl: `https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/${item.product_id}/1.jpg`,
            }))
          );
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Failed to fetch buy history:", error);
      }
    }

    async function fetchSaleBid() {
      try {
        if (!memberId) {
          throw new Error("User ID not found");
        }
        const data = await salebid(memberId);
        if (data && Array.isArray(data)) {
          setSaleBid(
            data.map((item) => ({
              ...item,
              imageUrl: `https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/${item.product_id}/1.jpg`,
            }))
          );
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Failed to fetch sale bid history:", error);
      }
    }

    async function fetchMyBid() {
      try {
        if (!memberId) {
          throw new Error("User ID not found");
        }
        const data = await mybid(memberId);
        if (data && Array.isArray(data)) {
          setMyBid(
            data.map((item) => ({
              ...item,
              imageUrl: `https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/${item.product_id}/1.jpg`,
            }))
          );
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Failed to fetch my bid history:", error);
      }
    }

    async function fetchRecommendedProducts() {
      try {
        const data = await getProductList();
        if (data && Array.isArray(data)) {
          const shuffled = shuffleArray(
            data.map((item) => ({
              ...item,
              imageUrl: `https://dapanda-files-test.s3.ap-northeast-2.amazonaws.com/${item.product_id}/1.jpg`,
            }))
          );
          setRecommendedProducts(shuffled.slice(0, 2));
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Failed to fetch recommended products:", error);
      }
    }

    fetchMemberInfo();
    fetchWishlist();
    fetchHistory();
    fetchBuyHistory();
    fetchSaleBid();
    fetchMyBid();
    fetchRecommendedProducts(); // 추가된 부분
  }, [memberId]);

  const handleEditClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!memberId) {
        throw new Error("User ID not found");
      }

      const updatedProfile = await updateMember(memberId, formValues);
      setProfile(updatedProfile);
      handleClosePopup();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const isExpired = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    return now > end;
  };

  const handlePaymentClick = (
    event: React.MouseEvent,
    product: Historyproduct
  ) => {
    event.stopPropagation(); // 이벤트 전파를 막음
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">마이페이지</h1>
      <div className="border p-4 rounded-lg shadow-lg mb-8">
        <div className="flex items-center mb-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <Image
              src="/pandaprofile.png"
              alt="Profile Image"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <div className="ml-4">
            <p className="text-xl font-semibold">{profile.name}</p>
            <p>{profile.phone_num}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <p>이메일: {profile.email}</p>
          <p>배송지: {profile.address}</p>
        </div>
        <button
          className="bg-lime-600 text-white px-4 py-2 rounded"
          onClick={handleEditClick}
        >
          수정
        </button>
      </div>

      <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-[#22d3ee]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#06b6d4]",
        }}
      >
        <Tab
          key="wishlist"
          title={
            <div className="flex items-center space-x-2">
              <GalleryIcon />
              <span>찜 목록</span>
              <Chip size="sm" variant="faded">
                {wishList.length}
              </Chip>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {wishList.map((item) => (
              <div
                key={item.id}
                className="border p-4 rounded-lg shadow-lg flex cursor-pointer"
                onClick={() => router.push(`/product/${item.id}`)}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.product_name}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div className="ml-4">
                  <p className="font-semibold">{item.product_name}</p>
                  <p>현재 입찰가: {formatCurrency(item.price)}</p>
                  {item.my_bid !== null && (
                    <p>내 입찰가: {formatCurrency(item.my_bid)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Tab>
        <Tab
          key="sales"
          title={
            <div className="flex items-center space-x-2">
              <MusicIcon />
              <span>나의 과거 판매 목록</span>
              <Chip size="sm" variant="faded">
                {history.length}
              </Chip>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {history.map((item) => (
              <div
                key={item.product_id}
                className="border p-4 rounded-lg shadow-lg flex cursor-pointer"
                onClick={() =>
                  router.push(`/product_history/${item.product_id}`)
                }
              >
                <Image
                  src={item.imageUrl}
                  alt={item.product_name}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div className="ml-4 flex justify-between w-full items-center">
                  <div>
                    <p className="font-semibold">{item.product_name}</p>
                    <p>종료가: {formatCurrency(item.end_price)}</p>
                    <p>입찰 횟수: {item.num_bid}</p>
                    <p>
                      상태:{" "}
                      {isExpired(item.end_date)
                        ? "판매 종료"
                        : item.auction_status === 1
                        ? "완료"
                        : "진행 중"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Tab>
        <Tab
          key="purchases"
          title={
            <div className="flex items-center space-x-2">
              <VideoIcon />
              <span>나의 과거 구매 목록</span>
              <Chip size="sm" variant="faded">
                {bHistory.length}
              </Chip>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {bHistory.map((item) => (
              <div
                key={item.product_id}
                className="border p-4 rounded-lg shadow-lg flex cursor-pointer"
                onClick={() =>
                  router.push(`/product_history/${item.product_id}`)
                }
              >
                <Image
                  src={item.imageUrl}
                  alt={item.product_name}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div className="ml-4 flex justify-between w-full items-center">
                  <div>
                    <p className="font-semibold">{item.product_name}</p>
                    <p>최종 입찰가: {formatCurrency(item.end_price)}</p>
                    <p>입찰 횟수: {item.num_bid}</p>
                    <p>
                      상태:{" "}
                      {isExpired(item.end_date)
                        ? "판매 종료"
                        : item.auction_status === 1
                        ? "완료"
                        : "진행 중"}
                    </p>
                  </div>
                  {isExpired(item.end_date) && (
                    <button
                      className="bg-lime-600 text-white px-2 py-1 text-sm rounded"
                      onClick={(e) => handlePaymentClick(e, item)}
                    >
                      결제하기
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Tab>
        <Tab
          key="salebid"
          title={
            <div className="flex items-center space-x-2">
              <VideoIcon />
              <span>현재 진행중인 나의 경매 목록</span>
              <Chip size="sm" variant="faded">
                {saleBid.length}
              </Chip>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {saleBid.map((item) => (
              <div
                key={item.product_id}
                className="border p-4 rounded-lg shadow-lg flex cursor-pointer"
                onClick={() => router.push(`/product/${item.product_id}`)}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.product_name}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div className="ml-4">
                  <p className="font-semibold">{item.product_name}</p>
                  <p>현재 입찰가: {formatCurrency(item.highest_price)}</p>
                  <p>입찰 횟수: {item.num_bid}</p>
                  <p>
                    상태:{" "}
                    {isExpired(item.end_date)
                      ? "판매 종료"
                      : item.auction_status === 1
                      ? "완료"
                      : "진행 중"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Tab>
        <Tab
          key="mybid"
          title={
            <div className="flex items-center space-x-2">
              <VideoIcon />
              <span>현재 진행중인 나의 입찰 목록</span>
              <Chip size="sm" variant="faded">
                {myBid.length}
              </Chip>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {myBid.map((item) => (
              <div
                key={item.product_id}
                className="border p-4 rounded-lg shadow-lg flex cursor-pointer"
                onClick={() => router.push(`/product/${item.product_id}`)}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.product_name}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div className="ml-4">
                  <p className="font-semibold">{item.product_name}</p>
                  <p>현재 입찰가: {formatCurrency(item.highest_price)}</p>
                  <p>입찰 횟수: {item.num_bid}</p>
                  <p>
                    상태:{" "}
                    {isExpired(item.end_date)
                      ? "판매 종료"
                      : item.auction_status === 1
                      ? "완료"
                      : "진행 중"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Tab>
      </Tabs>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">회원정보 수정</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium">
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phone_num"
                  className="block text-sm font-medium"
                >
                  전화번호
                </label>
                <input
                  type="text"
                  id="phone_num"
                  name="phone_num"
                  value={formValues.phone_num}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium">
                  주소
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formValues.address}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{ paper: "dialog-container" }}
      >
        <DialogTitle id="alert-dialog-title" className="dialog-title">
          {"결제하기"}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <div className="dialog-left">
            {selectedProduct && (
              <div className="payment-dialog-content">
                <Image
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.product_name}
                  width={150}
                  height={150}
                  className="product-image"
                />
                <Typography variant="h6" style={{ marginBottom: "10px" }}>
                  {selectedProduct.product_name}
                </Typography>
                <div className="price-summary">
                  <div className="price-row">
                    <span className="price-label">상품금액:</span>
                    <span className="price-value">
                      {formatCurrency(selectedProduct.end_price)}
                    </span>
                  </div>
                  <div className="price-row">
                    <span className="price-label">배송비:</span>
                    <span className="price-value">{formatCurrency(2500)}</span>
                  </div>
                  <div className="price-row bold">
                    <span className="price-label">최종 결제 금액:</span>
                    <span className="price-value">
                      {formatCurrency(selectedProduct.end_price + 2500)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="dialog-right">
            <Typography variant="h6" style={{ marginBottom: "10px" }}>
              배송 정보
            </Typography>
            <Typography variant="body2" style={{ marginBottom: "10px" }}>
              예상 배송일: {new Date().toLocaleDateString()} ~{" "}
              {new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" style={{ marginBottom: "20px" }}>
              배송 상태: 준비 중
            </Typography>
            <Typography variant="h6" style={{ marginBottom: "10px" }}>
              추천 상품
            </Typography>
            <div className="recommended-products">
              {recommendedProducts.map((product) => (
                <Link
                  key={product.product_id}
                  href={`/product/${product.product_id}`}
                >
                  <div className="recommended-product">
                    <Image
                      src={product.imageUrl}
                      alt={product.product_name}
                      width={100}
                      height={100}
                      className="rounded-lg"
                    />
                    <div>
                      <Typography variant="body2">
                        {product.product_name}
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(product.highest_price)}
                      </Typography>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleCloseDialog} className="secondary-button">
            취소
          </Button>
          <Button
            onClick={() => console.log("결제 처리 로직")}
            className="primary-button"
            autoFocus
          >
            결제하기
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyPage;
