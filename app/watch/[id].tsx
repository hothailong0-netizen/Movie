import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
  Platform,
  Text,
  ScrollView,
  Dimensions,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";

const SOURCES = [
  {
    name: "Server 1",
    icon: "server-outline" as const,
    getUrl: (id: string) => `https://vidsrc.to/embed/movie/${id}`,
  },
  {
    name: "Server 2",
    icon: "cloud-outline" as const,
    getUrl: (id: string) => `https://vidsrc.me/embed/movie?tmdb=${id}`,
  },
  {
    name: "Server 3",
    icon: "globe-outline" as const,
    getUrl: (id: string) => `https://vidsrc.xyz/embed/movie/${id}`,
  },
  {
    name: "Server 4",
    icon: "planet-outline" as const,
    getUrl: (id: string) => `https://2embed.cc/embed/${id}`,
  },
  {
    name: "Server 5",
    icon: "rocket-outline" as const,
    getUrl: (id: string) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
  },
];

const AD_BLOCK_JS = `
(function() {
  'use strict';

  const adSelectors = [
    'iframe[src*="ad"]', 'iframe[src*="banner"]', 'iframe[src*="pop"]',
    'iframe[src*="track"]', 'iframe[src*="click"]',
    'div[class*="ad-"]', 'div[class*="ads-"]', 'div[class*="advert"]',
    'div[class*="banner"]', 'div[class*="popup"]', 'div[class*="overlay"]',
    'div[id*="ad-"]', 'div[id*="ads-"]', 'div[id*="advert"]',
    'div[id*="banner"]', 'div[id*="popup"]',
    'a[target="_blank"][rel*="nofollow"]',
    'a[href*="click"]', 'a[href*="track"]',
    '.ad', '.ads', '.advert', '.advertisement',
    '.banner-ad', '.popup-ad', '.overlay-ad',
    '#overlay', '#popup', '#ad-container',
    'div[style*="z-index: 9999"]',
    'div[style*="z-index:9999"]',
    'div[style*="z-index: 99999"]',
    'div[style*="z-index:99999"]',
    'div[style*="position: fixed"][style*="z-index"]',
  ];

  function removeAds() {
    adSelectors.forEach(function(sel) {
      try {
        document.querySelectorAll(sel).forEach(function(el) {
          var isPlayer = el.closest('.jw-wrapper') || el.closest('.plyr') ||
                         el.closest('video') || el.tagName === 'VIDEO' ||
                         el.closest('.player') || el.closest('#player');
          if (!isPlayer) {
            el.style.display = 'none';
            el.remove();
          }
        });
      } catch(e) {}
    });
  }

  window.open = function() { return null; };
  window.alert = function() {};
  window.confirm = function() { return false; };
  window.prompt = function() { return null; };

  var origCreateElement = document.createElement.bind(document);
  document.createElement = function(tag) {
    var el = origCreateElement(tag);
    if (tag.toLowerCase() === 'a') {
      el.addEventListener('click', function(e) {
        var href = el.href || '';
        if (href.indexOf('ad') > -1 || href.indexOf('click') > -1 ||
            href.indexOf('track') > -1 || href.indexOf('pop') > -1 ||
            el.target === '_blank') {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }
    return el;
  };

  document.addEventListener('click', function(e) {
    var target = e.target;
    while (target && target !== document) {
      if (target.tagName === 'A') {
        var href = target.href || '';
        if (target.target === '_blank' ||
            href.indexOf('ad') > -1 || href.indexOf('click') > -1) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
      target = target.parentElement;
    }
  }, true);

  removeAds();
  setInterval(removeAds, 1500);

  var observer = new MutationObserver(function() { removeAds(); });
  observer.observe(document.body || document.documentElement, {
    childList: true, subtree: true
  });

  var style = document.createElement('style');
  style.textContent = [
    'body { background: #000 !important; }',
    '.ad, .ads, .advert, .advertisement, .banner-ad, .popup-ad { display: none !important; }',
    'div[style*="z-index: 9999"], div[style*="z-index:9999"] { display: none !important; }',
    'div[style*="z-index: 99999"], div[style*="z-index:99999"] { display: none !important; }',
    'iframe:not([src*="player"]):not([src*="embed"]):not([src*="vidsrc"]):not([src*="multiembed"]):not([src*="2embed"]):not([allowfullscreen]) { display: none !important; }',
  ].join('\\n');
  document.head.appendChild(style);
})();
true;
`;

