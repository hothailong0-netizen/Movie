import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Platform,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { fetchTrending, fetchNowPlaying, fetchPopular, fetchTopRated, fetchUpcoming } from "@/lib/api";
import { HeroSlider } from "@/components/HeroSlider";
import { MovieRow } from "@/components/MovieRow";
import { HomeScreenSkeleton } from "@/components/SkeletonLoader";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const trending = useQuery({
    queryKey: ["movies", "trending"],
    queryFn: fetchTrending,
    refetchInterval: 5 * 60 * 1000,
  });

  const nowPlaying = useQuery({
    queryKey: ["movies", "now-playing"],
    queryFn: () => fetchNowPlaying(),
    refetchInterval: 5 * 60 * 1000,
  });

  const popular = useQuery({
    queryKey: ["movies", "popular"],
    queryFn: () => fetchPopular(),
    refetchInterval: 5 * 60 * 1000,
  });

  const topRated = useQuery({
    queryKey: ["movies", "top-rated"],
    queryFn: () => fetchTopRated(),
    refetchInterval: 10 * 60 * 1000,
  });

  const upcoming = useQuery({
    queryKey: ["movies", "upcoming"],
    queryFn: () => fetchUpcoming(),
    refetchInterval: 10 * 60 * 1000,
  });

  const isLoading = trending.isLoading && nowPlaying.isLoading;
  const isError = trending.isError && nowPlaying.isError;

  const onRefresh = () => {
    trending.refetch();
    nowPlaying.refetch();
    popular.refetch();
    topRated.refetch();
    upcoming.refetch();
  };

  if (isLoading) {
    return <HomeScreenSkeleton />;
  }

  if (isError) {
    return (
      <View style={[styles.center, { paddingTop: insets.top + webTopInset }]}>
        <Text style={styles.errorText}>
          Kh\u00f4ng th\u1ec3 t\u1ea3i d\u1eef li\u1ec7u phim.{"\n"}Vui l\u00f2ng ki\u1ec3m tra API key v\u00e0 th\u1eed l\u1ea1i.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={!!trending.isRefetching}
            onRefresh={onRefresh}
            tintColor={Colors.dark.primary}
          />
        }
      >
        {trending.data?.results && trending.data.results.length > 0 && (
          <HeroSlider movies={trending.data.results} />
        )}

        <View style={{ paddingTop: 8 }}>
          <MovieRow
            title="\u0110ang chi\u1ebfu"
            movies={nowPlaying.data?.results || []}
            isLoading={nowPlaying.isLoading}
            onSeeAll={() =>
              router.push({ pathname: "/category/[type]", params: { type: "now-playing", name: "\u0110ang chi\u1ebfu" } })
            }
          />

          <MovieRow
            title="Ph\u1ed5 bi\u1ebfn"
            movies={popular.data?.results || []}
            isLoading={popular.isLoading}
            onSeeAll={() =>
              router.push({ pathname: "/category/[type]", params: { type: "popular", name: "Ph\u1ed5 bi\u1ebfn" } })
            }
          />

          <MovieRow
            title="\u0110\u00e1nh gi\u00e1 cao"
            movies={topRated.data?.results || []}
            isLoading={topRated.isLoading}
            onSeeAll={() =>
              router.push({ pathname: "/category/[type]", params: { type: "top-rated", name: "\u0110\u00e1nh gi\u00e1 cao" } })
            }
          />

          <MovieRow
            title="S\u1eafp chi\u1ebfu"
            movies={upcoming.data?.results || []}
            isLoading={upcoming.isLoading}
            onSeeAll={() =>
              router.push({ pathname: "/category/[type]", params: { type: "upcoming", name: "S\u1eafp chi\u1ebfu" } })
            }
          />
        </View>

        <View style={{ height: Platform.OS === "web" ? 84 : 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scroll: {
    flex: 1,
  },
  center: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  errorText: {
    color: Colors.dark.textSecondary,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
});
