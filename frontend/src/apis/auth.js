import axios from "axios";

const User_API_URL = "http://localhost:8080/api/users";

// Register API call
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${User_API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

// Login API call
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${User_API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};
