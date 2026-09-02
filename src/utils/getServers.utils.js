import axios from "axios";
import { getApiBaseUrl } from "@/src/config/api";

export default async function getServers(animeId, episodeId) {
  try {
    const api_url = getApiBaseUrl();
    const response = await axios.get(
      `${api_url}/servers/${animeId}?ep=${episodeId}`
    );
    return response.data.results;
  } catch (error) {
    console.error(error);
    return error;
  }
}
