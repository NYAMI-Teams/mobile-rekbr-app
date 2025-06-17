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
      console.log("ini res", res);
      return res;
    }
  } catch (error) {
    console.log("Error post resi:", error);
    throw error;
  }
};

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
