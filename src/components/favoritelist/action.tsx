"use server";

const API_URL = process.env.API_URL_DJANGO;

export async function AddToWishlistRequest(wishlist: {
  member_id: number;
  product_id: number;
}) {
  try {
    console.log("Sending request to server:", wishlist); // 요청 데이터 로그 추가
    const response = await fetch(`${API_URL}/api/django/wishlist/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wishlist),
    });

    console.log("Server response status:", response.status); // 응답 상태 로그 추가
    if (response.status === 200 || response.status === 201) {
      const jsonResponse = await response.json();
      console.log("Server response data:", jsonResponse); // 응답 데이터 로그 추가
      return jsonResponse;
    } else {
      const errorText = await response.json();
      throw new Error(
        `Failed to update wishlist on server: ${response.status} - ${errorText}`
      );
    }
  } catch (error) {
    console.error("Error updating wishlist on server:", error);
    throw error;
  }
}
