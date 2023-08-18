import { DocumentListResponse } from '../..';

export interface tepApprovalListResponse {
  locationCode: string;
  cnNumber: string;
  fiscalYear: string;
  approvedData: any;
  requestNo: number;
  requestDate: any;
  customerName: string;
  variantCode: string;
  standardWt: number;
  grossWt: number;
  amount: string;

  processId: string;
  taskId: string;
  taskName: string;
  totalElements: number;

  requestedBy: string;

  requestorRemarks: string;
  remarks: string;
  customerMobileNo?: any;
  tepExceptionDetails?: any;
  flatExchangeValue?: any;
  deductionPercent?: any;
  approvedBy?: any;
  customerId?:any;
  itemCode?:any;
}

export interface tepRequests {
  results: tepApprovalListResponse[];
  count: number;
}

export interface FullValueTepRequestsResponse {
  results: FullValueApprovalListItem[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface FullValueTepListHeaderData {
  type: string;
  data: {
    approvalDetails: {
      data: {
        approvalDate: string;
        approvalCode: string;
        approvedBy: string;
        fileList: {
          results: DocumentListResponse[];
        };
      };
      type: string;
    };
    fvtLocationCode: string;
    fvtLocationType: string;
    cmLocationCode: string;
    cmDocNo: number;
    cmDocDate: number;
    noOfDaysFromCm: number;
    customerName: string;
    customerMobileNo: string;
    reasonForFullValueTep: string;
    itemCode: string;
    lotNumber: string;
    totalNoOfStones: number;
    measuredNoOfStones: number;
    measuredWeight: number;
    billedWeight: number;
    totalQuantity: number;
    salesTxnId: string;
    metalValue: number;
    stoneValue: number;
    paymentMode: string;
    priceDetails?: any;
  };
}
export interface FullValueApprovalListItem {
  taskId: string;
  taskName: string;
  processId: string;
  headerData: FullValueTepListHeaderData;
  workflowType: string;
  docNo: number;
  docDate: number;
  fiscalYear: number;
  locationCode: string;
  requestorRemarks: string;
  requestedBy: string;
  requestedDate: number;
  approvedBy: any;
  approvedDate: any;
  approverRemarks: any;
  approvalStatus: string;
  requestorCode: string;
  approverCode: any;
}

export interface FvtAcceptOrRejectRequestPayload {
  approvedData: {
    type: string;
    data: {
      tepValue: string[];
      overrideValue?: number;
      approverRemarks: any;
      paymentValue: string[];
    };
  };
  approverRemarks: string;
}
