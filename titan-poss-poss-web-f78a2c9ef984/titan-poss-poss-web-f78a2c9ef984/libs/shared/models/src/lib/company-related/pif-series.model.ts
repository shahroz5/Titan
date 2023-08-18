export interface PIFSeries {
  id: string;
  bankName: string;
  paymentCode: string;
  fromNo: number;
  toNo: number;
  currentSeqNo: number;
  isHomeBank: boolean;
  isActive: boolean;
  rowIndex?: number;
}
export interface PIFSeriesResponse {
  pifSeries: PIFSeries[];
  totalElements: number;
}
export interface PIFSeriesPayload {
  pageIndex: number;
  pageSize: number;
}
export interface SavePIFSeriesPayload {
  fromNo: number;
  id: string;
  toNo: number;
}
