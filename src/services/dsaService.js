import axios from "axios";

const API_URL = "http://localhost:5000/api/dsa";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getDsaProgress = async () => {
  const response = await axios.get(`${API_URL}/progress`, getAuthHeader());
  return response.data; // array of topics
};

export const updateDsaProgress = async (topicId, action) => {
  const response = await axios.patch(
    `${API_URL}/progress/${topicId}`,
    { action },
    getAuthHeader(),
  );
  return response.data; // updated array of topics
};
