export type GRNStatus = "pending" | "completed" | "error" | "in_progress";

export interface GRNItem {
  id: string;
  poNumber: string;
  poLineItem: string;
  vendorName: string;
  materialDescription: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unit: string;
  storageLocation: string;
  status: GRNStatus;
  invoiceNumber: string;
  invoiceDate: string;
  vertical: string;
  account: string;
  geography: string;
  createdAt: string;
  updatedAt: string;
  errorMessage?: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  uri: string;
  type: "challan" | "goods" | "inspection";
  name: string;
  createdAt: string;
}

export interface GRSubmission {
  poNumber: string;
  poLineItem: string;
  grQuantity: number;
  storageLocation: string;
  comments?: string;
  attachments?: Attachment[];
}

export interface FilterState {
  search: string;
  status: GRNStatus | "all";
  dateRange: "today" | "week" | "month" | "all";
  vertical: string;
  geography: string;
}
