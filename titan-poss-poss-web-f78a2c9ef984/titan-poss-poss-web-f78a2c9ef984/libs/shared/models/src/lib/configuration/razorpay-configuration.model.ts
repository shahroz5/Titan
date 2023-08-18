export interface RazorpayUploadResponse {
  fileId: string;
  hasError: boolean;
  message: string;
  records: RazorpayUploadCount;
}

export interface RazorpayUploadCount {
  errorLogId: string;
  failureCount: number;
  successCount: number;
  totalCount: number;
}
export interface RazorpaySortItem {
  colId: string;
  sort: string;
}

export interface RazorpayAccessList {
  id: string;
  locationCode: string;
  hostName: string;
  newlyAdded: boolean;
  deviceId: string;
  paymentCode: string;
  isActive: boolean;
}

export interface RazorpayStatus {
  checked: boolean;
  text: string;
}

export interface RazorpayConfigurationList {
  accessList: RazorpayAccessList[];
  count: number;
}

export interface RazorpayConfigListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface RazorpayPaymentHosts {
  deviceId: string;
  id: string;
  isActive: RazorpayStatus;
}

export interface RazorpayUpdatedAccessList {
  paymentHostnamesDetails: RazorpayPaymentHosts[];
}
