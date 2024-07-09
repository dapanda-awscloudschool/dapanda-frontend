"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Client } from "@stomp/stompjs";

interface IResult {
  id: number;
  bidProductId: number;
  bidMemberId: number;
  bidPrice: number;
  bidDate: string;
  isSuccess: number;
}

const BidInput = ({
  productId,
  highestPrice,
  termPrice,
  bidPrice,
  setBidPrice,
}: {
  highestPrice: number;
  termPrice: number;
  bidPrice: number;
  productId: number;
  setBidPrice: (price: number) => void;
}) => {
  const [user, setUser] = useState<number | null>(null);
  const [result, setResult] = useState<IResult | null>(null);
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData.memberId);

      const stompClient = new Client({
        brokerURL: "ws://dpd-be-svc.dpd-be-ns.svc.cluster.local:8080/ws",
        connectHeaders: {},
        debug: function (str) {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: (frame) => {
          console.log("Connected: " + frame);
          setConnected(true);
          stompClient.subscribe(
            `/queue/reply/${parsedUserData.memberId}`,
            (message) => {
              console.log("Received message from /queue/reply:", message.body);
              const bidResult = JSON.parse(message.body);
              handleBidResult(bidResult);
            }
          );
          stompClient.subscribe(`/topic/auction/${productId}`, (message) => {
            console.log("Received message from /topic/auction:", message.body);
            const productUpdate = JSON.parse(message.body);
            handleProductUpdate(productUpdate);
          });
        },
        onStompError: (frame) => {
          console.error("Broker reported error: " + frame.headers["message"]);
          console.error("Additional details: " + frame.body);
        },
        onWebSocketError: (event) => {
          console.error("WebSocket error:", event);
        },
        onWebSocketClose: () => {
          console.log("WebSocket connection closed");
          setConnected(false);
        },
      });

      console.log("Activating WebSocket client");
      stompClient.activate();
      setClient(stompClient);

      return () => {
        if (stompClient) {
          console.log("Deactivating WebSocket client");
          stompClient.deactivate();
        }
      };
    } else {
      console.error("User data not found in localStorage");
    }
  }, [productId]);

  const handleInput = (e: any) => {
    const newValue = parseInt(e.target.value, 10);
    if (newValue < highestPrice + termPrice) {
      Swal.fire({
        icon: "error",
        title: "입찰 오류",
        text: "현재가보다 낮거나 같게 입력할 수 없습니다.",
      });
      setBidPrice(highestPrice + termPrice);
    } else if (newValue > 2000000000) {
      Swal.fire({
        icon: "error",
        title: "입찰 오류",
        text: "최대 2,000,000,000까지 입력가능",
      });
      setBidPrice(2000000000);
    } else {
      setBidPrice(newValue);
    }
  };

  const handleBidSubmit = useCallback(() => {
    if (!client || !user || !connected) {
      console.error("Client not connected or user not set");
      return;
    }

    const bidinfo = {
      bidProductId: productId,
      bidMemberId: user,
      bidPrice: bidPrice,
    };

    console.log("Sending bid:", bidinfo);

    client.publish({
      destination: "/app/bid",
      body: JSON.stringify(bidinfo),
    });
  }, [client, user, bidPrice, productId, connected]);

  const handleBidResult = (bidResult: IResult) => {
    console.log("Bid result:", bidResult);
    setResult(bidResult);

    if (bidResult.isSuccess === 1) {
      Swal.fire({
        icon: "success",
        title: "축하합니다.",
        text: "입찰에 성공했습니다!",
      }).then(() => {
        router.push(`/product/${productId}`);
      });
    } else if (bidResult.isSuccess === 0) {
      Swal.fire({
        icon: "error",
        title: "입찰 실패",
        text: "입찰에 실패했습니다.",
      });
    }
  };

  const handleProductUpdate = (productUpdate: any) => {
    console.log("Product update:", productUpdate);
    Swal.fire({
      icon: "info",
      title: "입찰 업데이트",
      text: `새로운 입찰가: ${productUpdate.highestPrice}`,
    });
    setBidPrice(productUpdate.highestPrice);
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <label htmlFor="bidPrice" className="mr-2">
          입찰:
        </label>
        <input
          type="number"
          id="bidPrice"
          className="border rounded-md p-2"
          value={bidPrice}
          step={termPrice}
          min={highestPrice}
          max={2000000000}
          onChange={handleInput}
        />
        <div className="px-2">원</div>
        <button
          className="w-1/2 w-full text-sm rounded-3xl ring-1 ring-dapanda text-dapanda py-2 px-4 hover:bg-dapanda hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none"
          onClick={handleBidSubmit}
        >
          입찰 확인
        </button>
      </div>
    </>
  );
};

export default BidInput;
