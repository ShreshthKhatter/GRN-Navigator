import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Alert,
  Switch,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { user, logout } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: logout,
        },
      ]
    );
  };

  const getRoleBadge = (role: string) => {
    const roleLabels: Record<string, string> = {
      warehouse: "Warehouse Operator",
      operations: "Operations Manager",
    };
    return roleLabels[role] || role;
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: headerHeight + Spacing.lg,
          paddingBottom: tabBarHeight + Spacing.xl,
        },
      ]}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.userCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>
              {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
            </ThemedText>
          </View>
          <View style={styles.statusDot} />
        </View>
        <ThemedText style={styles.userName}>{user?.name}</ThemedText>
        <ThemedText style={styles.userEmail}>{user?.email}</ThemedText>
        <View style={styles.roleBadge}>
          <Feather name="shield" size={14} color={Colors.light.primary} />
          <ThemedText style={styles.roleText}>
            {user?.role ? getRoleBadge(user.role) : ""}
          </ThemedText>
        </View>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={14} color={Colors.light.textSecondary} />
          <ThemedText style={styles.locationText}>{user?.location}</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Notifications</ThemedText>
        <View style={styles.settingCard}>
          <Pressable style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Feather name="bell" size={20} color={Colors.light.primary} />
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingLabel}>Push Notifications</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Get notified about pending GRs and updates
                </ThemedText>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.light.border, true: Colors.light.primary + "60" }}
              thumbColor={notificationsEnabled ? Colors.light.primary : Colors.light.textSecondary}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Sync Settings</ThemedText>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Feather name="wifi-off" size={20} color={Colors.light.warning} />
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingLabel}>Offline Mode</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Cache data for low network areas
                </ThemedText>
              </View>
            </View>
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{ false: Colors.light.border, true: Colors.light.warning + "60" }}
              thumbColor={offlineMode ? Colors.light.warning : Colors.light.textSecondary}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Feather name="refresh-cw" size={20} color={Colors.light.success} />
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingLabel}>Last Sync</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Today at {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </ThemedText>
              </View>
            </View>
            <View style={styles.syncStatus}>
              <View style={styles.syncDot} />
              <ThemedText style={styles.syncText}>Synced</ThemedText>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>About</ThemedText>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Feather name="info" size={20} color={Colors.light.textSecondary} />
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingLabel}>App Version</ThemedText>
                <ThemedText style={styles.settingDescription}>1.0.0</ThemedText>
              </View>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Feather name="server" size={20} color={Colors.light.textSecondary} />
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingLabel}>SAP Connection</ThemedText>
                <ThemedText style={styles.settingDescription}>S/4HANA Cloud - Connected</ThemedText>
              </View>
            </View>
            <View style={[styles.syncDot, { backgroundColor: Colors.light.success }]} />
          </View>
        </View>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={20} color={Colors.light.error} />
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </Pressable>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundRoot,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  userCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.sm,
    padding: Spacing["2xl"],
    alignItems: "center",
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    ...Typography.h1,
    color: "#FFFFFF",
  },
  statusDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.success,
    borderWidth: 3,
    borderColor: Colors.light.cardBackground,
  },
  userName: {
    ...Typography.h2,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary + "15",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  roleText: {
    ...Typography.bodySmall,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  locationText: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  settingCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: Spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    ...Typography.body,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginHorizontal: Spacing.lg,
  },
  syncStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.success,
  },
  syncText: {
    ...Typography.caption,
    color: Colors.light.success,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.error + "10",
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.error + "30",
  },
  logoutText: {
    ...Typography.button,
    color: Colors.light.error,
  },
});
