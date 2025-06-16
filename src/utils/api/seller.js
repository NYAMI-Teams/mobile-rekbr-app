import Api from "../api";

// export const createTransaction = async (data) => {
//   try {
//     const res = await Api.post(`/transaction`, data);
//     if (res) {
//       return res;
//     }
//   } catch (error) {
//     throw error;
//   }
// };

export const getSellerTransactions = async () => {
  try {
    const res = await Api.get(`/seller/transactions`);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};
