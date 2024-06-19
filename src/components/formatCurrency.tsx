export const formatCurrency = (value: number) => {
  if (value)
    return (
      value
        .toLocaleString("ko-KR", {
          style: "currency",
          currency: "KRW",
        })
        .replace("₩", "") + " 원"
    );
};
