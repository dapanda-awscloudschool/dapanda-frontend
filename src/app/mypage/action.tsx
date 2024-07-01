"use server";

const DJANGO = process.env.API_URL_DJANGO;

export async function pWishList(id: number) {
  const res = await fetch(`${DJANGO}/api/django/pwishlist/${id}`, {
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

  const productWishlist = await res.json();
  console.log(productWishlist);
  return productWishlist; // 전체 데이터를 반환
}
