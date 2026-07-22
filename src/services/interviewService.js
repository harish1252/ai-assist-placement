import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/interview`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getInterviewPrep = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data; // array of categories
};

export const toggleQuestion = async (categoryId, questionId) => {
  const response = await axios.patch(
    `${API_URL}/${categoryId}/${questionId}`,
    {},
    getAuthHeader(),
  );
  return response.data; // updated array of categories
};
