"use server";

export async function getProductList() {
  const API_URL = process.env.API_URL_DJANGO;
  const res = await fetch(`${API_URL}/api/django/product`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const productList = res.json();
  //console.log(jobList);
  return productList;
}

export async function getImageURL() {
  return process.env.API_URL_IMG;
}
