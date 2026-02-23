import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Colors from "@/constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function SkeletonBlock({ width, height, borderRadius = 8, style }: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: Colors.dark.skeleton,
        },
        animStyle,
        style,
      ]}
    />
  );
}

export function HomeScreenSkeleton() {
  const cardW = (SCREEN_WIDTH - 48) / 2.3;
  const cardH = cardW * 1.5;

  return (
    <View style={styles.container}>
      <SkeletonBlock width={SCREEN_WIDTH} height={420} borderRadius={0} />
      <View style={styles.section}>
        <SkeletonBlock width={140} height={20} style={styles.sectionTitle} />
        <View style={styles.row}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ marginRight: 12 }}>
              <SkeletonBlock width={cardW} height={cardH} borderRadius={12} />
              <SkeletonBlock width={cardW * 0.8} height={14} style={{ marginTop: 8 }} />
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <SkeletonBlock width={120} height={20} style={styles.sectionTitle} />
        <View style={styles.row}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ marginRight: 12 }}>
              <SkeletonBlock width={cardW} height={cardH} borderRadius={12} />
              <SkeletonBlock width={cardW * 0.8} height={14} style={{ marginTop: 8 }} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export function MovieDetailSkeleton() {
  return (
    <View style={styles.container}>
      <SkeletonBlock width={SCREEN_WIDTH} height={300} borderRadius={0} />
      <View style={{ padding: 16, gap: 12 }}>
        <SkeletonBlock width="80%" height={28} />
        <SkeletonBlock width="60%" height={16} />
        <SkeletonBlock width="100%" height={80} />
        <SkeletonBlock width="40%" height={20} style={{ marginTop: 8 }} />
        <View style={styles.row}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={{ marginRight: 12, alignItems: "center" }}>
              <SkeletonBlock width={60} height={60} borderRadius={30} />
              <SkeletonBlock width={50} height={12} style={{ marginTop: 6 }} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
  },
});
