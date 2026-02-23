import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Movie } from "./api";

const FAVORITES_KEY = "cinevault_favorites";

export async function getFavorites(): Promise<Movie[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function addFavorite(movie: Movie): Promise<Movie[]> {
  const favorites = await getFavorites();
  const exists = favorites.some((f) => f.id === movie.id);
  if (exists) return favorites;
  const updated = [movie, ...favorites];
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export async function removeFavorite(movieId: number): Promise<Movie[]> {
  const favorites = await getFavorites();
  const updated = favorites.filter((f) => f.id !== movieId);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export async function isFavorite(movieId: number): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.some((f) => f.id === movieId);
}
