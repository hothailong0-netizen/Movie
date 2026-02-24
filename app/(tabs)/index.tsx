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
          Không thể tải dữ liệu phim.{"\n"}Vui lòng kiểm tra API key và thử lại.
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
            title="Đang chiếu"
            movies={nowPlaying.data?.results || []}
            isLoading={nowPlaying.isLoading}
            onSeeAll={() =>
              router.push({ pathname: "/category/[type]", params: { type: "now-playing", name: "Đang chiếu" } })
            }
          />

          <MovieRow
            title="Phổ biến"
            movies={popular.data?.results || []}
            isLoading={popular.isLoading}
            onSeeAll={() =>
              router.push({ pathname: "/category/[type]", params: { type: "popular", name: "Phổ biến" } })
            }
          />

          <MovieRow
            title="Đánh giá cao"
            movies={topRated.data?.results || []}
            isLoading={topRated.isLoading}
            onSeeAll={() =>
              router.push({ pathname: "/category/[type]", params: { type: "top-rated", name: "Đánh giá cao" } })
            }
          />

          <MovieRow
            title="Sắp chiếu"
            movies={upcoming.data?.results || []}
            isLoading={upcoming.isLoading}
            onSeeAll={() =>
              router.push({ pathname: "/category/[type]", params: { type: "upcoming", name: "Sắp chiếu" } })
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
    fontWeight: "400" as const,
    textAlign: "center",
    lineHeight: 22,
  },
});
