"use server";

const API_URL = process.env.API_URL_SPRING;

export async function AddToWishlistRequest(wishlist: any) {
  try {
    const response = await fetch(`${API_URL}/api/spring/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wishlist }),
    });

    if (response.status === 200) {
      return await response.json();
    } else {
      throw new Error("Failed to update wishlist on server");
    }
  } catch (error) {
    console.error("Error updating wishlist on server:", error);
    throw error;
  }
}
