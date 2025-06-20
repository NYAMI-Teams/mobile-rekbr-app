import Api from "../api";
import QueryString from "qs";

export const getListComplainBuyer = async () => {
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
