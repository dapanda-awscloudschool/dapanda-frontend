// // pages/api/sendMessage.js

// import AWS from "aws-sdk";
// import { v4 as uuidv4 } from "uuid";

// // AWS 자격 증명 설정
// const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
// const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
// const region = "ap-northeast-2";
// const queueUrl =
//   "https://sqs.ap-northeast-2.amazonaws.com/571698711201/dpd-sqs.fifo";

// // SQS 클라이언트 생성
// const sqs = new AWS.SQS({
//   accessKeyId: awsAccessKeyId,
//   secretAccessKey: awsSecretAccessKey,
//   region: region,
// });

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   const { bidProductId, bidMemberId, bidPrice } = req.body;

//   if (!bidProductId || !bidMemberId || !bidPrice) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const message = {
//     bidProductId,
//     bidMemberId,
//     bidPrice,
//   };

//   const messageBody = JSON.stringify(message);
//   const messageGroupId = "bid_group";
//   const messageDeduplicationId = uuidv4(); // Generate a unique ID for deduplication

//   const params = {
//     QueueUrl: queueUrl,
//     MessageBody: messageBody,
//     MessageGroupId: messageGroupId,
//     MessageDeduplicationId: messageDeduplicationId,
//   };

//   try {
//     const data = await sqs.sendMessage(params).promise();
//     res.status(200).json({ message: "Message sent", data });
//   } catch (error) {
//     console.error("Error sending message to SQS:", error);
//     res.status(500).json({ message: "Error sending message to SQS", error });
//   }
// }
