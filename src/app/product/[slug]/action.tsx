"use server";

// API URL 가져오기
const API_URL = process.env.API_URL_DJANGO;

/**
 * 상품 상세 가져오기. (Spring API)
 * @param id (number)
 */
export async function getProductDetail(id: number) {
  const res = await fetch(`${API_URL}/api/django/product/${id}`, {
    method: "GET",
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const productDetail = await res.json();
  //console.log(productDetail);
  return productDetail;
}
