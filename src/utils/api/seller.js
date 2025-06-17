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
export const getSellerTransactions = async () => {
  try {
    const res = await Api.get(`/seller/transactions`, {
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

// Get History Seller Trx
export const getHistorySeller = async () => {
  try {
    const res = await Api.get(`/seller/transactions`, {
      params: {
        isHistory: true,
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
    const res = await Api.post(`/seller/transactions/${id}/shipping`, {
      courier_id,
      tracking_number,
      photo,
    });
    if (res) {
      console.log("ini res", res);
      return res;
    }
  } catch (error) {
    console.log("Error post resi:", error);
    throw error;
  }
};

// Post Fund Release
export const postFundRelease = async (id, evidence, reason) => {
  try {
    // Convert image URI to Blob
    const response = await fetch(evidence);
    const blob = await response.blob();
    const file = new File([blob], "evidence.jpg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("evidence", file);
    formData.append("reason", reason);

    const res = await Api.post(
      `/seller/transaction/${id}/request-confirmation-shipment`,
      formData
    );
    if (res) {
      console.log("ini res", res);
      return res;
    }
  } catch (error) {
    console.log("Error post fund release:", error);
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
