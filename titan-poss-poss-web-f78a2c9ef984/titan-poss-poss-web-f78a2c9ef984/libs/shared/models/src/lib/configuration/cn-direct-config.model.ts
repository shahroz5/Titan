export interface CnList {
  amount: number;
  cnType: string;
  customerName: string;
  cnDate: any;
  cnNo: number;
  fiscalYear: number;
  id: string;
  linkedWith: string;
  locationCode: string;
  cnStatus: string;
  frozenRateDetails: any;
  workflowStatus: any;
}

export interface CnListRes {
  cnList: CnList[];
  totalElements: number;
}

export interface SearchPayloadReq {
  locationCode?: string;
  fiscalYear?: string;
  cnNumber?: number;
  pageEvent?: {
    page: number;
    size: number;
  };
}

export interface UploadCNPayloadReq {
  file?: FormData;
  pageEvent?: {
    page: number;
    size: number;
  };
}

export interface SaveCnActionPayload {
  cnIds: string[];
  operation: string;
}
export enum CNDirectSearchEnum {
  ACTIVATE = 'ACTIVATE',
  SUSPEND = 'SUSPEND',
  ACTIVATE_TRANSFERRED_CN = 'ACTIVATE_TRANSFERRED_CNS',
  TRANSFER = 'TRANSFER',
  REMOVE_GOLD_RATE = 'REMOVE_GOLD_RATE',
  OPEN = 'OPEN',
  SUSPENDED = 'SUSPENDED'
}
