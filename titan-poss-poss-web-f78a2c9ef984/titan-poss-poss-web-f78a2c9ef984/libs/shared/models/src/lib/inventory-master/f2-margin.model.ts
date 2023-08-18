export interface F2MarginList {
  id: string;
  cfa: string;
  stoneBandFrom: number;
  stoneBandTo: number;
  f1From: number;
  f1To: number;
  margin: number;
}

export interface F2MarginListPayload {
  pageIndex?: number;
  pageSize?: number;
  cfaCode?: string;
}

export interface F2MarginListResponse {
  f2MarginList: F2MarginList[];
  totalElements: number;
}
