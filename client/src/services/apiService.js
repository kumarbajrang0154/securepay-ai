import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const analyzeTransaction = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/analysis`, data);
  return response.data;
};

export const reportFraud = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/fraud/report`, data);
  return response.data;
};

export const getTransactionHistory = async () => {
  const response = await axios.get(`${API_BASE_URL}/transactions`);
  return response.data;
};