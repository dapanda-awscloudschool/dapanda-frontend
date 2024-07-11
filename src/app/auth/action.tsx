"use server";
const API_URL = process.env.API_URL_SPRING;
const DJANGO = process.env.API_URL_DJANGO;

export async function checkUser(id: string) {
  const res = await fetch(`${API_URL}/api/spring/member/${id}`, {
    method: "GET",
    // headers: {
    //   "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    //   Pragma: "no-cache",
    //   Expires: "0",
    // },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const userInfo = await res.text();
  console.log(userInfo);
  return userInfo;
}

export async function getWishlist(id: string) {
  const res = await fetch(`${DJANGO}/api/django/wishlist/${id}`, {
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
  return productDetail.product_id;
}
