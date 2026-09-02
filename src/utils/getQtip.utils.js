import axios from "axios";
import { getRandomApiBaseUrl } from "@/src/config/api";

const getQtip = async (id) => {
  try {
    const baseUrl = getRandomApiBaseUrl();
    if (!baseUrl) throw new Error("No API endpoint defined.");
    const response = await axios.get(`${baseUrl}/qtip/${id.split("-").pop()}`);
    return response.data.results;
  } catch (err) {
    console.error("Error fetching genre info:", err);
    return null;
  }
};

export default getQtip;
