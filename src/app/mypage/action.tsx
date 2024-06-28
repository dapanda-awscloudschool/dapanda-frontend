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
  //console.log(member);
  return member; // 전체 데이터를 반환
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
  //console.log(productWishlist);
  return productWishlist; // 전체 데이터를 반환
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
  //console.log(saleHistory);
  return saleHistory; // 전체 데이터를 반환
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
  //console.log(buyHistory);
  return buyHistory; // 전체 데이터를 반환
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
  //console.log(salebid);
  return salebid; // 전체 데이터를 반환
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
  //console.log(mybid);
  return mybid; // 전체 데이터를 반환
}
