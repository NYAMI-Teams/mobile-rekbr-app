import Api from "../api";
import QueryString from "qs";

export const getBuyerComplaints = async () => {
  try {
    const res = await Api.get(`/buyer/transactions`, {
      params: {
        status: ["complain"],
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

export const getBuyerComplaintDetail = async (id) => {
  try {
    const res = await Api.get(`/buyer/complaints/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const cancelComplaintById = async (complaintId) => {
  try {
    const res = await Api.post(`/buyer/complaints/${complaintId}/cancel`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const createComplaint = async (transactionId, type, reason, file) => {
  const formData = new FormData();
  formData.append("type", type);
  formData.append("reason", reason);
  if (file) formData.append("evidence", file);

  const res = await Api.post(
    `/buyer/transactions/${transactionId}/complaint`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const getLatestComplaint = async () => {
  try {
    const res = await Api.get(`/buyer/complaints/latest`);
    return res;
  } catch (error) {
    throw error;
  }
};
