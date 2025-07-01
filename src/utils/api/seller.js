import QueryString from "qs";
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

// Get All Seller Trx
export const getSellerTransactions = async (offset, limit) => {
  try {
    const res = await Api.get(`/seller/transactions`, {
      params: {
        status: ["shipped", "pending_payment", "waiting_shipment"],
        offset,
        limit,
      },
      paramsSerializer: (params) => {
        return QueryString.stringify(params, { arrayFormat: "repeat" });
      },
    });
    // console.log(res);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

// Get History Seller Trx
export const getHistorySeller = async (offset, limit) => {
  try {
    const res = await Api.get(`/seller/transactions`, {
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

export const cancelTransaksiSeller = async (transactionId) => {
  try {
    const res = await Api.post(`/seller/transactions/${transactionId}/cancel`);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

// Get Detail Seller Trx
export const getDetailSellerTransaction = async (id) => {
  try {
    const res = await Api.get(`/seller/transactions/${id}`);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

// Post Resi
export const postResi = async (id, courier_id, tracking_number, photo) => {
  try {
    const file = {
      uri: photo.uri,
      name: photo.fileName || photo.uri.split("/").pop(),
      type:
        photo.type && photo.type.startsWith("image/")
          ? photo.type
          : "image/jpeg", // fallback
    };
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("courier_id", courier_id);
    formData.append("tracking_number", tracking_number);
    const res = await Api.post(
      `/seller/transactions/${id}/shipping`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (res) {
      return res;
    }
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

// Post Fund Release
export const postFundRelease = async (id, evidence, reason) => {
  try {
    const file = {
      uri: evidence.uri,
      name: evidence.fileName || evidence.uri.split("/").pop(),
      type:
        evidence.type && evidence.type.startsWith("image/")
          ? evidence.type
          : "image/jpeg", // fallback
    };

    const formData = new FormData();
    formData.append("reason", reason);
    formData.append("evidence", file);

    const res = await Api.post(
      `/seller/transaction/${id}/request-confirmation-shipment`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (res) {
      return res;
    }
  } catch (error) {
    // console.log("Error posting fund release:", error);
    throw error;
  }
};

// Get List Courier
export const getListCourier = async () => {
  try {
    const res = await Api.get(`/seller/courier-list`);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

// Get List of Seller's Bank Account
export const getListBankAccount = async () => {
  try {
    const res = await Api.get(`/bank/account-list`);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

// Get List of All Bank
export const getAllBankList = async () => {
  try {
    const res = await Api.get(`/bank/bank-list`);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

// Check Rekening Exist
export const checkRekeningExist = async (account_number, bank_id) => {
  try {
    const res = await Api.get(`/bank/account`, {
      params: {
        account_number,
        bank_id,
      },
    });
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};
