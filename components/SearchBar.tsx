import React from "react";
import { StyleSheet, TextInput, View, Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({ value, onChangeText, placeholder = "Tìm phim...", autoFocus = false }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={Colors.dark.textMuted} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.dark.textMuted}
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={Colors.dark.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginHorizontal: 16,
    gap: 8,
  },
  icon: {
    marginRight: 2,
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 15,
    fontWeight: "400" as const,
    paddingVertical: 0,
    ...(Platform.OS === "web" ? { outlineStyle: "none" as any } : {}),
  },
});
