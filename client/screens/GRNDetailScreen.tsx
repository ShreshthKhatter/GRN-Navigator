import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import StatusBadge from "@/components/StatusBadge";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import { GRNItem } from "@/types/grn";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { useGRN } from "@/contexts/GRNContext";
import { useToast } from "@/contexts/ToastContext";

type RouteType = RouteProp<RootStackParamList, "GRNDetail">;

export default function GRNDetailScreen() {
  const route = useRoute<RouteType>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { grnId } = route.params;
  const { grns, submitGR, getGRNAttachments, loadGRNs, isLoading: contextLoading } = useGRN();
  const { showToast } = useToast();

  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (grns.length === 0) {
      loadGRNs();
    }
  }, [grns.length, loadGRNs]);

  const grn = grns.find((g) => g.id === grnId);
  const attachments = getGRNAttachments(grnId);

  const handleQuickPost = async () => {
    if (!grn) return;

    Alert.alert(
      "Quick Post GR",
      `Post full quantity (${grn.orderedQuantity} ${grn.unit}) for this PO?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Post",
          onPress: async () => {
            setIsPosting(true);
            try {
              const result = await submitGR(
                grn.id,
                grn.orderedQuantity,
                grn.storageLocation
              );

              if (result.success) {
                showToast(result.message, "success");
                navigation.goBack();
              } else {
                showToast(result.message, "error");
              }
            } catch (error) {
              showToast("Failed to post GR", "error");
            } finally {
              setIsPosting(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (contextLoading && grns.length === 0) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!grn) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <Feather name="alert-circle" size={48} color={Colors.light.error} />
        <ThemedText style={styles.errorText}>GRN not found</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + (grn.status === "pending" ? 100 : Spacing.xl) },
        ]}
      >
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <ThemedText style={styles.poNumber}>PO: {grn.poNumber}</ThemedText>
            <StatusBadge status={grn.status} />
          </View>
          <ThemedText style={styles.lineItem}>Line Item {grn.poLineItem}</ThemedText>
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Material Details</ThemedText>
          <ThemedText style={styles.materialDescription}>
            {grn.materialDescription}
          </ThemedText>

          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>Ordered Qty</ThemedText>
              <ThemedText style={styles.detailValue}>
                {grn.orderedQuantity} {grn.unit}
              </ThemedText>
            </View>
            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>Received Qty</ThemedText>
              <ThemedText
                style={[
                  styles.detailValue,
                  grn.receivedQuantity > 0 && { color: Colors.light.success },
                ]}
              >
                {grn.receivedQuantity} {grn.unit}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Vendor Information</ThemedText>
          <View style={styles.vendorRow}>
            <Feather name="truck" size={18} color={Colors.light.primary} />
            <ThemedText style={styles.vendorName}>{grn.vendorName}</ThemedText>
          </View>
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Invoice Details</ThemedText>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Invoice Number</ThemedText>
            <ThemedText style={styles.detailValue}>{grn.invoiceNumber}</ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Invoice Date</ThemedText>
            <ThemedText style={styles.detailValue}>{formatDate(grn.invoiceDate)}</ThemedText>
          </View>
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Location & Classification</ThemedText>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Storage Location</ThemedText>
            <ThemedText style={styles.detailValue}>{grn.storageLocation}</ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Vertical</ThemedText>
            <ThemedText style={styles.detailValue}>{grn.vertical}</ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Account</ThemedText>
            <ThemedText style={styles.detailValue}>{grn.account}</ThemedText>
          </View>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Geography</ThemedText>
            <ThemedText style={styles.detailValue}>{grn.geography}</ThemedText>
          </View>
        </View>

        {attachments.length > 0 ? (
          <View style={styles.card}>
            <ThemedText style={styles.sectionTitle}>
              Attachments ({attachments.length})
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.attachmentsRow}>
                {attachments.map((att) => (
                  <View key={att.id} style={styles.attachmentThumb}>
                    <Image source={{ uri: att.uri }} style={styles.attachmentImage} />
                    <ThemedText style={styles.attachmentType}>{att.type}</ThemedText>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        ) : null}

        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Timeline</ThemedText>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: Colors.light.success }]} />
            <View style={styles.timelineContent}>
              <ThemedText style={styles.timelineTitle}>Invoice Received</ThemedText>
              <ThemedText style={styles.timelineDate}>
                {formatDate(grn.createdAt)} at {formatTime(grn.createdAt)}
              </ThemedText>
            </View>
          </View>
          {grn.status === "completed" ? (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: Colors.light.success }]} />
              <View style={styles.timelineContent}>
                <ThemedText style={styles.timelineTitle}>GR Posted</ThemedText>
                <ThemedText style={styles.timelineDate}>
                  {formatDate(grn.updatedAt)} at {formatTime(grn.updatedAt)}
                </ThemedText>
              </View>
            </View>
          ) : grn.status === "pending" ? (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: Colors.light.warning }]} />
              <View style={styles.timelineContent}>
                <ThemedText style={styles.timelineTitle}>Awaiting GR</ThemedText>
                <ThemedText style={styles.timelineDate}>Pending goods receipt</ThemedText>
              </View>
            </View>
          ) : null}
        </View>

        {grn.status === "error" && grn.errorMessage ? (
          <View style={[styles.card, styles.errorCard]}>
            <View style={styles.errorHeader}>
              <Feather name="alert-circle" size={20} color={Colors.light.error} />
              <ThemedText style={styles.errorTitle}>Error Details</ThemedText>
            </View>
            <ThemedText style={styles.errorMessage}>{grn.errorMessage}</ThemedText>
          </View>
        ) : null}
      </ScrollView>

      {grn.status === "pending" ? (
        <View style={[styles.actionContainer, { paddingBottom: insets.bottom + Spacing.md }]}>
          <Pressable
            style={[styles.actionButton, isPosting && styles.buttonDisabled]}
            onPress={handleQuickPost}
            disabled={isPosting}
          >
            {isPosting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Feather name="check-circle" size={20} color="#FFFFFF" />
                <ThemedText style={styles.actionButtonText}>
                  Quick Post Full Quantity
                </ThemedText>
              </>
            )}
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundRoot,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundRoot,
  },
  errorText: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    marginTop: Spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  headerSection: {
    marginBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  poNumber: {
    ...Typography.h1,
    color: Colors.light.primary,
  },
  lineItem: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
  },
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  errorCard: {
    borderColor: Colors.light.error,
    backgroundColor: Colors.light.error + "10",
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
  },
  materialDescription: {
    ...Typography.body,
    color: Colors.light.text,
    marginBottom: Spacing.lg,
  },
  detailGrid: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  detailItem: {
    flex: 1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  detailLabel: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
  },
  detailValue: {
    ...Typography.body,
    fontWeight: "500",
    color: Colors.light.text,
  },
  vendorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  vendorName: {
    ...Typography.body,
    color: Colors.light.text,
  },
  attachmentsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  attachmentThumb: {
    width: 100,
    borderRadius: BorderRadius.xs,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  attachmentImage: {
    width: 100,
    height: 75,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  attachmentType: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    textAlign: "center",
    paddingVertical: Spacing.xs,
    textTransform: "capitalize",
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: Spacing.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.md,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    ...Typography.bodySmall,
    fontWeight: "600",
    color: Colors.light.text,
  },
  timelineDate: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
  },
  errorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  errorTitle: {
    ...Typography.body,
    fontWeight: "600",
    color: Colors.light.error,
  },
  errorMessage: {
    ...Typography.bodySmall,
    color: Colors.light.error,
  },
  actionContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.light.backgroundRoot,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  actionButton: {
    backgroundColor: Colors.light.primary,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  actionButtonText: {
    ...Typography.button,
    color: "#FFFFFF",
  },
});
