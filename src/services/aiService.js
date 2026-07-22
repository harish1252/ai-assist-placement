import axios from "axios";

const API_URL = "http://localhost:5000/api/ai";

export const sendChatMessage = async (message) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/chat`,
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`, // needed since this route is protected
      },
    },
  );

  return response.data;
};
