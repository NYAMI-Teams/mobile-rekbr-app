import Api from "../api";

export const postBuyerComplaint = async (id, type, reason, evidence) => {
  try {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("reason", reason);

    evidence.forEach((file) => {
      formData.append("evidence", {
        uri: file.uri,
        name: file.fileName || file.uri.split("/").pop(),
        type: file.type || "image/jpeg", // fallback default
      });
    });

    const res = await Api.post(
      `/buyer/transactions/${id}/complaint`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res;
  } catch (error) {
    console.error("Gagal kirim komplain:", error);
    throw error;
  }
};

export const getBuyerComplaints = async () => {
  try {
    const res = await Api.get(`/buyer/complaints`);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const getDetailBuyerComplaint = async (id) => {
  try {
    const res = await Api.get(`/buyer/complaints/${id}`);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const postBuyerCancelComplaint = async (id) => {
  try {
    const res = await Api.post(`/buyer/complaints/${id}/cancel`);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const postBuyerReturn = async (id, courier_id, tracking_number, photo) => {
  try {
    const file = {
      uri: photo.uri,
      name: photo.fileName || photo.uri.split("/").pop(),
      type: photo.type || "image/jpeg", // default jika tidak ada type
    };
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("courier_id", courier_id);
    formData.append("tracking_number", tracking_number);
    const res = await Api.post(`/buyer/complaints/${id}/return`, formData);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};
