import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getTasks = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data;
};

export const createTask = async (text) => {
  const response = await axios.post(API_URL, { text }, getAuthHeader());
  return response.data;
};

export const toggleTask = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}`, {}, getAuthHeader());
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  return response.data;
};
