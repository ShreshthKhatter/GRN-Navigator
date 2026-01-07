import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { StatusColors, BorderRadius, Spacing, Typography } from "@/constants/theme";
import { GRNStatus } from "@/types/grn";

interface StatusBadgeProps {
  status: GRNStatus;
}

const statusLabels: Record<GRNStatus, string> = {
  pending: "Pending",
  completed: "Completed",
  error: "Error",
  in_progress: "In Progress",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const backgroundColor = StatusColors[status === "in_progress" ? "inProgress" : status];

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <ThemedText style={styles.text}>{statusLabels[status]}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  text: {
    ...Typography.caption,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
