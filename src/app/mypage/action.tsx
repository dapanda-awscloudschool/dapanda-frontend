"use server";

const DJANGO = process.env.API_URL_DJANGO;

export async function member(id: number) {
  const res = await fetch(`${DJANGO}/api/django/member/${id}`, {
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

  const member = await res.json();
  return member;
}

export async function pWishList(id: number) {
  const res = await fetch(`${DJANGO}/api/django/pwishlist/${id}`, {
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

  const productWishlist = await res.json();
  return productWishlist;
}

export async function saleHistory(user: number) {
  const res = await fetch(
    `${DJANGO}/api/django/product_history/member/${user}`,
    {
      method: "GET",
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const saleHistory = await res.json();
  return saleHistory;
}

export async function buyHistory(user: number) {
  const res = await fetch(
    `${DJANGO}/api/django/product_history/buyer/${user}`,
    {
      method: "GET",
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const buyHistory = await res.json();
  return buyHistory;
}

export async function salebid(user: number) {
  const res = await fetch(`${DJANGO}/api/django/bid/${user}`, {
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

  const salebid = await res.json();
  return salebid;
}

export async function mybid(user: number) {
  const res = await fetch(`${DJANGO}/api/django/biding/${user}`, {
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

  const mybid = await res.json();
  return mybid;
}

export async function updateMember(id: number, data: any) {
  const res = await fetch(`${DJANGO}/api/django/member/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update data");
  }

  const updatedMember = await res.json();
  console.log(updateMember);
  return updatedMember;
}

// 새로운 payStatusCreate 함수 추가
export async function payStatusCreate(productId: number, payStatus: number) {
  const res = await fetch(`${DJANGO}/api/django/pay_status/${productId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ product_id: productId, pay_status: payStatus }),
  });

  if (!res.ok) {
    throw new Error("Failed to update pay status");
  }

  const updatedStatus = await res.json();
  return updatedStatus;
}
