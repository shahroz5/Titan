import { Moment } from 'moment';
import { StatusTypesEnum } from '../cash-memo/cash-memo.enum';
import {
  AvailableLotNumber,
  ManualBillDetails
} from '../cash-memo/cash-memo.model';

export interface AdvanceBookingDetailsRequestPayload {
  txnType: string;
  subTxnType: string;
  actionType?: string;
  id?: string;
  status?: StatusTypesEnum;
  requestDetails?: any;
  acknowledge?: boolean;
  oldData?: AdvanceBookingDetailsResponse;
}

export interface AdvanceBookingSearchPayload {
  type?: string;
  docNo: number;
  txnType: string;
  subTxnType: string;
  fiscalYear?: number;
  mobileNumber?: string;
  page: number;
  size: number;
  status?: string;
}

export interface AdvanceBookingItemDetailsRequestPayload {
  txnType: string;
  subTxnType: string;
  id: string;
  itemId?: string;
  itemDetails?: any;
  availableLotNumbers?: AvailableLotNumber[];
  productDetails?: any;
  headerData?: AdvanceBookingDetailsResponse;
}

export interface AdvanceBookingDetailsResponse {
  customerId: number;
  cancelTxnId: number;
  metalRateList: any;
  finalValue: number;
  occasion: string;
  otherChargesList: any;
  paidValue: number;
  discountDetails: any;
  focDetails: {};
  isRivaah: boolean;
  refTxnId: string;
  refTxnType: string;
  refSubTxnType: string;
  remarks: string;
  taxDetails: any;
  totalDiscount: number;
  totalQuantity: number;
  totalTax: number;
  totalValue: number;
  totalWeight: number;
  docNo: number;
  firstHoldTime: Moment;
  fiscalYear: number;
  id: string;
  lastHoldTime: Moment;
  roundingVariance: number;
  status: StatusTypesEnum;
  itemIdList?: string[];
  txnType: string;
  subTxnType: string;
  manualBillDetails?: ManualBillDetails;
  docDate: Moment;
  employeeCode: string;

  txnTime: Moment;
  activationDetails: any;
  cancellationDetails: any;
  confirmedTime: Moment;
  isFrozenRate: boolean;
  isFrozenAmount: number;
  isBestRate: boolean;
  minValue: number;
  customerName?: string;
  locationCode?: string;
  cndocNos?: number[];
  cnDocNoList?: any;
  creditNotes?: number[];
  orderWeightDetails?: {
    type: string;
    data: {};
  };
  deliveredWeightDetails?: {
    type: string;
    data: {};
  };
  totalDeliveredWeight?: number;
  customerDocDetails: string;
  updateWeight?: boolean;
  tcsToBeCollected?: number;
  tcsCollectedAmount?: number;
  hallmarkCharges: number;
  hallmarkDiscount: number;
  refDocNo: number;
  refFiscalYear: number;
  cancelRemarks: string;
  minPaymentDetails: {};
  panCardNumber?: string;
  oldPanCardNumber?: string;
  collectedBy: string;
  isIGST?: boolean;
  txnSource?: string;
  hasError?: boolean;
  cashMemoDetailsId?: number;
}

export interface ABSearchResponse {
  totalElements: number;
  ABList: AdvanceBookingDetailsResponse[];
}

export interface RequestPayload {
  httpMethod?: string;
  relativeUrl?: string;
  reqBody: {
    dateRangeType?: string;
    docNo?: number;
    filterParams?: any;
    endDate?: Moment;
    refundType?: string;
    locationCode?: string;
    fiscalYear?: number;
    startDate?: Moment;
    status?: string;
    subTxnType?: string;
  };
  requestParams: {
    page?: number;
    size?: number;
    workflowType?: string;
    approvalStatus?: string;
    sort?: any;
    txntype?: string;
  };
}

export interface workflowPayload {
  processId: string;
  workflowType: string;
}

export interface ABRequestStatusList {
  response: any;
  pageNumber: number;
  pageSize: number;
  results: RequestStatus[];
  totalElements: number;
  totalPages: number;
}

export interface RequestStatus {
  approvalLevel: number;
  approvalStatus: string;
  approvedBy: string;
  processId: string;
  approvedDate: Moment;
  approverRemarks: string;
  docNo: number;
  fiscalYear: number;
  headerData: any;

  requestedBy: string;
  requestedDate: Moment;
  requestorRemarks: string;
  workflowType: string;
}

export interface ABRequestStatusDownValues {
  type?: string;
  status: string;
}

export interface ABSearchValues {
  function: string;
  doNo: number;
  fiscalYear: number;
  phNo: number;
}

export interface RequestStatusDownValues {
  value: string;
  description: string;
  isActive: boolean;
}

export interface ValidateABMetalRatePayload {
  id: string;
  status: StatusTypesEnum;
  txnType: string;
  subTxnType: string;
  metalRates: any;
}
