import axios from "axios";
import { getRandomApiBaseUrl } from "@/src/config/api";

const getTopSearch = async () => {
  try {
    const baseUrl = getRandomApiBaseUrl();
    const storedData = localStorage.getItem("topSearch");
    if (storedData) {
      const { data, timestamp } = JSON.parse(storedData);
      if (Date.now() - timestamp <= 7 * 24 * 60 * 60 * 1000) {
        return data;
      }
    }
    const { data } = await axios.get(`${baseUrl}/top-search`);
    const results = data?.results || [];
    if (results.length) {
      localStorage.setItem(
        "topSearch",
        JSON.stringify({ data: results, timestamp: Date.now() })
      );
      return results;
    }
    return [];
  } catch (error) {
    console.error("Error fetching top search data:", error);
    return null;
  }
};

export default getTopSearch;
