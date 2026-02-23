import React, { useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { POSTER_SIZES } from "@/constants/tmdb";
import { searchMovies, fetchTrending } from "@/lib/api";
import type { Movie } from "@/lib/api";
import { SearchBar } from "@/components/SearchBar";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const [query, setQuery] = useState("");

  const searchResult = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchMovies(query),
    enabled: query.length >= 2,
  });

  const trendingResult = useQuery({
    queryKey: ["movies", "trending"],
    queryFn: fetchTrending,
  });

  const movies = query.length >= 2
    ? searchResult.data?.results || []
    : trendingResult.data?.results || [];

  const renderMovie = useCallback(({ item }: { item: Movie }) => {
    const posterUrl = item.poster_path
      ? `${POSTER_SIZES.medium}${item.poster_path}`
      : null;

    return (
      <Pressable
        style={({ pressed }) => [styles.movieItem, { opacity: pressed ? 0.7 : 1 }]}
        onPress={() => router.push({ pathname: "/movie/[id]", params: { id: String(item.id) } })}
      >
        <View style={styles.posterWrap}>
          {posterUrl ? (
            <Image source={{ uri: posterUrl }} style={styles.poster} contentFit="cover" transition={200} />
          ) : (
            <View style={styles.posterPlaceholder}>
              <Ionicons name="film-outline" size={24} color={Colors.dark.textMuted} />
            </View>
          )}
        </View>
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="star" size={12} color={Colors.dark.rating} />
            <Text style={styles.rating}>{item.vote_average.toFixed(1)}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.year}>
              {item.release_date ? item.release_date.substring(0, 4) : "N/A"}
            </Text>
          </View>
          <Text style={styles.overview} numberOfLines={2}>{item.overview}</Text>
        </View>
      </Pressable>
    );
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <Text style={styles.header}>T\u00ecm ki\u1ebfm</Text>
      <SearchBar value={query} onChangeText={setQuery} autoFocus={false} />

      {query.length >= 2 && searchResult.isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderMovie}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!!movies.length}
          ListHeaderComponent={
            query.length < 2 ? (
              <Text style={styles.sectionTitle}>Xu h\u01b0\u1edbng</Text>
            ) : null
          }
          ListEmptyComponent={
            query.length >= 2 ? (
              <View style={styles.empty}>
                <Ionicons name="search-outline" size={48} color={Colors.dark.textMuted} />
                <Text style={styles.emptyText}>Kh\u00f4ng t\u00ecm th\u1ea5y phim n\u00e0o</Text>
              </View>
            ) : null
          }
        />
      )}

      <View style={{ height: Platform.OS === "web" ? 84 : 100 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    color: Colors.dark.text,
    fontSize: 28,
    fontWeight: "700" as const,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  list: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "700" as const,
    marginBottom: 12,
  },
  movieItem: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  posterWrap: {
    width: 85,
    height: 128,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: Colors.dark.surface,
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  posterPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.surfaceLight,
  },
  movieInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  movieTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 21,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    color: Colors.dark.rating,
    fontSize: 13,
    fontWeight: "600" as const,
  },
  metaDot: {
    color: Colors.dark.textMuted,
    fontSize: 12,
  },
  year: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: "400" as const,
  },
  overview: {
    color: Colors.dark.textMuted,
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 17,
    marginTop: 2,
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    color: Colors.dark.textMuted,
    fontSize: 15,
    fontWeight: "400" as const,
  },
});
