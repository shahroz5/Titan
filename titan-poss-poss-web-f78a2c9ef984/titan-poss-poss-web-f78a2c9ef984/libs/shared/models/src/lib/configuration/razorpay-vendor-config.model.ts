export interface RazporVendorList {
  newlyAdded: boolean;
  locationCode: string;
  accountId: string;
}

export interface RazorpayVendorFileUploadResponse {
  fileId: string;
  hasError: boolean;
  message: string;
  records: RazorpayVendorVendorUploadCount;
}
export interface RazorpayVendorVendorUploadCount {
  errorLogId: string;
  failureCount: number;
  successCount: number;
  totalCount: number;
}
export interface RazorpayVendorSuccessList {
  vendorList: RazporVendorList[];
  count: number;
}

export interface RazorpayVendorListPayload {
  pageIndex: number;
  pageSize: number;
}
