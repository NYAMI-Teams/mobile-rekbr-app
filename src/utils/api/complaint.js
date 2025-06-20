import Api from "../api";

export const getBuyerTransactions = async () => {
  try {
    const res = await Api.get(`/buyer/transactions`, {
      params: {
        isHistory: false,
      },
    });
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};