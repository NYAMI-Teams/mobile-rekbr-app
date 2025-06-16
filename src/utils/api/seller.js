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

export const postResi = async (id, courier_id, tracking_number, photo) => {
  try {
    const res = await Api.post(`/seller/transactions/${id}/shipping`, {
      courier_id,
      tracking_number,
      photo,
    });
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const postFundRelease = async (id, evidence, reason) => {
  try {
    const res = await Api.post(
      `/api/seller/transaction/${id}/request-confirmation-shipment`,
      {
        evidence,
        reason,
      }
    );
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};
