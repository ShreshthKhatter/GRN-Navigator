import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import GRNCard from "@/components/GRNCard";
import FilterChip from "@/components/FilterChip";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import { GRNItem, GRNStatus } from "@/types/grn";
import { useGRN } from "@/contexts/GRNContext";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const STATUS_FILTERS: { label: string; value: GRNStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Error", value: "error" },
];

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  
  const { grns, isLoading, loadGRNs, refreshGRNs } = useGRN();

  const [filteredGrns, setFilteredGrns] = useState<GRNItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<GRNStatus | "all">("all");

  useFocusEffect(
    React.useCallback(() => {
      loadGRNs();
    }, [loadGRNs])
  );

  useEffect(() => {
    let filtered = grns;

    if (statusFilter !== "all") {
      filtered = filtered.filter((grn) => grn.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (grn) =>
          grn.poNumber.toLowerCase().includes(query) ||
          grn.invoiceNumber.toLowerCase().includes(query) ||
          grn.vendorName.toLowerCase().includes(query) ||
          grn.materialDescription.toLowerCase().includes(query)
      );
    }

    setFilteredGrns(filtered);
  }, [grns, statusFilter, searchQuery]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshGRNs();
    setIsRefreshing(false);
  };

  const handleGRNPress = (grn: GRNItem) => {
    navigation.navigate("GRNDetail", { grnId: grn.id });
  };

  const pendingCount = grns.filter((g) => g.status === "pending").length;
  const errorCount = grns.filter((g) => g.status === "error").length;
  const completedCount = grns.filter((g) => g.status === "completed").length;

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Feather name="inbox" size={64} color={Colors.light.textSecondary} />
      <ThemedText style={styles.emptyTitle}>No GRNs Found</ThemedText>
      <ThemedText style={styles.emptySubtitle}>
        {searchQuery || statusFilter !== "all"
          ? "Try adjusting your filters"
          : "All goods receipts are up to date"}
      </ThemedText>
    </View>
  );

  if (isLoading && grns.length === 0) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: headerHeight }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <ThemedText style={styles.loadingText}>Loading GRNs...</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.light.backgroundRoot }]}>
      <FlatList
        data={filteredGrns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GRNCard item={item} onPress={() => handleGRNPress(item)} />
        )}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: headerHeight + Spacing.md,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.light.primary}
            progressViewOffset={headerHeight}
          />
        }
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: Colors.light.warning + "20" }]}>
                <Feather name="clock" size={20} color={Colors.light.warning} />
                <ThemedText style={styles.statNumber}>{pendingCount}</ThemedText>
                <ThemedText style={styles.statLabel}>Pending</ThemedText>
              </View>
              <View style={[styles.statCard, { backgroundColor: Colors.light.error + "20" }]}>
                <Feather name="alert-circle" size={20} color={Colors.light.error} />
                <ThemedText style={styles.statNumber}>{errorCount}</ThemedText>
                <ThemedText style={styles.statLabel}>Errors</ThemedText>
              </View>
              <View style={[styles.statCard, { backgroundColor: Colors.light.success + "20" }]}>
                <Feather name="check-circle" size={20} color={Colors.light.success} />
                <ThemedText style={styles.statNumber}>{completedCount}</ThemedText>
                <ThemedText style={styles.statLabel}>Completed</ThemedText>
              </View>
            </View>

            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color={Colors.light.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search PO, invoice, vendor..."
                placeholderTextColor={Colors.light.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery ? (
                <Pressable onPress={() => setSearchQuery("")}>
                  <Feather name="x" size={18} color={Colors.light.textSecondary} />
                </Pressable>
              ) : null}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtersScroll}
              contentContainerStyle={styles.filtersContent}
            >
              {STATUS_FILTERS.map((filter) => (
                <FilterChip
                  key={filter.value}
                  label={filter.label}
                  selected={statusFilter === filter.value}
                  onPress={() => setStatusFilter(filter.value)}
                />
              ))}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundRoot,
  },
  loadingText: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    marginTop: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    flexGrow: 1,
  },
  headerContainer: {
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.light.text,
    marginTop: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.inputBackground,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.md,
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.light.text,
  },
  filtersScroll: {
    flexGrow: 0,
  },
  filtersContent: {
    paddingRight: Spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing["5xl"],
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.light.text,
    marginTop: Spacing.lg,
  },
  emptySubtitle: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    marginTop: Spacing.sm,
    textAlign: "center",
  },
});
