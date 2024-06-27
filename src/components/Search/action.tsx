"use server";

const API_URL = process.env.API_URL_DJANGO;

export async function getRanking() {
  const res = await fetch(`${API_URL}/api/django/redis/ranking`, {
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

  const topRanking = await res.json();
  console.log(topRanking);
  return topRanking;
}
