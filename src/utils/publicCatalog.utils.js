const JIKAN_BASE_URL = "https://api.jikan.moe/v4";
const ANILIST_URL = "https://graphql.anilist.co";

export const catalogProvider = (import.meta.env.VITE_CATALOG_PROVIDER || "jikan").toLowerCase();

const toCard = (anime) => ({
  id: String(anime.id),
  title: anime.title.english || anime.title.romaji || anime.title.native || "Untitled",
  japanese_title: anime.title.native || anime.title.romaji,
  poster: anime.image,
  description: anime.description || "",
  releaseDate: anime.year ? String(anime.year) : "",
  tvInfo: {
    showType: anime.type || "",
    duration: anime.duration || "",
    rating: anime.rating || "",
  },
});

const jikanToAnime = (anime) => ({
  id: anime.mal_id,
  title: {
    english: anime.title_english,
    romaji: anime.title,
    native: anime.title_japanese,
  },
  image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
  description: anime.synopsis,
  year: anime.year,
  type: anime.type,
  duration: anime.duration,
  rating: anime.rating,
  genres: anime.genres?.map((genre) => genre.name) || [],
  status: anime.status,
  episodes: anime.episodes,
  studios: anime.studios?.map((studio) => studio.name) || [],
  score: anime.score,
});

const anilistToAnime = (anime) => ({
  id: anime.idMal || anime.id,
  title: anime.title,
  image: anime.coverImage?.extraLarge || anime.coverImage?.large,
  description: anime.description?.replace(/<[^>]*>/g, "") || "",
  year: anime.seasonYear,
  type: anime.format,
  duration: anime.duration ? `${anime.duration}m` : "",
  rating: anime.averageScore ? `${anime.averageScore}%` : "",
  genres: anime.genres || [],
  status: anime.status?.replaceAll("_", " "),
  episodes: anime.episodes,
  studios: anime.studios?.nodes?.map((studio) => studio.name) || [],
  score: anime.averageScore,
});

const requestJikan = async (path) => {
  const response = await fetch(`${JIKAN_BASE_URL}${path}`);
  if (!response.ok) throw new Error(`Jikan request failed (${response.status})`);
  return response.json();
};

const requestAniList = async (query, variables = {}) => {
  const response = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`AniList request failed (${response.status})`);
  const result = await response.json();
  if (result.errors?.length) throw new Error(result.errors[0].message);
  return result.data;
};

const anilistPageQuery = `
  query ($page: Int, $perPage: Int, $search: String, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { currentPage lastPage }
      media(type: ANIME, search: $search, sort: $sort) {
        id idMal title { english romaji native } coverImage { extraLarge large }
        description(asHtml: false) seasonYear format duration averageScore genres status episodes
        studios { nodes { name } }
      }
    }
  }
`;

const getAniListPage = async ({ page = 1, search, sort = ["POPULARITY_DESC"] } = {}) => {
  const data = await requestAniList(anilistPageQuery, { page, perPage: 24, search, sort });
  return {
    anime: data.Page.media.map(anilistToAnime),
    page: data.Page.pageInfo.currentPage,
    totalPages: data.Page.pageInfo.lastPage,
  };
};

const getJikanPage = async ({ page = 1, search, path = "/top/anime?filter=bypopularity" } = {}) => {
  const separator = path.includes("?") ? "&" : "?";
  const query = search ? `/anime?q=${encodeURIComponent(search)}&page=${page}&limit=24&sfw` : `${path}${separator}page=${page}&limit=24&sfw`;
  const data = await requestJikan(query);
  return {
    anime: data.data.map(jikanToAnime),
    page: data.pagination?.current_page || page,
    totalPages: data.pagination?.last_visible_page || page,
  };
};

const getCatalogPage = async (options) => {
  if (catalogProvider === "anilist") return getAniListPage(options);

  try {
    return await getJikanPage(options);
  } catch (error) {
    console.warn("Jikan is unavailable; falling back to AniList.", error);
    return getAniListPage(options);
  }
};

export const getPublicCatalogHome = async () => {
  const [recent, popular] = await Promise.all([
    getCatalogPage({ path: "/seasons/now" }),
    getCatalogPage({ path: "/top/anime?filter=bypopularity" }),
  ]);
  const recentCards = recent.anime.map(toCard);
  const popularCards = popular.anime.map(toCard);

  return {
    spotlights: popularCards.slice(0, 5),
    trending: popularCards,
    topten: { today: popularCards.slice(0, 10), week: popularCards.slice(0, 10), month: popularCards.slice(0, 10) },
    todaySchedule: [],
    top_airing: recentCards,
    most_popular: popularCards,
    most_favorite: popularCards,
    latest_completed: recentCards.filter((anime) => anime.status === "Finished Airing"),
    latest_episode: recentCards,
    top_upcoming: [],
    recently_added: recentCards,
    genres: ["action", "adventure", "comedy", "drama", "fantasy", "romance", "sci-fi", "sports"],
  };
};

export const searchPublicCatalog = async (keyword, page = 1) => {
  if (!keyword?.trim()) return { data: [], totalPage: 0 };
  const result = await getCatalogPage({ page, search: keyword.trim() });
  return { data: result.anime.map(toCard), totalPage: result.totalPages };
};
