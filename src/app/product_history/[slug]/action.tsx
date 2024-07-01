"use server";

// API URL 가져오기
const API_URL = process.env.API_URL_DJANGO;

/**
 * 상품 히스토리 상세 가져오기.
 * @param id (number)
 */
export async function getProductHistoryDetail(id: number) {
  try {
    const res = await fetch(`${API_URL}/api/django/product_history/${id}`, {
      method: "GET",
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const productHistoryDetail = await res.json();
    console.log(productHistoryDetail);
    return productHistoryDetail;
  } catch (error) {
    console.error("Error fetching product history detail:", error);
    throw error;
  }
}
