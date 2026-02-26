import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
  Platform,
  Text,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";

const SOURCES = [
  {
    name: "Server 1",
    getUrl: (id: string) => `https://vidsrc.to/embed/movie/${id}`,
  },
  {
    name: "Server 2",
    getUrl: (id: string) => `https://vidsrc.me/embed/movie?tmdb=${id}`,
  },
  {
    name: "Server 3",
    getUrl: (id: string) => `https://vidsrc.xyz/embed/movie/${id}`,
  },
  {
    name: "Server 4",
    getUrl: (id: string) => `https://2embed.cc/embed/${id}`,
  },
  {
    name: "Server 5",
    getUrl: (id: string) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
  },
];

export default function WatchScreen() {
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const [loading, setLoading] = useState(true);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const currentSource = SOURCES[sourceIndex];
  const streamUrl = currentSource.getUrl(id || "");

  const handleError = () => {
    setLoading(false);
    setHasError(true);
  };

  const switchSource = (index: number) => {
    if (index === sourceIndex) return;
    setSourceIndex(index);
    setLoading(true);
    setHasError(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.dark.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title || "Xem phim"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.sourceBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sourceList}>
          {SOURCES.map((source, idx) => (
            <Pressable
              key={source.name}
              onPress={() => switchSource(idx)}
              style={[
                styles.sourceChip,
                idx === sourceIndex && styles.sourceChipActive,
              ]}
            >
              <Text
                style={[
                  styles.sourceText,
                  idx === sourceIndex && styles.sourceTextActive,
                ]}
              >
                {source.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.playerWrap}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.dark.primary} />
            <Text style={styles.loadingText}>Đang tải phim...</Text>
            <Text style={styles.sourceLabel}>Nguồn: {currentSource.name}</Text>
          </View>
        )}

        {hasError && (
          <View style={styles.loadingOverlay}>
            <Ionicons name="alert-circle-outline" size={48} color={Colors.dark.primary} />
            <Text style={styles.errorText}>Nguồn phim bị lỗi</Text>
            <Text style={styles.loadingText}>Hãy thử chuyển sang nguồn khác</Text>
          </View>
        )}

        {Platform.OS === "web" ? (
          <iframe
            src={streamUrl}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              backgroundColor: "#000",
            }}
            allowFullScreen
            onLoad={() => { setLoading(false); setHasError(false); }}
          />
        ) : (
          <WebView
            key={`${sourceIndex}-${id}`}
            source={{ uri: streamUrl }}
            style={styles.webview}
            allowsFullscreenVideo
            javaScriptEnabled
            domStorageEnabled
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback
            onLoadEnd={() => { setLoading(false); setHasError(false); }}
            onError={handleError}
            onHttpError={handleError}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "600" as const,
    flex: 1,
    textAlign: "center",
  },
  sourceBar: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  sourceList: {
    gap: 8,
    paddingHorizontal: 4,
  },
  sourceChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  sourceChipActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  sourceText: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: "500" as const,
  },
  sourceTextActive: {
    color: "#fff",
    fontWeight: "600" as const,
  },
  playerWrap: {
    flex: 1,
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    gap: 12,
  },
  loadingText: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    fontWeight: "400" as const,
  },
  sourceLabel: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
    fontWeight: "400" as const,
  },
  errorText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "600" as const,
  },
});
