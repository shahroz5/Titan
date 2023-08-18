export interface HostFileUploadResponse {
  fileId: string;
  hasError: boolean;
  message: string;
  records: FileUploadCount;
}

export interface FileUploadCount {
  errorLogId: string;
  failureCount: number;
  successCount: number;
  totalCount: number;
}

export interface HostNameList {
  id: string;
  locationCode: string;
  hostName: string;
  paymentCode: string;
  isActive: boolean;
  newlyAdded: boolean;
}

export interface AirpayHostSuccessList {
  hostList: HostNameList[];
  count: number;
}

export interface AirpayHostStatus {
  checked: boolean;
  text: string;
}

export interface ListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface HostNames {
  id: string;
  isActive: AirpayHostStatus;
}
export interface UpdatedHostList {
  paymentHostnamesDetails: HostNames[];
}
