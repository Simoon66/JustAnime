import axios from "axios";
import { getApiBaseUrl } from "@/src/config/api";
import { getPublicCatalogAnime, isPublicCatalogEnabled } from "@/src/utils/publicCatalog.utils";

export default async function fetchAnimeInfo(id, random = false) {
  const api_url = getApiBaseUrl();
  try {
    if (isPublicCatalogEnabled() && !random) return await getPublicCatalogAnime(id);
    if (random) {
      const id = await axios.get(`${api_url}/random/id`);
      const response = await axios.get(`${api_url}/info?id=${id.data.results}`);
      return response.data.results;
    } else {
      const response = await axios.get(`${api_url}/info?id=${id}`);
      return response.data.results;
    }
  } catch (error) {
    console.error("Error fetching anime info:", error);
    return error;
  }
}
