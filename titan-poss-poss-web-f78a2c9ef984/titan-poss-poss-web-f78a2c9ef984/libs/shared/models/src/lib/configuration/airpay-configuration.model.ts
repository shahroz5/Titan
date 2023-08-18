export interface AirpayVendorList {
  newlyAdded: boolean;
  locationCode: string;
  MerchantId: string;
  Username: string;
  Password: string;
  SecretKey: string;
  SecretToken: string;
}

export interface FileUploadResponse {
  fileId: string;
  hasError: boolean;
  message: string;
  records: VendorUploadCount;
}
export interface VendorUploadCount {
  errorLogId: string;
  failureCount: number;
  successCount: number;
  totalCount: number;
}
export interface AirpayVendorSuccessList {
  vendorList: AirpayVendorList[];
  count: number;
}

export interface ListPayload {
  pageIndex: number;
  pageSize: number;
}
