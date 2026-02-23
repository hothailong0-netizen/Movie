import React, { useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { POSTER_SIZES } from "@/constants/tmdb";
import { getFavorites, removeFavorite } from "@/lib/favorites";
import type { Movie } from "@/lib/api";

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    }, [queryClient])
  );

  const handleRemove = async (movieId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await removeFavorite(movieId);
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
  };

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
        </View>
        <Pressable
          onPress={() => handleRemove(item.id)}
          hitSlop={12}
          style={styles.removeBtn}
        >
          <Ionicons name="heart-dislike" size={20} color={Colors.dark.error} />
        </Pressable>
      </Pressable>
    );
  }, []);

  const favorites = favoritesQuery.data || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <Text style={styles.header}>Y\u00eau th\u00edch</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderMovie}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!favorites.length}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={56} color={Colors.dark.textMuted} />
            <Text style={styles.emptyTitle}>Ch\u01b0a c\u00f3 phim y\u00eau th\u00edch</Text>
            <Text style={styles.emptyText}>
              Nh\u1ea5n v\u00e0o bi\u1ec3u t\u01b0\u1ee3ng tr\u00e1i tim tr\u00ean trang chi ti\u1ebft phim \u0111\u1ec3 th\u00eam v\u00e0o danh s\u00e1ch y\u00eau th\u00edch
            </Text>
          </View>
        }
      />
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
    fontFamily: "Inter_700Bold",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  list: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  movieItem: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
    alignItems: "center",
  },
  posterWrap: {
    width: 70,
    height: 105,
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
    gap: 4,
  },
  movieTitle: {
    color: Colors.dark.text,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    color: Colors.dark.rating,
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  metaDot: {
    color: Colors.dark.textMuted,
    fontSize: 12,
  },
  year: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  removeBtn: {
    padding: 8,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  emptyText: {
    color: Colors.dark.textMuted,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
});
