import axios from "axios";
import { getApiBaseUrl } from "@/src/config/api";

export default async function getSchedInfo(date) {
  try {
    const api_url = getApiBaseUrl();
    const response = await axios.get(`${api_url}/schedule?date=${date}`);
    return response.data.results;
  } catch (error) {
    console.error(error);
    return error;
  }
}
