export interface BankDepositDetails {
  collectionDate: string;
  paymentCode: string;
  locationCode: string;
  payerBankName: string;
  payeeBankName: string[];
  instrumentDate: string;
  depositDate: string;
  businessDate: string;
  instrumentNo: number;
  amount: number;
  openingBalance: number;
  depositAmount: number;
  pifNo: number;
  midCode: number;
  depositDetails: any;
  isGhsIncluded: boolean;
  depositSlipNo: number;
  password: string;
  approvalDetails: any;
  isBankingCompleted: boolean;
  id: string;
  depositedSlipDate?: string;
  totalDepositAmount?: string;
  actualDepositAmount?: number;
  isSelected: boolean;
}

export interface BoutiqueBankDepositResponse {
  results?: BankDepositDetails[];
  totalElements: number;
}

export interface CashDetails {
  paymentCode: string;
  openingBalance: number;
  amount: number;
  depositAmount: number;
  payeeBankName: string[];
  businessDate: string;
  collectionDate: string;
  depositDate: string;
  id: string;
  depositDetails: any;
}

export interface CashDenomition {
  bankDepositIds: string[];
  denominationDetails: {
    data: {};
    type: 'string';
  };
}

export interface BankDetailsReqPayload {
  pageIndex: number;
  pageSize: number;
  paymentMode: string[];
  selectedRowId: string[];
  sort?: string[];
}

export interface PendingDatesPayload {
  isGHSMandatory: string;
  isServiceMandatory: string;
}

export interface PendingDatesResponse {
  ghsPendingUploadDates: string[];
  servicePendingUploadDates: string[];
}

export interface PifNoPayload {
  pifNo: string[];
}

export interface PifNoResponse {
  depositAmount: number;
  denominationDetails?: any;
  transactionIds: string[];
}
