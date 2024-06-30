import React from "react";
import * as amqp from "amqplib";
import moment from "moment";

const page = () => {
  async function sendBidMessage() {
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
      isSuccess: 0,
    };

    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log(` [x] Sent ${JSON.stringify(message)}`);

    await channel.close();
    await connection.close();
  }

  sendBidMessage().catch(console.error);
  return <div>page</div>;
};

export default page;
