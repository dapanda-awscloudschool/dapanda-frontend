"use server";

const API_URL = process.env.API_URL_DJANGO;

export async function GetWishlist(memberId: number) {
  try {
    const response = await fetch(
      `${API_URL}/api/django/wishlist/${memberId}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return await response.json();
    } else {
      const errorText = await response.json();
      throw new Error(
        `Failed to fetch wishlist: ${response.status} - ${errorText}`
      );
    }
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
}

export async function createProduct(formData: FormData) {
  try {
    const response = await fetch(`${API_URL}/api/django/create/`, {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const json = await response.json();
      if (response.ok) {
        return json;
      } else {
        throw new Error(
          `Failed to create product: ${response.status} - ${JSON.stringify(
            json
          )}`
        );
      }
    } else {
      const text = await response.text();
      throw new Error(`Failed to create product: ${response.status} - ${text}`);
    }
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}
