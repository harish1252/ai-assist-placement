import axios from "axios";

const API_URL = "http://localhost:5000/api/subjects";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getSubjects = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data; // array of subjects
};

export const updateSubjectProgress = async (subjectId, value) => {
  const response = await axios.patch(
    `${API_URL}/${subjectId}`,
    { value },
    getAuthHeader(),
  );
  return response.data; // updated array of subjects
};
