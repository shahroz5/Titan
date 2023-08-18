export interface FOCBlockingLocationLevel {
  locationCode: string;
  description?: string;
  fromDate: string;
  toDate: string;
  approvedBy: string;
  isCMMandatory: boolean;
  remarks: string;
  isActive: boolean;
  id: string;
}

export interface FOCBlockingLocationLevelSavePayload {
  id: string;
  savePayload: any;
}
export interface FOCBlockingLocationLevelListPayload {
  pageIndex: number;
  pageSize: number;
  id: string;
}
export interface FOCBlockingLocaionLevelListResponse {
  response: FOCBlockingLocationLevel[];
  totalElements: number;
}
