// // action.ts
// export const getProductList = async (query: string = "") => {
//   const response = await fetch(
//     `http://3.34.192.71:8000/api/django/search/?q=${query}`
//   );
//   if (!response.ok) {
//     throw new Error("Failed to fetch product list");
//   }
//   const data = await response.json();
//   return data;
// };
