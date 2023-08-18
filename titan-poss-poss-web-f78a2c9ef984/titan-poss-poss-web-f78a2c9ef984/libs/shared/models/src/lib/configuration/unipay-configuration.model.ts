
export interface UploadResponse {
  fileId: string;
  hasError: boolean;
  message: string;
  records: UploadCount;
}

export interface UploadCount {
  errorLogId:string
  failureCount: number;
  successCount: number;
  totalCount: number;
}
export interface SortItem {
  colId: string;
  sort: string;
}

export interface AccessList {
  id: string;
  locationCode: string;
  hostName: string;
  newlyAdded: boolean;
  deviceId: string;
  paymentCode: string;
  isActive: boolean;
}

export interface Status {
  checked: boolean;
  text: string;
}

export interface UnipayConfigurationList {
  accessList: AccessList[];
  count: number;
}

export interface ConfigListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface PaymentHosts {
  deviceId: string;
  id: string;
  isActive: Status;
}

export interface UpdatedAccessList {
  paymentHostnamesDetails: PaymentHosts[];
}
