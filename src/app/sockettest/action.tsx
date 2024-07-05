// "use server";

// import WebSocket from "ws";
// import SockJS from "sockjs-client";
// import Stomp from "stompjs";

// export async function socketConnect() {
//   const websocketUrl = "http://3.34.192.71:8080/ws"; // WebSocket 서버 주소

//   let stompClient: Stomp.Client;

//   function connect() {
//     const socket = new SockJS(websocketUrl);
//     stompClient = Stomp.over(socket);

//     stompClient.connect({}, (frame) => {
//       console.log("Connected: " + frame);
//       // 구독(subscribe)할 주제(queue) 설정
//       stompClient.subscribe("/app/user/queue/reply", (message) => {
//         console.log("Received message: ", JSON.parse(message.body));
//         // 메시지 처리 로직
//       });
//     });
//   }

//   // function disconnect() {
//   //     if (stompClient !== null) {
//   //         stompClient.disconnect();
//   //     }
//   //     console.log('Disconnected');
//   // }

//   connect(); // 연결 시도

//   // 필요에 따라서 다른 함수나 이벤트 핸들러에서 disconnect()를 호출하여 연결을 끊을 수 있습니다.
// }
