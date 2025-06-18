import Api from "../api";

export const getBuyerTransactions = async () => {
  try {
    const res = await Api.get(`/buyer/transactions`);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const getDetailBuyerTransaction = async (id) => {
  try {
    const res = await Api.get(`/buyer/transactions/${id}`);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};
