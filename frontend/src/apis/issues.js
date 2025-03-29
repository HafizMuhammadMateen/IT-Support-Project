import axios from "axios";

const ISSUE_API_URL = "http://localhost:8080/api/issues";

export const fetchUserIssues = async (email) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/issues/user/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching issues:", error);
    return { message: "Error fetching issues" };
  }
};

export const fetchIssues = async () => {
  try {
    const response = await axios.get(ISSUE_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  }
};

export const addIssue = async (issueData) => {
  try {
    console.log("Sending issue data to backend:", issueData); // Debug log
    const response = await axios.post("http://localhost:8080/api/issues", issueData);
    console.log("Response from backend:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Error adding issue:", error.response?.data || error.message);
    throw error;
  }
};
