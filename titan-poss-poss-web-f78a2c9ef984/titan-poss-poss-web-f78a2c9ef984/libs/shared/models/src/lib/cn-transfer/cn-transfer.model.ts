import { Moment } from 'moment';
import { cnTransferTabEnum } from '@poss-web/shared/models';
export interface CnTransferSearchPayload {
  docNo?: number;
  fiscalYear?: string;
  mobileNo?: string;
  page?: number;
  size?: number;
  sort?: [];
  srcBtqCode: string;
}
export interface CnTransferSearchResult {
  amount: number;
  creditNoteType: string;
  customerName: string;
  docDate: Moment;
  docNo: number;
  fiscalYear: number;
  id: string;
  linkedTxnId: string;
  linkedTxnType: string;
  locationCode: string;
  mobileNumber: string;
  status: string;
  isPaymentForEGHS?: boolean;
}
export interface CnTransferSearchResponsePayload {
  result: CnTransferSearchResult[];
  totalCount: number;
}
export interface LoadSearchedCnDetailsReqPayload {
  id: string;
  srcBtqCode: string;
}

export interface LoadSelectedCnDetailsReqPayload {
  tab: cnTransferTabEnum;
  id?: string;
  srcBtqCode?: string;
  taskId?: string;
  taskName?: string;
  workflowType?: string;
}


export interface RequestTransferPayload {
  id: string;
  remarksDto: {
    approverLocationCode: string;
    remarks: string;
    tempFileIds?: any;
  };
}

export interface LegacyCNTransferPayload {
  id: string;
  locationCode: string;
}

export interface LegacyOutwardTransferResponsePayload {
  errorMessage: string;
  status:       boolean;
}
export interface LegacyInwardTransferResponsePayload {
  docNo: number;
}
export interface LoadCnTransferRequestsPayload {
  tab: cnTransferTabEnum;
  approvalStatus?: string;
  page?: number;
  size?: number;
  sort?: any[];
  workflowType?: string;
  payload?: {
    dateRangeType?: string;
    docNo?: number;
    fiscalYear?: number;
    startDate?: string;
    endDate?: string;
    filterParams?: any;
  };
}

export interface SendRequestResponsePayload {
  results: CNDetailsInfo[];
  count: number;
}

export interface CNDetailsInfo {
  approvalLevel?: number;
  approvalStatus?: string;
  approvedBy?: string;
  approvedDate?: Moment;
  approverRemarks?: string;
  headerData?: {
    type?: string;
    data?: {
      id: string;
      salesTxnId: string;
      linkedTxnId: string;
      parentCnId: null;
      originalCnId: null;
      cancelTxnId: null;
      creditNoteType: string;
      locationCode: string;
      fiscalYear: number;
      docNo: number;
      docDate: Moment;
      customerId: number;
      amount: number;
      utilisedAmount: number;
      paymentDetails: null;
      processId: null;
      remarks: null;
      status: string;
      workflowStatus: null;
      approverLocationCode: null;
      customerName: string;
    };
  };
  processId?: string;
  requestedBy?: string;
  requestedDate?: Moment;
  requestorRemarks?: string;
  workflowType?: string;
  taskId?: string;
  taskName?: string;
  amount?: number;
  creditNoteType?: string;
  customerId?: number;
  customerName?: string;
  docDate?: Moment;
  docNo?: number;
  fiscalYear?: number;
  id?: string;
  linkedTxnId?: string;
  linkedTxnType?: string;
  locationCode?: string;
  mobileNumber?: string;
  refDocNo?: number;
  refDocType?: string;
  status?: string;
  workflowStatus?: string;
  requestorUserName?: string;
  approverLocationCode?: string;
}
export interface InwardCnPayload {
  workflowType: string;
  id: string;
  remarksDto: {
    remarks: string;
  };
}
export interface ApproveOrRejectCnTransferPayaload {
  workflowType: string;
  id: string;
  remarksDto: {
    remarks: string;
  };
  status: string;
}
