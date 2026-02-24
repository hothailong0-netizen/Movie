import React, { useEffect } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface SplashLoaderProps {
  onFinish: () => void;
}

export function SplashLoader({ onFinish }: SplashLoaderProps) {
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const devOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const fadeOut = useSharedValue(1);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    logoScale.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.back(1.5)) });

    pulseScale.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    titleTranslateY.value = withDelay(400, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));

    subtitleOpacity.value = withDelay(700, withTiming(1, { duration: 500 }));
    devOpacity.value = withDelay(900, withTiming(1, { duration: 500 }));

    progressWidth.value = withDelay(
      600,
      withTiming(SCREEN_WIDTH * 0.6, { duration: 2000, easing: Easing.inOut(Easing.cubic) })
    );

    const timeout = setTimeout(() => {
      fadeOut.value = withTiming(0, { duration: 400, easing: Easing.in(Easing.cubic) }, () => {
        runOnJS(onFinish)();
      });
    }, 3200);

    return () => clearTimeout(timeout);
  }, []);

  const logoAnimStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value * fadeOut.value,
    transform: [{ scale: logoScale.value * pulseScale.value }],
  }));

  const titleAnimStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value * fadeOut.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value * fadeOut.value,
  }));

  const devAnimStyle = useAnimatedStyle(() => ({
    opacity: devOpacity.value * fadeOut.value,
  }));

  const progressAnimStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
    opacity: fadeOut.value,
  }));

  return (
    <LinearGradient
      colors={["#0A0E17", "#111729", "#0E1320"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.logoWrap, logoAnimStyle]}>
          <LinearGradient
            colors={["#E50914", "#B20710"]}
            style={styles.logoCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="film" size={44} color="#fff" />
          </LinearGradient>
        </Animated.View>

        <Animated.Text style={[styles.title, titleAnimStyle]}>
          CineVault
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, subtitleAnimStyle]}>
          Khám phá thế giới điện ảnh
        </Animated.Text>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, progressAnimStyle]}>
            <LinearGradient
              colors={["#E50914", "#FF4D58"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>
        </View>
      </View>

      <Animated.View style={[styles.devInfo, devAnimStyle]}>
        <Text style={styles.devLabel}>Developed by</Text>
        <Text style={styles.devName}>Hồ Thái Long</Text>
        <View style={styles.devContact}>
          <Ionicons name="paper-plane" size={13} color={Colors.dark.textMuted} />
          <Text style={styles.devTelegram}>@hothailong</Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  logoWrap: {
    marginBottom: 8,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "800" as const,
    letterSpacing: 1,
  },
  subtitle: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    fontWeight: "400" as const,
    marginTop: -4,
  },
  progressTrack: {
    width: SCREEN_WIDTH * 0.6,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 2,
    marginTop: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
    overflow: "hidden",
  },
  devInfo: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
    gap: 4,
  },
  devLabel: {
    color: Colors.dark.textMuted,
    fontSize: 11,
    fontWeight: "400" as const,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  devName: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "600" as const,
  },
  devContact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  devTelegram: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    fontWeight: "400" as const,
  },
});
