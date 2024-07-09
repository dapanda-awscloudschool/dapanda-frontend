"use server";
//import * as amqp from "amqplib";
//import moment from "moment";

const API_URL = process.env.API_URL_SPRING;

export async function BidRequest(formData: FormData) {
  try {
    const response = await fetch(`${API_URL}/api/spring/bid`, {
      method: "POST",
      body: formData,
    });

    if (response.status === 200) {
      const text = await response.text();
      console.log("BidRequest response text:", text); // 응답 텍스트 확인
      return text; // 반환값이 올바른 ID인지 확인
    } else {
      console.error("BidRequest failed with status:", response.status);
      return "error";
    }
  } catch (error) {
    console.error("Failed to submit bid:", error);
    return "error";
  }
}

export async function CheckRequest(id: string) {
  try {
    const response = await fetch(
      `${API_URL}/api/spring/bid/${encodeURIComponent(id)}`
    );

    console.log(`CheckRequest response status: ${response.status}`);
    const responseText = await response.text();
    console.log(`CheckRequest response text: ${responseText}`);

    if (response.status === 200) {
      const res = JSON.parse(responseText);
      console.log("CheckRequest response json:", res); // 응답 JSON 로그 추가
      return res;
    } else {
      console.error("CheckRequest failed with status:", response.status);
      return "error";
    }
  } catch (error) {
    console.error("Failed to submit bid:", error);
    return "error";
  }
}

// export async function sendBidMessage() {
//   const credentials = { username: "dapanda", password: "dapanda123#" };
//   const connection = await amqp.connect({
//     protocol: "amqp",
//     hostname: "3.34.192.71",
//     port: 5672,
//     username: credentials.username,
//     password: credentials.password,
//     vhost: "/",
//   });

//   const channel = await connection.createChannel();

//   const queueName = "sample.queue";
//   await channel.assertQueue(queueName, { durable: true });

//   const currentTime = moment().format("YYYY-MM-DDTHH:mm:ss");

//   const message = {
//     bidProductId: 1,
//     bidMemberId: 2,
//     bidPrice: 50000,
//     bidDate: currentTime,
//     transactionId: "asdasdasdasd",
//     isSuccess: 1,
//   };

//   await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
//     persistent: true,
//   });

//   console.log(` [x] Sent ${JSON.stringify(message)}`);

//   await channel.close();
//   await connection.close();
// }
