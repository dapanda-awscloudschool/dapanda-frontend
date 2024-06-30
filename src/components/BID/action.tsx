"use server";
import * as amqp from "amqplib";
import moment from "moment";

const API_URL = process.env.API_URL_SPRING;

export async function BidRequest(formData: FormData) {
  try {
    const response = await fetch(`${API_URL}/api/spring/bid`, {
      method: "POST",
      body: formData,
    });

    if (response.status == 200) {
      return response.text();
    } else {
      return "error";
    }
  } catch (error) {
    console.error("Failed to submit bid:", error);
  }
}

export async function CheckRequest(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/spring/bid/${id}`);

    if (response.status == 200) {
      const res = await response.text();
      return JSON.parse(res);
    } else {
      return "error";
    }
  } catch (error) {
    console.error("Failed to submit bid:", error);
  }
}

export async function sendBidMessage() {
  const credentials = { username: "dapanda", password: "dapanda123#" };
  const connection = await amqp.connect({
    protocol: "amqp",
    hostname: "3.34.192.71",
    port: 5672,
    username: credentials.username,
    password: credentials.password,
    vhost: "/",
  });

  const channel = await connection.createChannel();

  const queueName = "sample.queue";
  await channel.assertQueue(queueName, { durable: true });

  const currentTime = moment().format("YYYY-MM-DDTHH:mm:ss");

  const message = {
    bidProductId: 1,
    bidMemberId: 2,
    bidPrice: 50000,
    bidDate: currentTime,
    transactionId: "asdasdasdasd",
    isSuccess: 1,
  };

  await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  console.log(` [x] Sent ${JSON.stringify(message)}`);

  await channel.close();
  await connection.close();
}
