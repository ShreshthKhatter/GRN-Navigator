import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  visible: boolean;
  message: string;
  type: ToastType;
  onHide: () => void;
  duration?: number;
}

const toastConfig = {
  success: {
    backgroundColor: Colors.light.success,
    icon: "check-circle" as const,
  },
  error: {
    backgroundColor: Colors.light.error,
    icon: "x-circle" as const,
  },
  info: {
    backgroundColor: Colors.light.primary,
    icon: "info" as const,
  },
};

export default function Toast({
  visible,
  message,
  type,
  onHide,
  duration = 3000,
}: ToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onHide());
  };

  if (!visible) return null;

  const config = toastConfig[type];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          top: insets.top + Spacing.md,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Feather name={config.icon} size={20} color="#FFFFFF" />
      <ThemedText style={styles.message} numberOfLines={2}>
        {message}
      </ThemedText>
      <Pressable onPress={hideToast} style={styles.closeButton}>
        <Feather name="x" size={18} color="#FFFFFF" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    zIndex: 1000,
    gap: Spacing.sm,
  },
  message: {
    ...Typography.bodySmall,
    color: "#FFFFFF",
    flex: 1,
  },
  closeButton: {
    padding: Spacing.xs,
  },
});