export default function WatchScreen() {
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const webViewRef = useRef<WebView>(null);
  const controlsTimeout = useRef<ReturnType<typeof setTimeout>>();

  const currentSource = SOURCES[sourceIndex];
  const streamUrl = currentSource.getUrl(id || "");

  const isActualLandscape = screenWidth > screenHeight;

  useEffect(() => {
    if (showControls && !loading) {
      controlsTimeout.current = setTimeout(() => setShowControls(false), 4000);
    }
    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, [showControls, loading]);

  const handleError = useCallback(() => {
    setLoading(false);
    if (retryCount < 2) {
      setRetryCount(r => r + 1);
      setLoading(true);
    } else {
      setHasError(true);
    }
  }, [retryCount]);

  const switchSource = useCallback((index: number) => {
    if (index === sourceIndex) return;
    setSourceIndex(index);
    setLoading(true);
    setHasError(false);
    setRetryCount(0);
  }, [sourceIndex]);

  const autoNextSource = useCallback(() => {
    const next = (sourceIndex + 1) % SOURCES.length;
    switchSource(next);
  }, [sourceIndex, switchSource]);

  const toggleControls = useCallback(() => {
    setShowControls(s => !s);
  }, []);

  const toggleOrientation = useCallback(() => {
    setIsLandscape(l => !l);
  }, []);

  const reloadPlayer = useCallback(() => {
    setLoading(true);
    setHasError(false);
    setRetryCount(0);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  }, []);

  const containerStyle = isLandscape
    ? [styles.containerLandscape, { width: screenHeight, height: screenWidth }]
    : [styles.container, { paddingTop: insets.top + webTopInset }];

  return (
    <View style={containerStyle}>
      <StatusBar hidden={isLandscape} />

      {(!isLandscape || showControls) && (
        <View style={isLandscape ? styles.headerLandscape : styles.header}>
          <LinearGradient
            colors={["rgba(0,0,0,0.9)", "transparent"]}
            style={StyleSheet.absoluteFillObject}
          />
          <Pressable onPress={() => router.back()} hitSlop={16} style={styles.backBtn}>
            <View style={styles.iconCircle}>
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </View>
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title || "Xem phim"}
            </Text>
            <Text style={styles.headerSubtitle}>{currentSource.name}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable onPress={toggleOrientation} hitSlop={12} style={styles.actionBtn}>
              <Ionicons
                name={isLandscape ? "phone-portrait-outline" : "phone-landscape-outline"}
                size={20}
                color="#fff"
              />
            </Pressable>
            <Pressable onPress={reloadPlayer} hitSlop={12} style={styles.actionBtn}>
              <Ionicons name="refresh-outline" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
      )}

      {(!isLandscape || showControls) && (
        <View style={isLandscape ? styles.sourceBarLandscape : styles.sourceBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sourceList}
          >
            {SOURCES.map((source, idx) => (
              <Pressable
                key={source.name}
                onPress={() => switchSource(idx)}
                style={[
                  styles.sourceChip,
                  idx === sourceIndex && styles.sourceChipActive,
                ]}
              >
                <Ionicons
                  name={source.icon}
                  size={14}
                  color={idx === sourceIndex ? "#fff" : Colors.dark.textSecondary}
                />
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
      )}

      <Pressable style={styles.playerWrap} onPress={toggleControls}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loaderBox}>
              <ActivityIndicator size="large" color={Colors.dark.primary} />
              <Text style={styles.loadingText}>Đang tải phim...</Text>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
            </View>
          </View>
        )}

        {hasError && (
          <View style={styles.loadingOverlay}>
            <View style={styles.errorBox}>
              <View style={styles.errorIconWrap}>
                <Ionicons name="warning-outline" size={40} color={Colors.dark.primary} />
              </View>
              <Text style={styles.errorTitle}>Không thể phát phim</Text>
              <Text style={styles.errorDesc}>Nguồn phim hiện tại không khả dụng</Text>
              <View style={styles.errorActions}>
                <Pressable
                  onPress={autoNextSource}
                  style={styles.errorBtnPrimary}
                >
                  <Ionicons name="swap-horizontal" size={18} color="#fff" />
                  <Text style={styles.errorBtnText}>Đổi nguồn</Text>
                </Pressable>
                <Pressable
                  onPress={reloadPlayer}
                  style={styles.errorBtnSecondary}
                >
                  <Ionicons name="refresh" size={18} color={Colors.dark.text} />
                  <Text style={styles.errorBtnTextSec}>Thử lại</Text>
                </Pressable>
              </View>
            </View>
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
            ref={webViewRef}
            key={`${sourceIndex}-${id}-${retryCount}`}
            source={{ uri: streamUrl }}
            style={styles.webview}
            allowsFullscreenVideo
            javaScriptEnabled
            domStorageEnabled
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback
            injectedJavaScript={AD_BLOCK_JS}
            onLoadEnd={() => { setLoading(false); setHasError(false); }}
            onError={handleError}
            onHttpError={handleError}
            onShouldStartLoadWithRequest={(request) => {
              const url = request.url.toLowerCase();
              if (
                url.includes("ad.") || url.includes("ads.") ||
                url.includes("doubleclick") || url.includes("googlesyndication") ||
                url.includes("adservice") || url.includes("popads") ||
                url.includes("popunder") || url.includes("clickadu") ||
                url.includes("trafficjunky") || url.includes("exoclick") ||
                url.includes("juicyads") || url.includes("propellerads")
              ) {
                return false;
              }
              return true;
            }}
            setSupportMultipleWindows={false}
            javaScriptCanOpenWindowsAutomatically={false}
            originWhitelist={["https://*", "http://*"]}
            userAgent="Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
          />
        )}
      </Pressable>

      {isLandscape && !showControls && (
        <Pressable
          style={styles.landscapeTapZone}
          onPress={toggleControls}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  containerLandscape: {
    flex: 1,
    backgroundColor: "#000",
    transform: [{ rotate: "90deg" }],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 20,
  },
  headerLandscape: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    zIndex: 100,
  },
  backBtn: {
    padding: 4,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontWeight: "500",
    marginTop: 1,
  },
  headerActions: {
    flexDirection: "row",
    gap: 4,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  sourceBar: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  sourceBarLandscape: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 100,
  },
  sourceList: {
    gap: 6,
    paddingHorizontal: 4,
  },
  sourceChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  sourceChipActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  sourceText: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  sourceTextActive: {
    color: "#fff",
    fontWeight: "700",
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
  },
  loaderBox: {
    alignItems: "center",
    gap: 16,
    padding: 32,
  },
  loadingText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "500",
  },
  progressBar: {
    width: 120,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    width: "60%",
    height: "100%",
    backgroundColor: Colors.dark.primary,
    borderRadius: 2,
  },
  errorBox: {
    alignItems: "center",
    gap: 12,
    padding: 32,
    maxWidth: 320,
  },
  errorIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(229,9,20,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  errorTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  errorDesc: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    fontWeight: "400",
    textAlign: "center",
  },
  errorActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  errorBtnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: Colors.dark.primary,
  },
  errorBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  errorBtnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  errorBtnTextSec: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "600",
  },
  landscapeTapZone: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
});
