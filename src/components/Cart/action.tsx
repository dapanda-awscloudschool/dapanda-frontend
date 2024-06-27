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
