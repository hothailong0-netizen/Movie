import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { POSTER_SIZES } from "@/constants/tmdb";
import type { Movie } from "@/lib/api";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2.3;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

interface MovieCardProps {
  movie: Movie;
  size?: "small" | "medium" | "large";
}

export function MovieCard({ movie, size = "medium" }: MovieCardProps) {
  const w = size === "small" ? CARD_WIDTH * 0.75 : size === "large" ? CARD_WIDTH * 1.3 : CARD_WIDTH;
  const h = w * 1.5;

  const posterUrl = movie.poster_path
    ? `${POSTER_SIZES.medium}${movie.poster_path}`
    : null;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { width: w, opacity: pressed ? 0.8 : 1 },
      ]}
      onPress={() => router.push({ pathname: "/movie/[id]", params: { id: String(movie.id) } })}
      testID={`movie-card-${movie.id}`}
    >
      <View style={[styles.poster, { width: w, height: h }]}>
        {posterUrl ? (
          <Image
            source={{ uri: posterUrl }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="film-outline" size={32} color={Colors.dark.textMuted} />
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={10} color={Colors.dark.rating} />
          <Text style={styles.ratingText}>{movie.vote_average.toFixed(1)}</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {movie.title}
      </Text>
      <Text style={styles.year}>
        {movie.release_date ? movie.release_date.substring(0, 4) : "N/A"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },
  poster: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: Colors.dark.surface,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.surfaceLight,
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 3,
  },
  ratingText: {
    color: Colors.dark.rating,
    fontSize: 11,
    fontWeight: "600" as const,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: "500" as const,
    marginTop: 8,
    lineHeight: 17,
  },
  year: {
    color: Colors.dark.textMuted,
    fontSize: 11,
    fontWeight: "400" as const,
    marginTop: 2,
  },
});
