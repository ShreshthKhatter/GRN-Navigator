import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import StatusBadge from "@/components/StatusBadge";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import { GRNItem } from "@/types/grn";

interface GRNCardProps {
  item: GRNItem;
  onPress: () => void;
}

export default function GRNCard({ item, onPress }: GRNCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText style={styles.poNumber}>PO: {item.poNumber}</ThemedText>
          <ThemedText style={styles.lineItem}>Line {item.poLineItem}</ThemedText>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <ThemedText style={styles.description} numberOfLines={2}>
        {item.materialDescription}
      </ThemedText>

      <View style={styles.vendorRow}>
        <Feather name="truck" size={14} color={Colors.light.textSecondary} />
        <ThemedText style={styles.vendorName} numberOfLines={1}>
          {item.vendorName}
        </ThemedText>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <ThemedText style={styles.detailLabel}>Qty</ThemedText>
          <ThemedText style={styles.detailValue}>
            {item.orderedQuantity} {item.unit}
          </ThemedText>
        </View>
        <View style={styles.detailItem}>
          <ThemedText style={styles.detailLabel}>Location</ThemedText>
          <ThemedText style={styles.detailValue}>{item.storageLocation}</ThemedText>
        </View>
        <View style={styles.detailItem}>
          <ThemedText style={styles.detailLabel}>Invoice</ThemedText>
          <ThemedText style={styles.detailValue}>{formatDate(item.invoiceDate)}</ThemedText>
        </View>
      </View>

      {item.status === "error" && item.errorMessage ? (
        <View style={styles.errorRow}>
          <Feather name="alert-circle" size={14} color={Colors.light.error} />
          <ThemedText style={styles.errorText} numberOfLines={1}>
            {item.errorMessage}
          </ThemedText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cardPressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  poNumber: {
    ...Typography.h3,
    color: Colors.light.primary,
  },
  lineItem: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
  },
  description: {
    ...Typography.body,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  vendorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  vendorName: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: Spacing.md,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  detailValue: {
    ...Typography.bodySmall,
    fontWeight: "500",
    color: Colors.light.text,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.error,
    gap: Spacing.xs,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.light.error,
    flex: 1,
  },
});
