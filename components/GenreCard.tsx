import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { GENRE_ICONS } from "@/constants/tmdb";

const GENRE_COLORS: Record<number, string> = {
  28: "#E50914",
  12: "#FF6B35",
  16: "#7B68EE",
  35: "#FFD700",
  80: "#4A4A4A",
  99: "#2ECC71",
  18: "#E91E63",
  10751: "#FF9800",
  14: "#9C27B0",
  36: "#795548",
  27: "#1A1A2E",
  10402: "#00BCD4",
  9648: "#3F51B5",
  10749: "#FF4081",
  878: "#00E5FF",
  10770: "#607D8B",
  53: "#FF5722",
  10752: "#455A64",
  37: "#D4A574",
};

interface GenreCardProps {
  id: number;
  name: string;
}

export function GenreCard({ id, name }: GenreCardProps) {
  const iconInfo = GENRE_ICONS[id];
  const color = GENRE_COLORS[id] || Colors.dark.primary;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: color, opacity: pressed ? 0.8 : 1 },
      ]}
      onPress={() =>
        router.push({
          pathname: "/genre/[id]",
          params: { id: String(id), name },
        })
      }
      testID={`genre-${id}`}
    >
      <View style={styles.iconWrap}>
        <Ionicons
          name={(iconInfo?.icon || "film") as any}
          size={24}
          color="rgba(255,255,255,0.9)"
        />
      </View>
      <Text style={styles.name}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "45%",
    margin: 6,
    borderRadius: 14,
    padding: 16,
    height: 90,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});
