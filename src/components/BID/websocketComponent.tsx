import { Client, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useEffect, useState, useCallback } from "react";

interface WebSocketComponentProps {
  productId: number;
  userId: number;
}

const WebSocketComponent: React.FC<WebSocketComponentProps> = ({
  productId,
  userId,
}) => {
  const [client, setClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new SockJS(
      "http://dpd-be-svc.dpd-be-ns.svc.cluster.local/ws"
    );
    const stompClient = Stomp.over(socket);

    stompClient.connect(
      {},
      (frame: any) => {
        setConnected(true);
        console.log("Connected to WebSocket:", frame);

        // Subscribe to /topic/auction/{productId}
        stompClient.subscribe(`/topic/auction/${productId}`, (message: any) => {
          console.log("Received message from /topic/auction:", message.body);
          // Handle the message
        });

        // Subscribe to /queue/reply/{userId}
        stompClient.subscribe(`/queue/reply/${userId}`, (message: any) => {
          console.log("Received message from /queue/reply:", message.body);
          // Handle the message
        });
      },
      (error: any) => {
        console.error("WebSocket connection error:", error);
      }
    );

    setClient(stompClient);

    return () => {
      if (client && connected) {
        client.deactivate();
        console.log("Disconnected from WebSocket");
      }
    };
  }, [productId, userId, connected]);

  const sendMessage = useCallback(
    (bid: { bidProductId: number; bidMemberId: number; bidPrice: number }) => {
      if (client && connected) {
        client.publish({
          destination: "/app/bid",
          body: JSON.stringify(bid),
        });
        console.log("Sending bid:", bid);
      } else {
        console.error("Client not connected or user not set");
      }
    },
    [client, connected]
  );

  return (
    <div>
      <button
        onClick={() =>
          sendMessage({
            bidProductId: productId,
            bidMemberId: userId,
            bidPrice: 71068000,
          })
        }
      >
        Send Bid
      </button>
    </div>
  );
};

export default WebSocketComponent;
