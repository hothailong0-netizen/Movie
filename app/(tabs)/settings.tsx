import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Linking,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const openTelegram = () => {
    Linking.openURL("https://t.me/hothailong");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <Text style={styles.header}>Cài đặt</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.devCard}>
          <LinearGradient
            colors={["#1A1F2E", "#141927"]}
            style={styles.devCardBg}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.devHeader}>
            <LinearGradient
              colors={["#E50914", "#B20710"]}
              style={styles.devAvatar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="film" size={28} color="#fff" />
            </LinearGradient>
            <View style={styles.devHeaderText}>
              <Text style={styles.appName}>CineVault</Text>
              <Text style={styles.appVersion}>Phiên bản 1.0.0</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.devSection}>
            <Text style={styles.sectionLabel}>Nhà phát triển</Text>
            <View style={styles.devRow}>
              <View style={styles.devIconWrap}>
                <Ionicons name="person" size={18} color={Colors.dark.primary} />
              </View>
              <View>
                <Text style={styles.devName}>Hồ Thái Long</Text>
                <Text style={styles.devRole}>Developer</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.telegramBtn,
                { opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={openTelegram}
            >
              <Ionicons name="paper-plane" size={18} color="#fff" />
              <Text style={styles.telegramText}>@hothailong</Text>
              <Ionicons name="open-outline" size={14} color="rgba(255,255,255,0.6)" />
            </Pressable>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>Thông tin</Text>

          <View style={styles.infoCard}>
            <InfoRow
              icon="film-outline"
              label="Nguồn dữ liệu"
              value="TMDb API"
            />
            <View style={styles.infoRowDivider} />
            <InfoRow
              icon="language-outline"
              label="Ngôn ngữ"
              value="Tiếng Việt"
            />
            <View style={styles.infoRowDivider} />
            <InfoRow
              icon="refresh-outline"
              label="Tự động cập nhật"
              value="Mỗi 5 phút"
            />
            <View style={styles.infoRowDivider} />
            <InfoRow
              icon="grid-outline"
              label="Thể loại"
              value="19 thể loại"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with love by Hồ Thái Long
          </Text>
          <Pressable onPress={openTelegram}>
            <Text style={styles.footerLink}>Telegram: @hothailong</Text>
          </Pressable>
        </View>

        <View style={{ height: Platform.OS === "web" ? 84 : 120 }} />
      </ScrollView>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoRowLeft}>
        <Ionicons name={icon as any} size={18} color={Colors.dark.textSecondary} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
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
    fontWeight: "700" as const,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  scroll: {
    paddingHorizontal: 16,
  },
  devCard: {
    borderRadius: 20,
    overflow: "hidden",
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  devCardBg: {
    ...StyleSheet.absoluteFillObject,
  },
  devHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  devAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  devHeaderText: {
    flex: 1,
  },
  appName: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: "700" as const,
  },
  appVersion: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    fontWeight: "400" as const,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginVertical: 16,
  },
  devSection: {
    gap: 12,
  },
  sectionLabel: {
    color: Colors.dark.textMuted,
    fontSize: 11,
    fontWeight: "600" as const,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  devRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  devIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(229,9,20,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  devName: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "600" as const,
  },
  devRole: {
    color: Colors.dark.textMuted,
    fontSize: 12,
    fontWeight: "400" as const,
    marginTop: 1,
  },
  telegramBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0088cc",
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  telegramText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600" as const,
  },
  infoSection: {
    marginTop: 24,
    gap: 10,
  },
  infoSectionTitle: {
    color: Colors.dark.textMuted,
    fontSize: 11,
    fontWeight: "600" as const,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    paddingLeft: 4,
  },
  infoCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  infoRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoRowDivider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginHorizontal: 14,
  },
  infoLabel: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "400" as const,
  },
  infoValue: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: "500" as const,
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
    gap: 6,
  },
  footerText: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    fontWeight: "400" as const,
  },
  footerLink: {
    color: "#0088cc",
    fontSize: 13,
    fontWeight: "500" as const,
  },
});
