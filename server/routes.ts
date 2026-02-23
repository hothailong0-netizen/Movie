import type { Express, Request, Response } from "express";
import { createServer, type Server } from "node:http";

const TMDB_BASE = "https://api.themoviedb.org/3";

function getTmdbKey(): string {
  return process.env.TMDB_API_KEY || "";
}

async function tmdbFetch(endpoint: string, params: Record<string, string> = {}) {
  const key = getTmdbKey();
  if (!key) {
    throw new Error("TMDB_API_KEY not configured");
  }
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set("api_key", key);
  url.searchParams.set("language", "vi-VN");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`TMDb API error: ${res.status}`);
  }
  return res.json();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/movies/trending", async (_req: Request, res: Response) => {
    try {
      const data = await tmdbFetch("/trending/movie/day");
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/movies/now-playing", async (req: Request, res: Response) => {
    try {
      const page = (req.query.page as string) || "1";
      const data = await tmdbFetch("/movie/now_playing", { page });
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/movies/popular", async (req: Request, res: Response) => {
    try {
      const page = (req.query.page as string) || "1";
      const data = await tmdbFetch("/movie/popular", { page });
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/movies/top-rated", async (req: Request, res: Response) => {
    try {
      const page = (req.query.page as string) || "1";
      const data = await tmdbFetch("/movie/top_rated", { page });
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/movies/upcoming", async (req: Request, res: Response) => {
    try {
      const page = (req.query.page as string) || "1";
      const data = await tmdbFetch("/movie/upcoming", { page });
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/movies/genre/:genreId", async (req: Request, res: Response) => {
    try {
      const page = (req.query.page as string) || "1";
      const data = await tmdbFetch("/discover/movie", {
        with_genres: req.params.genreId,
        sort_by: "popularity.desc",
        page,
      });
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/movies/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.query as string;
      const page = (req.query.page as string) || "1";
      if (!query) {
        return res.json({ results: [], total_results: 0 });
      }
      const data = await tmdbFetch("/search/movie", { query, page });
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/movies/:id", async (req: Request, res: Response) => {
    try {
      const data = await tmdbFetch(`/movie/${req.params.id}`, {
        append_to_response: "credits,similar,videos",
      });
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/genres", async (_req: Request, res: Response) => {
    try {
      const data = await tmdbFetch("/genre/movie/list");
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
