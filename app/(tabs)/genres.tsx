import React from "react";
import { FlatList, StyleSheet, Text, View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { GENRES } from "@/constants/tmdb";
import { GenreCard } from "@/components/GenreCard";

const genreList = Object.entries(GENRES).map(([id, name]) => ({
  id: Number(id),
  name,
}));

export default function GenresScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <Text style={styles.header}>Th\u1ec3 lo\u1ea1i</Text>
      <FlatList
        data={genreList}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <GenreCard id={item.id} name={item.name} />}
        scrollEnabled={!!genreList.length}
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
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});
