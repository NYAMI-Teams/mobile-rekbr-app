import Api from "../api";
import QueryString from "qs";

export const getBuyerTransactions = async (offset, limit) => {
  try {
    const res = await Api.get(`/buyer/transactions`, {
      params: {
        status: ["shipped", "pending_payment", "waiting_shipment"],
        offset,
        limit,
      },
      paramsSerializer: (params) => {
        return QueryString.stringify(params, { arrayFormat: "repeat" });
      },
    });
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

// Get History Buyer Trx
export const getHistoryBuyer = async (offset, limit) => {
  try {
    const res = await Api.get(`/buyer/transactions`, {
      params: {
        status: ["completed", "canceled", "refunded"],
        offset,
        limit,
      },
      paramsSerializer: (params) => {
        return QueryString.stringify(params, { arrayFormat: "repeat" });
      },
    });
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

export const updateBuyerTransaction = async (id) => {
  try {
    const res = await Api.post(`/buyer/transactions/${id}/simulate-payment`);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const buyerConfirmReceivedTransaction = async (id) => {
  try {
    const res = await Api.post(`/buyer/transactions/${id}/confirm-received`);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};
