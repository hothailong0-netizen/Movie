# CineVault - Movie Browsing App

## Overview
A mobile movie browsing application built with Expo (React Native) that fetches movie data from TMDb API. Features automatic updates, multiple genres, search, and favorites.

## Architecture
- **Frontend**: Expo Router with file-based routing, React Query for data fetching
- **Backend**: Express.js server on port 5000, acts as proxy for TMDb API
- **State**: React Query for server state, AsyncStorage for favorites
- **Theme**: Dark cinema theme with Inter font family

## Key Files
- `app/(tabs)/` - Main tab screens (Home, Search, Genres, Favorites)
- `app/movie/[id].tsx` - Movie detail screen
- `app/genre/[id].tsx` - Genre movie list screen
- `app/category/[type].tsx` - Category movie list screen
- `server/routes.ts` - Backend TMDb API proxy routes
- `lib/api.ts` - Frontend API client functions
- `lib/favorites.ts` - AsyncStorage favorites management
- `components/` - Reusable UI components (MovieCard, HeroSlider, MovieRow, etc.)
- `constants/colors.ts` - Dark theme color palette
- `constants/tmdb.ts` - TMDb image URLs, genre mappings

## API Endpoints
- GET `/api/movies/trending` - Trending movies
- GET `/api/movies/now-playing` - Now playing movies
- GET `/api/movies/popular` - Popular movies
- GET `/api/movies/top-rated` - Top rated movies
- GET `/api/movies/upcoming` - Upcoming movies
- GET `/api/movies/genre/:genreId` - Movies by genre
- GET `/api/movies/search?query=` - Search movies
- GET `/api/movies/:id` - Movie details with credits and similar
- GET `/api/genres` - Genre list

## Environment Variables
- `TMDB_API_KEY` (secret) - TMDb API v3 key for movie data

## Recent Changes
- 2026-02-23: Initial build with full movie browsing app
  - 4-tab navigation (Home, Search, Genres, Favorites)
  - Hero slider with auto-scroll on home screen
  - Movie detail with cast, genres, similar movies
  - Search with instant results
  - Genre browsing with pagination
  - Favorites with AsyncStorage persistence
  - Auto-refresh every 5 minutes
  - Vietnamese language UI
  - Dark cinema theme
