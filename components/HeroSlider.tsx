import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { BACKDROP_SIZES } from "@/constants/tmdb";
import { GENRES } from "@/constants/tmdb";
import type { Movie } from "@/lib/api";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_HEIGHT = 420;

interface HeroSliderProps {
  movies: Movie[];
}

export function HeroSlider({ movies }: HeroSliderProps) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const topMovies = movies.slice(0, 5);

  useEffect(() => {
    if (topMovies.length <= 1) return;
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % topMovies.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, topMovies.length]);

  const renderItem = ({ item }: { item: Movie }) => {
    const backdropUrl = item.backdrop_path
      ? `${BACKDROP_SIZES.large}${item.backdrop_path}`
      : null;

    const genreNames = (item.genre_ids || [])
      .slice(0, 3)
      .map((id) => GENRES[id])
      .filter(Boolean);

    return (
      <Pressable
        style={styles.slide}
        onPress={() => router.push({ pathname: "/movie/[id]", params: { id: String(item.id) } })}
      >
        {backdropUrl ? (
          <Image
            source={{ uri: backdropUrl }}
            style={styles.backdrop}
            contentFit="cover"
            transition={500}
          />
        ) : (
          <View style={[styles.backdrop, styles.placeholderBackdrop]} />
        )}
        <LinearGradient
          colors={["transparent", "rgba(10,14,23,0.6)", "rgba(10,14,23,0.95)"]}
          style={styles.gradient}
        />
        <View style={styles.info}>
          <View style={styles.genreRow}>
            {genreNames.map((g) => (
              <View key={g} style={styles.genreBadge}>
                <Text style={styles.genreText}>{g}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={Colors.dark.rating} />
              <Text style={styles.rating}>{item.vote_average.toFixed(1)}</Text>
            </View>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.year}>
              {item.release_date ? item.release_date.substring(0, 4) : ""}
            </Text>
          </View>
          <Text style={styles.overview} numberOfLines={2}>
            {item.overview}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={topMovies}
        keyExtractor={(item) => String(item.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(index);
        }}
        scrollEnabled={!!topMovies.length}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />
      <View style={styles.pagination}>
        {topMovies.map((_, i) => (
          <View
            key={i}
            style={[styles.dot2, i === currentIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HERO_HEIGHT,
    marginBottom: 8,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
  },
  placeholderBackdrop: {
    backgroundColor: Colors.dark.surfaceLight,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  info: {
    position: "absolute",
    bottom: 40,
    left: 16,
    right: 16,
  },
  genreRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
  },
  genreBadge: {
    backgroundColor: "rgba(229,9,20,0.8)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  genreText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
  },
  movieTitle: {
    color: "#fff",
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    lineHeight: 32,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    color: Colors.dark.rating,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  dot: {
    color: Colors.dark.textMuted,
    fontSize: 14,
  },
  year: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  overview: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  pagination: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
  },
  dot2: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dotActive: {
    backgroundColor: Colors.dark.primary,
    width: 18,
  },
});
