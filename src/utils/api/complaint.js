import Api from "../api";
import QueryString from "qs";

export const postBuyerComplaint = async (id, type, reason, evidence) => {
  try {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("reason", reason);

    if (evidence && evidence.length > 0) {
      evidence.forEach((file) => {
        formData.append("evidence", {
          uri: file.uri,
          name: file.fileName || file.uri.split("/").pop(),
          type: file.type || "image/jpeg",
        });
      });
    }

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
    throw error;
  }
};

export const getBuyerComplaints = async () => {
  try {
    const res = await Api.get(`/buyer/complaints`, {
      // params: {
      //   status: ["complain"],
      // },
      // paramsSerializer: (params) => {
      //   return QueryString.stringify(params, { arrayFormat: "repeat" });
      // },
    });
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

export const postBuyerReturn = async (
  id,
  courier_id,
  tracking_number,
  photo
) => {
  try {
    const file = {
      uri: photo?.uri,
      name: photo?.fileName || photo?.uri.split("/").pop(),
      type: photo?.type || "image/jpeg", // default jika tidak ada type
    };
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("courierId", courier_id);
    formData.append("trackingNumber", tracking_number);
    const res = await Api.post(`/buyer/complaints/${id}/return`, formData);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const postBuyerReturnConfirm = async (id, reason, evidence) => {
  try {
    const file = {
      uri: evidence?.uri,
      name: evidence?.fileName || evidence?.uri.split("/").pop(),
      type: evidence?.type || "image/jpeg", // default jika tidak ada type
    };

    const formData = new FormData();
    formData.append("reason", reason);
    formData.append("evidence", file);
    const res = await Api.post(
      `/buyer/complaints/${id}/request-confirmation`,
      formData
    );

    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

// Seller

export const getSellerComplaints = async () => {
  try {
    const res = await Api.get(`/seller/complaints`);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const getDetailSellerComplaint = async (id) => {
  try {
    const res = await Api.get(`/seller/complaints/${id}`);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const postSellerConfirmReturn = async (id) => {
  try {
    const status = "completed";
    const res = await Api.patch(`/seller/complaints/${id}/confirm-return`, {
      status,
    });

    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

// Post Seller Response
export const postSellerResponse = async (
  id,
  status,
  seller_response_reason,
  arrPhoto
) => {
  try {
    console.log("ini id", id);
    console.log("ini status", status);
    console.log("ini seller_response_reason", seller_response_reason);
    console.log("ini arrPhoto", arrPhoto);

    const formData = new FormData();
    formData.append("status", status);
    formData.append("seller_response_reason", seller_response_reason);

    if (arrPhoto && arrPhoto.length > 0) {
      arrPhoto.forEach((file) => {
        formData.append("photo", {
          uri: file.uri,
          name: file.fileName || file.uri.split("/").pop(),
          type: file.type || "image/jpeg",
        });
      });
    }

    console.log("ini id", id);
    console.log("ini status", status);
    console.log("ini seller_response_reason", seller_response_reason);
    console.log("ini arrPhoto", arrPhoto)

    const res = await Api.patch(`/seller/complaints/${id}/respond`, formData);
    if (res) {
      return res;
    }
  } catch (error) {
    console.log("error cok 1", error);
    throw error;
  }
};
