import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { GRNItem, Attachment } from "@/types/grn";
import { getGRNs, initializeGRNData, postGoodsReceipt, getAttachments, saveAttachments } from "@/lib/storage";

interface GRNContextType {
  grns: GRNItem[];
  isLoading: boolean;
  attachments: Record<string, Attachment[]>;
  loadGRNs: () => Promise<void>;
  refreshGRNs: () => Promise<void>;
  submitGR: (id: string, quantity: number, storageLocation: string) => Promise<{ success: boolean; message: string }>;
  getGRNAttachments: (grnId: string) => Attachment[];
  addAttachment: (grnId: string, attachment: Attachment) => Promise<void>;
  removeAttachment: (grnId: string, attachmentId: string) => Promise<void>;
}

const GRNContext = createContext<GRNContextType | undefined>(undefined);

export function GRNProvider({ children }: { children: ReactNode }) {
  const [grns, setGrns] = useState<GRNItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [attachments, setAttachments] = useState<Record<string, Attachment[]>>({});

  const loadGRNs = useCallback(async () => {
    setIsLoading(true);
    try {
      await initializeGRNData();
      const data = await getGRNs();
      setGrns(data);
      const allAttachments = await getAttachments();
      setAttachments(allAttachments);
    } catch (error) {
      console.error("Failed to load GRNs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshGRNs = useCallback(async () => {
    try {
      const data = await getGRNs();
      setGrns(data);
    } catch (error) {
      console.error("Failed to refresh GRNs:", error);
    }
  }, []);

  const submitGR = useCallback(async (id: string, quantity: number, storageLocation: string) => {
    const result = await postGoodsReceipt(id, quantity, storageLocation);
    if (result.success) {
      await refreshGRNs();
    }
    return result;
  }, [refreshGRNs]);

  const getGRNAttachments = useCallback((grnId: string) => {
    return attachments[grnId] || [];
  }, [attachments]);

  const addAttachment = useCallback(async (grnId: string, attachment: Attachment) => {
    const grnAttachments = attachments[grnId] || [];
    const updated = [...grnAttachments, attachment];
    const newAttachments = { ...attachments, [grnId]: updated };
    setAttachments(newAttachments);
    await saveAttachments(grnId, updated);
  }, [attachments]);

  const removeAttachment = useCallback(async (grnId: string, attachmentId: string) => {
    const grnAttachments = attachments[grnId] || [];
    const updated = grnAttachments.filter((a) => a.id !== attachmentId);
    const newAttachments = { ...attachments, [grnId]: updated };
    setAttachments(newAttachments);
    await saveAttachments(grnId, updated);
  }, [attachments]);

  return (
    <GRNContext.Provider
      value={{
        grns,
        isLoading,
        attachments,
        loadGRNs,
        refreshGRNs,
        submitGR,
        getGRNAttachments,
        addAttachment,
        removeAttachment,
      }}
    >
      {children}
    </GRNContext.Provider>
  );
}

export function useGRN() {
  const context = useContext(GRNContext);
  if (context === undefined) {
    throw new Error("useGRN must be used within a GRNProvider");
  }
  return context;
}
