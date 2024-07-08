// action.ts
"use server";

export async function getProductList() {
  const API_URL = process.env.API_URL_DJANGO;
  const res = await fetch(`${API_URL}/api/django/product`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const productList = await res.json();
  return productList;
}

export async function searchProducts(query: string) {
  const API_URL = process.env.API_URL_DJANGO;
  const res = await fetch(`${API_URL}/api/django/search/?q=${query}`);

  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }

  const searchResults = await res.json();
  return searchResults;
}

export async function getImageURL() {
  return process.env.NEXT_PUBLIC_API_URL_IMG;
}
