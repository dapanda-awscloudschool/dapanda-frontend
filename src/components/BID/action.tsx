"use server";

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
