export interface GLLocationPaymentList {
  id?: any;
  glCode: number;
  locationCode: string;
  paymentCode: string;
  lastModified: boolean;
}
export interface GLLocationPaymentListPayload {
  pageIndex?: number;
  pageSize?: number;
}

export interface GLLocationPaymentSuccessList {
  glLocationPaymentList: GLLocationPaymentList[];
  count: number;
}

export interface PaymentCodes {
  value: string;
  description: string;
}

export interface SaveGlLocationPayments {
  locationCode?: string;
  addLocations: string[];
  addPaymentCodes: string[];
  removeLocations: string[];
  removePaymentCodes: string[];
  updatePaymentCodes?: string[];
}
export interface LocationCodeDetails {
  locationCode: string;
  description: string;
}
