import { Moment } from "moment";

export interface EmployeeLoanFileUploadResponse {
  fileId: string;
  hasError: boolean;
  message: string;
  records: EmployeeLoanFileUploadCount;
}

export interface EmployeeLoanFileUploadCount {
  errorLogId: string;
  failureCount: number;
  successCount: number;
  totalCount: number;
}

export interface EmployeeLoanConfigList {
  id: string;
  empName?: string;
  empCode?: string;
  customerId?: string;
  empMobileNum?: string;
  eligibleAmount?: number;
  approvalDate?: Moment;
  validityDate?: Moment;
  applicableCFACodes?: string;
  applicableLocationCodes?: string;
  marginPercentage?: number;
  validationOTP?: number;
  partialRedeemableAmt?: number;
}

export interface EmployeeLoanSuccessList {
  configList: EmployeeLoanConfigList[];
  count: number;
}

export interface EmployeeLoanStatus {
  checked: boolean;
  text: string;
}

export interface EmpLoanConfigListPayload {
  pageIndex: number;
  pageSize: number;
}

export interface EmpHostNames {
  id: string;
  isActive: EmployeeLoanStatus;
}
