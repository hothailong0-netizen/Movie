import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import type { Movie } from "@/lib/api";
import { MovieCard } from "./MovieCard";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  onSeeAll?: () => void;
  cardSize?: "small" | "medium" | "large";
}

export function MovieRow({ title, movies, isLoading, onSeeAll, cardSize = "medium" }: MovieRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onSeeAll && (
          <Pressable onPress={onSeeAll} style={styles.seeAll} hitSlop={8}>
            <Text style={styles.seeAllText}>Xem th\u00eam</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.dark.primary} />
          </Pressable>
        )}
      </View>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color={Colors.dark.primary} />
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => String(item.id)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <MovieCard movie={item} size={cardSize} />}
          scrollEnabled={!!movies.length}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  seeAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  seeAllText: {
    color: Colors.dark.primary,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  list: {
    paddingHorizontal: 16,
  },
  loading: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
});
