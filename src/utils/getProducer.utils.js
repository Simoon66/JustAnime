import axios from "axios";
import { getApiBaseUrl } from "@/src/config/api";

const getProducer = async (producer, page) => {
  const api_url = getApiBaseUrl();
  try {
    const response = await axios.get(`${api_url}/producer/${producer}?page=${page}`);
    return response.data.results;
  } catch (err) {
    console.error("Error fetching genre info:", err);
    return err;
  }
};

export default getProducer;
