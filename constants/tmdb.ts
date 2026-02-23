export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
export const POSTER_SIZES = {
  small: `${TMDB_IMAGE_BASE}/w185`,
  medium: `${TMDB_IMAGE_BASE}/w342`,
  large: `${TMDB_IMAGE_BASE}/w500`,
  original: `${TMDB_IMAGE_BASE}/original`,
};
export const BACKDROP_SIZES = {
  small: `${TMDB_IMAGE_BASE}/w300`,
  medium: `${TMDB_IMAGE_BASE}/w780`,
  large: `${TMDB_IMAGE_BASE}/w1280`,
  original: `${TMDB_IMAGE_BASE}/original`,
};

export const GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export const GENRE_ICONS: Record<number, { icon: string; family: string }> = {
  28: { icon: 'flame', family: 'Ionicons' },
  12: { icon: 'compass', family: 'Ionicons' },
  16: { icon: 'color-palette', family: 'Ionicons' },
  35: { icon: 'happy', family: 'Ionicons' },
  80: { icon: 'finger-print', family: 'Ionicons' },
  99: { icon: 'videocam', family: 'Ionicons' },
  18: { icon: 'heart', family: 'Ionicons' },
  10751: { icon: 'people', family: 'Ionicons' },
  14: { icon: 'sparkles', family: 'Ionicons' },
  36: { icon: 'time', family: 'Ionicons' },
  27: { icon: 'skull', family: 'Ionicons' },
  10402: { icon: 'musical-notes', family: 'Ionicons' },
  9648: { icon: 'search', family: 'Ionicons' },
  10749: { icon: 'rose', family: 'Ionicons' },
  878: { icon: 'planet', family: 'Ionicons' },
  10770: { icon: 'tv', family: 'Ionicons' },
  53: { icon: 'flash', family: 'Ionicons' },
  10752: { icon: 'shield', family: 'Ionicons' },
  37: { icon: 'sunny', family: 'Ionicons' },
};
