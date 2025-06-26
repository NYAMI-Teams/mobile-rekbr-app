import axios from "axios";
import { getAccessToken } from "../store";

const Api = axios.create({
  baseURL: "http://152.42.249.176:3000/api",
  // baseURL: "https://kvnpp4pb-3000.asse.devtunnels.ms/api",
  timeout: 30 * 1000,
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
  // if (error.response?.data.statusCode === 401 && getAccessToken()) {
  //   refreshToken({ refreshToken: getRefreshToken() })
  // } else if (error.response?.data.statusCode === 401 && !getAccessToken()) {
  //   // // removeAuth()
  //   // window.location.reload()
  // }
  return Promise.reject(error?.response?.data ? error?.response?.data : error);
};

Api.interceptors.request.use(onRequestSuccess, onRequestError);
Api.interceptors.response.use(onResponseSuccess, onResponseError);

export default Api;
