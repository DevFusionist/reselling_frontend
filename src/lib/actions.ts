"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clearAuthToken } from "./session";

export async function addToCart(formData: FormData) {
  const productId = formData.get("productId");
  const shareId = formData.get("shareId");

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  try {
    const response = await fetch(
      `${process.env.INTERNAL_API_URL}/cart`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, shareId, quantity: 1 }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add to cart");
    }

    // Purge the cache for the cart path so the UI updates
    revalidatePath("/cart");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to add to cart",
    };
  }
}

export async function logout() {
  await clearAuthToken();
  redirect("/login");
}

