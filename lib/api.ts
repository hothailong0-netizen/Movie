import { fetch } from "expo/fetch";
import { getApiUrl } from "./query-client";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  popularity: number;
  original_language: string;
  adult: boolean;
}

export interface MovieDetail extends Movie {
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  credits: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  similar: { results: Movie[] };
  videos: { results: Video[] };
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

async function apiFetch<T>(path: string): Promise<T> {
  const baseUrl = getApiUrl();
  const url = new URL(path, baseUrl);
  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchTrending(): Promise<MoviesResponse> {
  return apiFetch("/api/movies/trending");
}

export async function fetchNowPlaying(page = 1): Promise<MoviesResponse> {
  return apiFetch(`/api/movies/now-playing?page=${page}`);
}

export async function fetchPopular(page = 1): Promise<MoviesResponse> {
  return apiFetch(`/api/movies/popular?page=${page}`);
}

export async function fetchTopRated(page = 1): Promise<MoviesResponse> {
  return apiFetch(`/api/movies/top-rated?page=${page}`);
}

export async function fetchUpcoming(page = 1): Promise<MoviesResponse> {
  return apiFetch(`/api/movies/upcoming?page=${page}`);
}

export async function fetchByGenre(genreId: number, page = 1): Promise<MoviesResponse> {
  return apiFetch(`/api/movies/genre/${genreId}?page=${page}`);
}

export async function searchMovies(query: string, page = 1): Promise<MoviesResponse> {
  return apiFetch(`/api/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
}

export async function fetchMovieDetail(id: number): Promise<MovieDetail> {
  return apiFetch(`/api/movies/${id}`);
}

export async function fetchGenres(): Promise<{ genres: { id: number; name: string }[] }> {
  return apiFetch("/api/genres");
}
