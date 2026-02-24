import React, { useState } from "react";
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
import { useLocalSearchParams, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { POSTER_SIZES } from "@/constants/tmdb";
import { fetchByGenre } from "@/lib/api";
import type { Movie } from "@/lib/api";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLUMNS = 3;
const ITEM_GAP = 10;
const ITEM_WIDTH = (SCREEN_WIDTH - 32 - ITEM_GAP * (COLUMNS - 1)) / COLUMNS;

export default function GenreScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["genre", id, page],
    queryFn: () => fetchByGenre(Number(id), page),
    enabled: !!id,
  });

  const movies = moviesQuery.data?.results || [];
  const totalPages = moviesQuery.data?.total_pages || 1;

  const renderMovie = ({ item }: { item: Movie }) => {
    const posterUrl = item.poster_path
      ? `${POSTER_SIZES.medium}${item.poster_path}`
      : null;

    return (
      <Pressable
        style={({ pressed }) => [styles.gridItem, { opacity: pressed ? 0.8 : 1 }]}
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
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={8} color={Colors.dark.rating} />
            <Text style={styles.ratingText}>{item.vote_average.toFixed(1)}</Text>
          </View>
        </View>
        <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.dark.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{name || "Thể loại"}</Text>
        <View style={{ width: 40 }} />
      </View>

      {moviesQuery.isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => String(item.id)}
          numColumns={COLUMNS}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={renderMovie}
          scrollEnabled={!!movies.length}
          ListFooterComponent={
            <View style={styles.pagination}>
              <Pressable
                onPress={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}
              >
                <Ionicons name="chevron-back" size={18} color={page <= 1 ? Colors.dark.textMuted : Colors.dark.text} />
              </Pressable>
              <Text style={styles.pageText}>{page} / {totalPages}</Text>
              <Pressable
                onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                style={[styles.pageBtn, page >= totalPages && styles.pageBtnDisabled]}
              >
                <Ionicons name="chevron-forward" size={18} color={page >= totalPages ? Colors.dark.textMuted : Colors.dark.text} />
              </Pressable>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: "700" as const,
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    gap: ITEM_GAP,
    marginBottom: ITEM_GAP,
  },
  gridItem: {
    width: ITEM_WIDTH,
  },
  posterWrap: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.5,
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
  ratingBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 2,
    gap: 2,
  },
  ratingText: {
    color: Colors.dark.rating,
    fontSize: 10,
    fontWeight: "600" as const,
  },
  movieTitle: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: "500" as const,
    marginTop: 6,
    lineHeight: 16,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingVertical: 20,
  },
  pageBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  pageBtnDisabled: {
    opacity: 0.4,
  },
  pageText: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    fontWeight: "500" as const,
  },
});
