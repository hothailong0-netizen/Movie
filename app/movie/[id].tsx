import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { BACKDROP_SIZES, POSTER_SIZES } from "@/constants/tmdb";
import { fetchMovieDetail } from "@/lib/api";
import type { CastMember, Movie } from "@/lib/api";
import { addFavorite, removeFavorite, isFavorite } from "@/lib/favorites";
import { MovieRow } from "@/components/MovieRow";
import { MovieDetailSkeleton } from "@/components/SkeletonLoader";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const queryClient = useQueryClient();
  const [isFav, setIsFav] = useState(false);

  const movieQuery = useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovieDetail(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    if (id) {
      isFavorite(Number(id)).then(setIsFav);
    }
  }, [id]);

  const toggleFavorite = useCallback(async () => {
    if (!movieQuery.data) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isFav) {
      await removeFavorite(movieQuery.data.id);
      setIsFav(false);
    } else {
      await addFavorite(movieQuery.data as Movie);
      setIsFav(true);
    }
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
  }, [isFav, movieQuery.data, queryClient]);

  if (movieQuery.isLoading) {
    return <MovieDetailSkeleton />;
  }

  const movie = movieQuery.data;
  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Kh\u00f4ng t\u00ecm th\u1ea5y phim</Text>
      </View>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `${BACKDROP_SIZES.large}${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `${POSTER_SIZES.large}${movie.poster_path}`
    : null;

  const director = movie.credits?.crew?.find((c) => c.job === "Director");
  const cast = movie.credits?.cast?.slice(0, 10) || [];
  const similar = movie.similar?.results?.slice(0, 10) || [];

  const hours = Math.floor((movie.runtime || 0) / 60);
  const mins = (movie.runtime || 0) % 60;
  const runtimeStr = movie.runtime ? `${hours}h ${mins}m` : "";

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.backdropWrap}>
          {backdropUrl ? (
            <Image
              source={{ uri: backdropUrl }}
              style={styles.backdrop}
              contentFit="cover"
              transition={400}
            />
          ) : (
            <View style={[styles.backdrop, { backgroundColor: Colors.dark.surfaceLight }]} />
          )}
          <LinearGradient
            colors={["transparent", "rgba(10,14,23,0.7)", Colors.dark.background]}
            style={styles.gradient}
          />

          <Pressable
            style={[styles.backBtn, { top: insets.top + webTopInset + 8 }]}
            onPress={() => router.back()}
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>

          <Pressable
            style={[styles.favBtn, { top: insets.top + webTopInset + 8 }]}
            onPress={toggleFavorite}
            hitSlop={12}
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={24}
              color={isFav ? Colors.dark.primary : "#fff"}
            />
          </Pressable>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            {posterUrl && (
              <Image
                source={{ uri: posterUrl }}
                style={styles.posterSmall}
                contentFit="cover"
                transition={300}
              />
            )}
            <View style={styles.titleInfo}>
              <Text style={styles.title}>{movie.title}</Text>
              {movie.tagline ? (
                <Text style={styles.tagline}>{movie.tagline}</Text>
              ) : null}
              <View style={styles.metaRow}>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color={Colors.dark.rating} />
                  <Text style={styles.ratingVal}>{movie.vote_average.toFixed(1)}</Text>
                  <Text style={styles.voteCount}>({movie.vote_count})</Text>
                </View>
              </View>
              <View style={styles.chipRow}>
                {movie.release_date ? (
                  <View style={styles.chip}>
                    <Ionicons name="calendar-outline" size={12} color={Colors.dark.textSecondary} />
                    <Text style={styles.chipText}>{movie.release_date.substring(0, 4)}</Text>
                  </View>
                ) : null}
                {runtimeStr ? (
                  <View style={styles.chip}>
                    <Ionicons name="time-outline" size={12} color={Colors.dark.textSecondary} />
                    <Text style={styles.chipText}>{runtimeStr}</Text>
                  </View>
                ) : null}
                {movie.original_language ? (
                  <View style={styles.chip}>
                    <Ionicons name="globe-outline" size={12} color={Colors.dark.textSecondary} />
                    <Text style={styles.chipText}>{movie.original_language.toUpperCase()}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>

          {movie.genres && movie.genres.length > 0 && (
            <View style={styles.genreRow}>
              {movie.genres.map((g) => (
                <Pressable
                  key={g.id}
                  style={styles.genreBadge}
                  onPress={() =>
                    router.push({
                      pathname: "/genre/[id]",
                      params: { id: String(g.id), name: g.name },
                    })
                  }
                >
                  <Text style={styles.genreText}>{g.name}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {movie.overview ? (
            <View style={styles.overviewSection}>
              <Text style={styles.sectionTitle}>N\u1ed9i dung</Text>
              <Text style={styles.overviewText}>{movie.overview}</Text>
            </View>
          ) : null}

          {director && (
            <View style={styles.directorRow}>
              <Text style={styles.directorLabel}>\u0110\u1ea1o di\u1ec5n:</Text>
              <Text style={styles.directorName}>{director.name}</Text>
            </View>
          )}

          {cast.length > 0 && (
            <View style={styles.castSection}>
              <Text style={styles.sectionTitle}>Di\u1ec5n vi\u00ean</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {cast.map((person) => (
                  <CastCard key={person.id} person={person} />
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {similar.length > 0 && (
          <MovieRow title="Phim t\u01b0\u01a1ng t\u1ef1" movies={similar} />
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function CastCard({ person }: { person: CastMember }) {
  const profileUrl = person.profile_path
    ? `${POSTER_SIZES.small}${person.profile_path}`
    : null;

  return (
    <View style={castStyles.card}>
      <View style={castStyles.imageWrap}>
        {profileUrl ? (
          <Image source={{ uri: profileUrl }} style={castStyles.image} contentFit="cover" />
        ) : (
          <View style={castStyles.placeholder}>
            <Ionicons name="person" size={20} color={Colors.dark.textMuted} />
          </View>
        )}
      </View>
      <Text style={castStyles.name} numberOfLines={1}>{person.name}</Text>
      <Text style={castStyles.character} numberOfLines={1}>{person.character}</Text>
    </View>
  );
}

const castStyles = StyleSheet.create({
  card: {
    width: 80,
    marginRight: 12,
    alignItems: "center",
  },
  imageWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: Colors.dark.surface,
    marginBottom: 6,
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
  name: {
    color: Colors.dark.text,
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  character: {
    color: Colors.dark.textMuted,
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 1,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  center: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  backdropWrap: {
    width: SCREEN_WIDTH,
    height: 300,
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  favBtn: {
    position: "absolute",
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  infoSection: {
    paddingHorizontal: 16,
    marginTop: -40,
  },
  titleRow: {
    flexDirection: "row",
    gap: 14,
  },
  posterSmall: {
    width: 100,
    height: 150,
    borderRadius: 12,
  },
  titleInfo: {
    flex: 1,
    justifyContent: "flex-end",
    gap: 4,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    lineHeight: 28,
  },
  tagline: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingVal: {
    color: Colors.dark.rating,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  voteCount: {
    color: Colors.dark.textMuted,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
    flexWrap: "wrap",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.dark.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chipText: {
    color: Colors.dark.textSecondary,
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  genreBadge: {
    backgroundColor: "rgba(229,9,20,0.15)",
    borderWidth: 1,
    borderColor: "rgba(229,9,20,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  genreText: {
    color: Colors.dark.primaryLight,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  overviewSection: {
    marginTop: 20,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    marginBottom: 10,
  },
  overviewText: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  directorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },
  directorLabel: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  directorName: {
    color: Colors.dark.text,
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  castSection: {
    marginTop: 20,
    marginBottom: 20,
  },
});
