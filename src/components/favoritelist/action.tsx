"use server";

const API_URL = process.env.API_URL_DJANGO;

export async function AddToWishlistRequest(wishlist: {
  member_id: number;
  product_id: number;
}) {
  try {
    console.log("Sending request to server:", wishlist);
    const response = await fetch(`${API_URL}/api/django/wishlist/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wishlist),
    });

    console.log("Server response status:", response.status);
    if (response.status === 200 || response.status === 201) {
      const jsonResponse = await response.json();
      console.log("Server response data:", jsonResponse);
      return jsonResponse;
    } else {
      const errorText = await response.json();
      throw new Error(
        `Failed to update wishlist on server: ${response.status} - ${errorText}`
      );
    }
  } catch (error) {
    console.error("Error updating wishlist on server:", error);
    throw error;
  }
}

export async function RemoveFromWishlistRequest(wishlist: {
  member_id: number;
  product_id: number;
}) {
  try {
    console.log("Sending delete request to server:", wishlist);
    const response = await fetch(`${API_URL}/api/django/wishlist/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wishlist),
    });

    console.log("Server response status:", response.status);
    if (response.status === 204) {
      console.log("Server response: No Content");
      return { message: "Item successfully removed from wishlist." };
    } else {
      const errorText = await response.json();
      throw new Error(
        `Failed to remove from wishlist on server: ${response.status} - ${errorText}`
      );
    }
  } catch (error) {
    console.error("Error removing from wishlist on server:", error);
    throw error;
  }
}
