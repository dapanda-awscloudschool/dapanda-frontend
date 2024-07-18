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
