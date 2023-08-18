export interface FOCBCLListingPayload {
  pageIndex: number;
  pageSize: number;
  schemeId: string;
}
export interface FOCBlockingCustomerLevelListResponse {
  response: FOCBlockingCustomerLevel[];
  totalElements: number;
}
export interface FOCBlockingCustomerLevel {
  locationCode: string;
  description?: string;
  fromDate: string;
  toDate: string;
  approvedBy: string;
  isCMMandatory: boolean;
  remarks: string;
  isActive: boolean;
  mobileNumber: string;
  focItemCode: string;
  quantity: string;
  id: string;
}
