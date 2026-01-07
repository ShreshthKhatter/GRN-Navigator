import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import { GRNItem } from "@/types/grn";
import { STORAGE_LOCATIONS } from "@/lib/mockData";
import { CreateGRStackParamList } from "@/navigation/CreateGRStackNavigator";
import { useGRN } from "@/contexts/GRNContext";
import { useToast } from "@/contexts/ToastContext";

type NavigationProp = NativeStackNavigationProp<CreateGRStackParamList>;

export default function CreateGRScreen() {
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const { grns, submitGR, getGRNAttachments } = useGRN();
  const { showToast } = useToast();

  const [poNumber, setPoNumber] = useState("");
  const [selectedGRN, setSelectedGRN] = useState<GRNItem | null>(null);
  const [grQuantity, setGrQuantity] = useState("");
  const [storageLocation, setStorageLocation] = useState("");
  const [comments, setComments] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<GRNItem[]>([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const searchPO = (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    
    const results = grns.filter(
      (grn) =>
        grn.poNumber.includes(query) &&
        grn.status === "pending"
    );
    setSearchResults(results);
  };

  const handlePOChange = (text: string) => {
    setPoNumber(text);
    setSelectedGRN(null);
    setErrors({ ...errors, poNumber: "" });
    searchPO(text);
  };

  const selectPO = (grn: GRNItem) => {
    setSelectedGRN(grn);
    setPoNumber(grn.poNumber);
    setSearchResults([]);
    setStorageLocation(grn.storageLocation);
  };

  const selectLocation = (locationId: string) => {
    setStorageLocation(locationId);
    setShowLocationPicker(false);
    setErrors({ ...errors, storageLocation: "" });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedGRN) {
      newErrors.poNumber = "Please select a valid PO";
    }

    const qty = parseInt(grQuantity, 10);
    if (!grQuantity || isNaN(qty)) {
      newErrors.grQuantity = "Please enter a valid quantity";
    } else if (qty <= 0) {
      newErrors.grQuantity = "Quantity must be greater than 0";
    } else if (selectedGRN && qty > selectedGRN.orderedQuantity) {
      newErrors.grQuantity = `Quantity cannot exceed ${selectedGRN.orderedQuantity}`;
    }

    if (!storageLocation) {
      newErrors.storageLocation = "Please select a storage location";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !selectedGRN) return;

    const attachments = getGRNAttachments(selectedGRN.id);
    
    Alert.alert(
      "Confirm Goods Receipt",
      `Post GR for PO ${selectedGRN.poNumber}?\n\nQuantity: ${grQuantity} ${selectedGRN.unit}\nLocation: ${storageLocation}\nAttachments: ${attachments.length}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            setIsLoading(true);
            try {
              const result = await submitGR(
                selectedGRN.id,
                parseInt(grQuantity, 10),
                storageLocation
              );

              if (result.success) {
                showToast(result.message, "success");
                setPoNumber("");
                setSelectedGRN(null);
                setGrQuantity("");
                setStorageLocation("");
                setComments("");
              } else {
                showToast(result.message, "error");
              }
            } catch (error) {
              showToast("Failed to post GR. Please try again.", "error");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const selectedLocationName = STORAGE_LOCATIONS.find(
    (loc) => loc.id === storageLocation
  )?.name;

  const attachmentCount = selectedGRN ? getGRNAttachments(selectedGRN.id).length : 0;

  return (
    <View style={[styles.container, { backgroundColor: Colors.light.backgroundRoot }]}>
      <KeyboardAwareScrollViewCompat
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: tabBarHeight + Spacing["3xl"],
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
      >
        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>PO Information</ThemedText>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>PO Number *</ThemedText>
            <View
              style={[
                styles.inputContainer,
                errors.poNumber ? styles.inputError : null,
              ]}
            >
              <Feather name="file-text" size={18} color={Colors.light.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter PO number to search"
                placeholderTextColor={Colors.light.textSecondary}
                value={poNumber}
                onChangeText={handlePOChange}
                keyboardType="number-pad"
              />
              <Feather name="search" size={18} color={Colors.light.textSecondary} />
            </View>
            {errors.poNumber ? (
              <ThemedText style={styles.errorText}>{errors.poNumber}</ThemedText>
            ) : null}

            {searchResults.length > 0 ? (
              <View style={styles.searchResults}>
                {searchResults.map((grn) => (
                  <Pressable
                    key={grn.id}
                    style={styles.searchResultItem}
                    onPress={() => selectPO(grn)}
                  >
                    <View>
                      <ThemedText style={styles.searchResultPO}>
                        PO: {grn.poNumber} - Line {grn.poLineItem}
                      </ThemedText>
                      <ThemedText style={styles.searchResultDesc} numberOfLines={1}>
                        {grn.materialDescription}
                      </ThemedText>
                    </View>
                    <Feather name="chevron-right" size={18} color={Colors.light.textSecondary} />
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>

          {selectedGRN ? (
            <View style={styles.selectedPOInfo}>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Line Item</ThemedText>
                <ThemedText style={styles.infoValue}>{selectedGRN.poLineItem}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Material</ThemedText>
                <ThemedText style={styles.infoValue} numberOfLines={2}>
                  {selectedGRN.materialDescription}
                </ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Vendor</ThemedText>
                <ThemedText style={styles.infoValue}>{selectedGRN.vendorName}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Ordered Qty</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {selectedGRN.orderedQuantity} {selectedGRN.unit}
                </ThemedText>
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Receipt Details</ThemedText>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>GR Quantity *</ThemedText>
            <View
              style={[
                styles.inputContainer,
                errors.grQuantity ? styles.inputError : null,
              ]}
            >
              <Feather name="package" size={18} color={Colors.light.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter quantity received"
                placeholderTextColor={Colors.light.textSecondary}
                value={grQuantity}
                onChangeText={(text) => {
                  setGrQuantity(text);
                  setErrors({ ...errors, grQuantity: "" });
                }}
                keyboardType="number-pad"
              />
              {selectedGRN ? (
                <ThemedText style={styles.unitText}>{selectedGRN.unit}</ThemedText>
              ) : null}
            </View>
            {errors.grQuantity ? (
              <ThemedText style={styles.errorText}>{errors.grQuantity}</ThemedText>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Storage Location *</ThemedText>
            <Pressable
              style={[
                styles.inputContainer,
                errors.storageLocation ? styles.inputError : null,
              ]}
              onPress={() => setShowLocationPicker(true)}
            >
              <Feather name="map-pin" size={18} color={Colors.light.textSecondary} />
              <ThemedText
                style={[
                  styles.pickerText,
                  !storageLocation && styles.placeholderText,
                ]}
              >
                {selectedLocationName || "Select storage location"}
              </ThemedText>
              <Feather name="chevron-down" size={18} color={Colors.light.textSecondary} />
            </Pressable>
            {errors.storageLocation ? (
              <ThemedText style={styles.errorText}>{errors.storageLocation}</ThemedText>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Comments (Optional)</ThemedText>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add any notes or comments"
                placeholderTextColor={Colors.light.textSecondary}
                value={comments}
                onChangeText={setComments}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Pressable
            style={styles.attachmentButton}
            onPress={() => navigation.navigate("Attachments", { grnId: selectedGRN?.id })}
          >
            <Feather name="camera" size={20} color={Colors.light.primary} />
            <ThemedText style={styles.attachmentButtonText}>
              Add Attachments
            </ThemedText>
            <View style={styles.attachmentBadge}>
              <ThemedText style={styles.attachmentBadgeText}>{attachmentCount}</ThemedText>
            </View>
            <Feather name="chevron-right" size={18} color={Colors.light.textSecondary} />
          </Pressable>
        </View>
      </KeyboardAwareScrollViewCompat>

      <View
        style={[
          styles.submitContainer,
          { paddingBottom: tabBarHeight + Spacing.lg },
        ]}
      >
        <Pressable
          style={[
            styles.submitButton,
            (!selectedGRN || isLoading) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!selectedGRN || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Feather name="check-circle" size={20} color="#FFFFFF" />
              <ThemedText style={styles.submitButtonText}>Post Goods Receipt</ThemedText>
            </>
          )}
        </Pressable>
      </View>

      <Modal
        visible={showLocationPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLocationPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + Spacing.lg }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Select Storage Location</ThemedText>
              <Pressable onPress={() => setShowLocationPicker(false)}>
                <Feather name="x" size={24} color={Colors.light.text} />
              </Pressable>
            </View>
            <FlatList
              data={STORAGE_LOCATIONS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.locationItem,
                    storageLocation === item.id && styles.locationItemSelected,
                  ]}
                  onPress={() => selectLocation(item.id)}
                >
                  <View>
                    <ThemedText style={styles.locationId}>{item.id}</ThemedText>
                    <ThemedText style={styles.locationName}>{item.name}</ThemedText>
                  </View>
                  {storageLocation === item.id ? (
                    <Feather name="check" size={20} color={Colors.light.primary} />
                  ) : null}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.light.text,
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.inputBackground,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.md,
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: Spacing.sm,
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  input: {
    flex: 1,
    ...Typography.input,
    color: Colors.light.text,
  },
  textAreaContainer: {
    height: 100,
    alignItems: "flex-start",
    paddingVertical: Spacing.sm,
  },
  textArea: {
    height: "100%",
  },
  unitText: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
  },
  pickerText: {
    flex: 1,
    ...Typography.input,
    color: Colors.light.text,
  },
  placeholderText: {
    color: Colors.light.textSecondary,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.light.error,
    marginTop: Spacing.xs,
  },
  searchResults: {
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: "hidden",
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  searchResultPO: {
    ...Typography.bodySmall,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  searchResultDesc: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
  },
  selectedPOInfo: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: BorderRadius.xs,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: Spacing.sm,
  },
  infoLabel: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    width: 80,
  },
  infoValue: {
    ...Typography.bodySmall,
    color: Colors.light.text,
    flex: 1,
  },
  attachmentButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  attachmentButtonText: {
    ...Typography.body,
    color: Colors.light.primary,
    flex: 1,
  },
  attachmentBadge: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    minWidth: 24,
    alignItems: "center",
  },
  attachmentBadgeText: {
    ...Typography.caption,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  submitContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.light.backgroundRoot,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    ...Typography.button,
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.light.backgroundDefault,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    ...Typography.h3,
    color: Colors.light.text,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  locationItemSelected: {
    backgroundColor: Colors.light.primary + "10",
  },
  locationId: {
    ...Typography.bodySmall,
    fontWeight: "600",
    color: Colors.light.text,
  },
  locationName: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
  },
});
