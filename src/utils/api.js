import axios from "axios";
import { getAccessToken } from "../store";

const Api = axios.create({
  // baseURL: "http://152.42.249.176:3000/api",
  baseURL: "https://api.rekbr.site/api",
  // baseURL: "https://kvnpp4pb-3000.asse.devtunnels.ms/api",
  timeout: 60 * 1000,
  headers: {
    // "Content-Type": "application/json",
    accept: "application/json",
  },
});

const onRequestSuccess = async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

const onRequestError = (error) => Promise.reject(error);
const onResponseSuccess = (response) => response.data;
const onResponseError = (error) => {

  return Promise.reject(error?.response?.data ? error?.response?.data : error);
};

Api.interceptors.request.use(onRequestSuccess, onRequestError);
Api.interceptors.response.use(onResponseSuccess, onResponseError);

export default Api;
