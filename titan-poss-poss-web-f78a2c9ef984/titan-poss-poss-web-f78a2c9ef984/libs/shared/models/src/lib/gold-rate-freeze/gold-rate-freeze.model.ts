import { Moment } from 'moment';

export interface InitiateGrfResponse {
  docNo: number;
  id: string;
  status: string;
  subTxnType: string;
  txnType: string;
  manualBillDetails?: {
    manualBillDetails: {
      manualBillDate: number;
      manualBillNo: string;
      manualBillValue: number;
      remarks: string;
      password: string;
      approvedBy: string;
      metalRates: {
        J: {
          metalTypeCode: string;
          totalMetalWeight: number;
          ratePerUnit: number;
        };
      };
      isFrozenRate: boolean;
      frozenRateDate: any;
      processId: any;
      requestStatus: any;
      requestNo: number;
      requestedDate: any;
      requestType: any;
    };
    validationType: string;
  };
}

export interface ViewGrfTransactionDetailsResponse {
  customerId: number;
  docDate: string;
  docNo: number;
  employeeCode: string;
  finalValue: number;
  fiscalYear: number;
  frozenRateDetails: {};
  id: string;
  remarks: string;
  status: string;
  txnTime: string;
}

export interface UpdateGrfRequestPayload {
  customerId: number;
  paidValue: number;
  metalRateList: {
    metalRates: {
      J: {
        metalTypeCode: string;
        purity: number;
        ratePerUnit: number;
        currency: string;
        applicableDate: number;
      };
    };
  };
  remarks: string;
  weightAgreed?: number;
  metalRate?: number;
}

export interface UpdateGrfTransactionResponse {
  cndocNos: number[];
  docNo: number;
  id: string;
}

export interface PartialUpdateGrfRequestPayload {
  customerId?: number;
  employeeCode?: string;
  metalType?: string;
  totalValue?: number;
}

export interface FrozenCNs {
  docNo: string;
  fiscalYear: string;
  cnDocNo: string;
  cnFiscalYear: string;
}

export interface CreditNote {
  amount: number;
  creditNoteType: string;
  customerId: number;
  customerName: string;
  docDate: Moment;
  docNo: number;
  fiscalYear: number;
  ratePerUnit: number;
  weight: number;
  id: string;
  linkedTxnId: string;
  linkedTxnType: string;
  locationCode: string;
  mobileNumber: string;
  status: string;
  utilisedAmount: number;
  workflowStatus: string;
  cashCollected: number;
}

export interface MergeCNPayload {
  //consentFormUploadURL: string;
  customerId: string;
  employeeCode: string;
  ids: string[];
  //photoIDUploadURL: string;
  remarks: string;
  tempFileIds: any;
}

export interface MergeCNResponse {
  amount: number;
  cnDocNo: number;
  docNo: number;
  id: string;
}
