import axios from "axios";
import config from "../_config/app-config.json";

const apiClient = axios.create({
  baseURL: `${config.apiURL}`,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchPools = async () => {
  try {
    const response = await apiClient.get("/pools");
    console.log(response.data.pools);
    return response.data.pools;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
