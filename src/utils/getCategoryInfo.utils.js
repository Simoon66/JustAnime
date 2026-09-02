import axios from "axios";
import { getApiBaseUrl } from "@/src/config/api";

const getCategoryInfo = async (path,page) => {
  const api_url = getApiBaseUrl();
  try {
    const response = await axios.get(`${api_url}/${path}?page=${page}`);
    return response.data.results;
  } catch (err) {
    console.error("Error fetching genre info:", err);
    return err;
  }
};

export default getCategoryInfo;
