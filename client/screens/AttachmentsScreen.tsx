import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Platform,
  Image,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius, Typography, Shadows } from "@/constants/theme";
import { Attachment } from "@/types/grn";
import { CreateGRStackParamList } from "@/navigation/CreateGRStackNavigator";
import { useGRN } from "@/contexts/GRNContext";
import { useToast } from "@/contexts/ToastContext";

type RouteType = RouteProp<CreateGRStackParamList, "Attachments">;

const ATTACHMENT_TYPES: { id: Attachment["type"]; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { id: "challan", label: "Delivery Challan", icon: "file-text" },
  { id: "goods", label: "Goods Photo", icon: "package" },
  { id: "inspection", label: "Inspection Notes", icon: "clipboard" },
];

export default function AttachmentsScreen() {
  const route = useRoute<RouteType>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const { grnId } = route.params || {};
  const { getGRNAttachments, addAttachment, removeAttachment } = useGRN();
  const { showToast } = useToast();

  const [selectedType, setSelectedType] = useState<Attachment["type"]>("goods");
  
  const attachments = grnId ? getGRNAttachments(grnId) : [];

  const requestCameraPermission = async () => {
    if (Platform.OS === "web") {
      return true;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera permission is needed to take photos"
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    if (!grnId) {
      showToast("Please select a PO first", "error");
      return;
    }
    
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newAttachment: Attachment = {
          id: `att_${Date.now()}`,
          uri: result.assets[0].uri,
          type: selectedType,
          name: `${selectedType}_${Date.now()}.jpg`,
          createdAt: new Date().toISOString(),
        };
        await addAttachment(grnId, newAttachment);
        showToast("Photo added successfully", "success");
      }
    } catch (error) {
      showToast("Failed to take photo", "error");
    }
  };

  const pickImage = async () => {
    if (!grnId) {
      showToast("Please select a PO first", "error");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newAttachment: Attachment = {
          id: `att_${Date.now()}`,
          uri: result.assets[0].uri,
          type: selectedType,
          name: `${selectedType}_${Date.now()}.jpg`,
          createdAt: new Date().toISOString(),
        };
        await addAttachment(grnId, newAttachment);
        showToast("Photo added successfully", "success");
      }
    } catch (error) {
      showToast("Failed to pick image", "error");
    }
  };

  const deleteAttachment = (attachmentId: string) => {
    if (!grnId) return;
    
    Alert.alert(
      "Delete Attachment",
      "Are you sure you want to delete this attachment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await removeAttachment(grnId, attachmentId);
            showToast("Attachment deleted", "info");
          },
        },
      ]
    );
  };

  const showAddOptions = () => {
    if (!grnId) {
      showToast("Please select a PO first before adding attachments", "error");
      return;
    }
    
    Alert.alert(
      "Add Attachment",
      "Choose how to add an attachment",
      [
        { text: "Take Photo", onPress: takePhoto },
        { text: "Choose from Gallery", onPress: pickImage },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const getTypeLabel = (type: Attachment["type"]) => {
    return ATTACHMENT_TYPES.find((t) => t.id === type)?.label || type;
  };

  const renderAttachment = ({ item }: { item: Attachment }) => (
    <Pressable
      style={styles.attachmentCard}
      onLongPress={() => deleteAttachment(item.id)}
    >
      <Image source={{ uri: item.uri }} style={styles.attachmentImage} />
      <View style={styles.attachmentInfo}>
        <View style={styles.attachmentTypeBadge}>
          <ThemedText style={styles.attachmentTypeText}>
            {getTypeLabel(item.type)}
          </ThemedText>
        </View>
        <Pressable
          style={styles.deleteButton}
          onPress={() => deleteAttachment(item.id)}
        >
          <Feather name="trash-2" size={16} color={Colors.light.error} />
        </Pressable>
      </View>
    </Pressable>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Feather name="image" size={64} color={Colors.light.textSecondary} />
      <ThemedText style={styles.emptyTitle}>No Attachments</ThemedText>
      <ThemedText style={styles.emptySubtitle}>
        {grnId 
          ? "Tap the camera button to add photos of delivery challan, goods, or inspection notes"
          : "Please select a PO on the Create GR screen first"}
      </ThemedText>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors.light.backgroundRoot }]}>
      <View style={[styles.typeSelector, { marginTop: headerHeight + Spacing.md }]}>
        {ATTACHMENT_TYPES.map((type) => (
          <Pressable
            key={type.id}
            style={[
              styles.typeButton,
              selectedType === type.id && styles.typeButtonSelected,
            ]}
            onPress={() => setSelectedType(type.id)}
          >
            <Feather
              name={type.icon}
              size={18}
              color={selectedType === type.id ? "#FFFFFF" : Colors.light.textSecondary}
            />
            <ThemedText
              style={[
                styles.typeButtonText,
                selectedType === type.id && styles.typeButtonTextSelected,
              ]}
            >
              {type.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={attachments}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderAttachment}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + 100 },
        ]}
        columnWrapperStyle={attachments.length > 0 ? styles.columnWrapper : undefined}
        ListEmptyComponent={renderEmptyState}
      />

      <Pressable
        style={[
          styles.fab,
          { bottom: tabBarHeight + Spacing.xl },
          Shadows.fab,
        ]}
        onPress={showAddOptions}
      >
        <Feather name="camera" size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  typeSelector: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: Spacing.xs,
  },
  typeButtonSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  typeButtonText: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
  },
  typeButtonTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    flexGrow: 1,
  },
  columnWrapper: {
    gap: Spacing.md,
  },
  attachmentCard: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  attachmentImage: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  attachmentInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.sm,
  },
  attachmentTypeBadge: {
    backgroundColor: Colors.light.primary + "15",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  attachmentTypeText: {
    ...Typography.caption,
    color: Colors.light.primary,
    fontWeight: "500",
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing["3xl"],
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
    textAlign: "center",
    marginTop: Spacing.sm,
  },
  fab: {
    position: "absolute",
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
