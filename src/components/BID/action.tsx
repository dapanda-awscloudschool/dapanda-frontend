"use server";
const API_URL = process.env.API_URL_SPRING;

export async function BidRequest(formData: FormData) {
  try {
    const response = await fetch(`${API_URL}/api/spring/bid`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const text = await response.text();
      //console.log("BidRequest response text:", text); // 응답 텍스트 확인
      return text; // 반환값이 올바른 ID인지 확인
    } else {
      //console.error("BidRequest failed with status:", response.status);
      return "error";
    }
  } catch (error) {
    //console.error("Failed to submit bid:", error);
    return "error";
  }
}

export async function CheckRequest(id: string) {
  try {
    const response = await fetch(
      `${API_URL}/api/spring/bid/${encodeURIComponent(id)}`
    );

    const responseText = await response.text();

    if (response.ok) {
      const res = JSON.parse(responseText);
      return res;
    } else {
      console.error("CheckRequest failed with status:", response.status);
      console.log(`Response text on failure: ${responseText}`);
      return null; // 에러 응답일 경우 null 반환
    }
  } catch (error) {
    console.error("Failed to check bid:", error);
    return null; // 에러 발생 시 null 반환
  }
}
