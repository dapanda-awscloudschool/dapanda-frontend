"use server";

const API_URL = "http://dpd-be-django-svc.dpd-be-ns.svc.cluster.local:8000";

export async function getProductList() {
  const res = await fetch(`${API_URL}/api/django/product`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const productList = await res.json();
  //console.log(productList);
  return productList.slice(0, 10);
}
