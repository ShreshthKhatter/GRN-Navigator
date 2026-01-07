import AsyncStorage from "@react-native-async-storage/async-storage";
import { GRNItem, Attachment } from "@/types/grn";
import { MOCK_GRNS } from "@/lib/mockData";

const GRN_STORAGE_KEY = "@mobile_grn_data";
const ATTACHMENTS_KEY = "@mobile_grn_attachments";

export async function initializeGRNData(): Promise<GRNItem[]> {
  try {
    const stored = await AsyncStorage.getItem(GRN_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    await AsyncStorage.setItem(GRN_STORAGE_KEY, JSON.stringify(MOCK_GRNS));
    return MOCK_GRNS;
  } catch (error) {
    console.error("Failed to initialize GRN data:", error);
    return MOCK_GRNS;
  }
}

export async function getGRNs(): Promise<GRNItem[]> {
  try {
    const stored = await AsyncStorage.getItem(GRN_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return await initializeGRNData();
  } catch (error) {
    console.error("Failed to get GRNs:", error);
    return [];
  }
}

export async function getGRNById(id: string): Promise<GRNItem | null> {
  try {
    const grns = await getGRNs();
    return grns.find((grn) => grn.id === id) || null;
  } catch (error) {
    console.error("Failed to get GRN by id:", error);
    return null;
  }
}

export async function updateGRN(id: string, updates: Partial<GRNItem>): Promise<GRNItem | null> {
  try {
    const grns = await getGRNs();
    const index = grns.findIndex((grn) => grn.id === id);
    if (index === -1) return null;
    
    grns[index] = {
      ...grns[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem(GRN_STORAGE_KEY, JSON.stringify(grns));
    return grns[index];
  } catch (error) {
    console.error("Failed to update GRN:", error);
    return null;
  }
}

export async function postGoodsReceipt(
  id: string,
  quantity: number,
  storageLocation: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  try {
    const grn = await getGRNById(id);
    if (!grn) {
      return { success: false, message: "GRN not found" };
    }
    
    if (grn.status === "error") {
      return { success: false, message: grn.errorMessage || "PO is blocked" };
    }
    
    if (quantity > grn.orderedQuantity) {
      return { success: false, message: "Quantity exceeds ordered amount" };
    }
    
    if (quantity <= 0) {
      return { success: false, message: "Quantity must be greater than zero" };
    }
    
    await updateGRN(id, {
      receivedQuantity: quantity,
      storageLocation: storageLocation,
      status: "completed",
    });
    
    return { success: true, message: "GR posted successfully to SAP S/4HANA" };
  } catch (error) {
    return { success: false, message: "Failed to post GR to SAP" };
  }
}

export async function saveAttachments(grnId: string, attachments: Attachment[]): Promise<boolean> {
  try {
    const allAttachments = await getAttachments();
    allAttachments[grnId] = attachments;
    await AsyncStorage.setItem(ATTACHMENTS_KEY, JSON.stringify(allAttachments));
    return true;
  } catch (error) {
    console.error("Failed to save attachments:", error);
    return false;
  }
}

export async function getAttachments(): Promise<Record<string, Attachment[]>> {
  try {
    const stored = await AsyncStorage.getItem(ATTACHMENTS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Failed to get attachments:", error);
    return {};
  }
}

export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([GRN_STORAGE_KEY, ATTACHMENTS_KEY]);
  } catch (error) {
    console.error("Failed to clear data:", error);
  }
}
