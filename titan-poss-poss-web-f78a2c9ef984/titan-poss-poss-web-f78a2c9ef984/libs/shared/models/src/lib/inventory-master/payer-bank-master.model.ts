import { PageEvent } from '@angular/material/paginator';

export interface PayerBankDetails {
  bankName: string;
  isActive: boolean;
}
export interface PayerBanksPayload {
  pageIndex: number;
  pageSize: number;
}
export interface PayerBankMasterResponse {
  payerBanks: PayerBankDetails[];
  totalElements: number;
}
export interface FileResponse {
  totalCount: number;
  records?: any;
  successCount: number;
  failureCount: number;
  errorLogId?: any;
  hasError: boolean;
  message?: string;
  errors?: any;
  uploadType?: string;
}
export interface LoadCardDetailsPayload {
  id: string;
  pageEvent: PageEvent;
}
