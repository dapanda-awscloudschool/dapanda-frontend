export const formatCurrency = (value: number) => {
  return (
    value
      .toLocaleString("ko-KR", {
        style: "currency",
        currency: "KRW",
      })
      .replace("₩", "") + " 원"
  );
};
