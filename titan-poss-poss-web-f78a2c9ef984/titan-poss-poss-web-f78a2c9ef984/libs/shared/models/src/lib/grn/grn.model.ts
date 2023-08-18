import { Moment } from 'moment';

export interface GrnReqStatus {
  grnNumber: string;
  srcBoutiqueCode: string;
  destBoutiqueCode: string;
  approverRemarks: string;
  reqNumber: string;
  defectType: string;
  products: string;
  customerName: string;
  status: string;
  time: any;
  productValue: string;
  grnId: string;
  processId: string;
  reqDate: any;
  cmNumber: any;
}

export interface GrnReqStatusListResponse {
  grnReqStatus: GrnReqStatus[];
  totalElement: number;
}

export interface GrnProductDetails {
  id?: string;
  itemCode: string;
  lotNumber: string;
  unitWeight: string;
  totalWeight: string;
  employeeCode: string;
  pricePerUnit: string;
  productGroupCode: string;
  productCategoryCode: string;
  binCode: string;
  totalDiscount: string;
  finalValue: string;
  totalValue: string;
  unitValue?: number;
  totalQuantity: any;
  priceDetails: {
    makingChargeDetails: {
      makingChargePercentage: number;
      preDiscountValue: number;
    };
    metalPriceDetails: {
      metalPrices: [
        {
          karat: number;
          metalTypeCode: string;
          metalValue: number;
          netWeight: number;
          purity: number;
          ratePerUnit: number;
          type: string;
          weightUnit: string;
        }
      ];
      preDiscountValue: number;
    };
    stonePriceDetails: {
      numberOfStones: number;
      preDiscountValue: number;
      stoneWeight: number;
      weightUnit: string;
    };
  };
  taxDetails: {
    cess: [
      {
        cessCode: string;
        cessOnTax: true;
        cessPercentage: number;
        cessValue: number;
      }
    ];
    data: [
      {
        taxCode: string;
        taxPercentage: number;
        taxValue: number;
      }
    ];
    taxClass: string;
    taxType: string;
  };
  selected: boolean;
}

export interface GrnReqDetails {
  txnType: string;
  subTxnType: string;
  boutiqueCode: string;
  boutiqueName?: string;
  fiscalYear?: string;
  cmNumber?: string;
  cnDocDetails?: any;
  cmDate?: any;
  invoicedGoldRate?: string;
  invoicedPlatinumRate?: string;
  productDetails: GrnProductDetails[];
  cmNetAmount: string;
  otherCharges?: string;
  encirclePoints?: number;
  loyaltyPoints?: number;
  tcsTobeRefund?: string;
  focRecoveredValue?: number;
  status: string;
  grnType?: string;
  reasonForCancellation?: string;
  approver: string;
  reason: string;
  time: any;
  approvalStatus: string;
  isCmGoldRate: boolean;
  totalReturnProduct: string;
  totalReturnGrn: string;
  customerId: string;
  cashmemoId?: string;
  processId?: string;
  tcsAmountCollected: number;
  txnSource?: string;
}
export interface GrnApprovalDetails {
  approver: string;
  reason: string;
  time: any;
  status: string;
  totalReturnProduct: string;
  totalReturnGrn: string;
}

export interface GrnReqStatusListPayload {
  filterOptions: {
    dateRangeType?: string;
    docNo?: string;
    endDate?: string;
    fiscalYear?: string;
    startDate?: string;
    filterParams?: {
      refDocNo?: string;
    };
  };
  page?: number;
  size?: number;
  workflowType: string;
  approvalStatus: string;
}

export interface ConfirmGrnPayload {
  data: { customerId: string; remarks: string };
  grnId: string;
  txnType: string;
  subTxnType: string;
}

export interface GrnHistoryDetails {
  customerName: string;
  createdDate: any;
  docDate: any;
  createdBy: any;
  grnNo: number;
  cnNumber: number;
  fiscalYear: number;
  grnId: string;
  netAmount: number;
  cmLocation: string;
  status: string;
  creditNoteType: string;
}
export interface GrnHistoryResponse {
  grnHistoryDetails: GrnHistoryDetails[];
  totalElements: number;
}
export interface GrnHistoryPayload {
  filterOptions: {
    docNo?: number;
    fiscalYear?: number;
    fromDocDate?: any;
    refDocNo?: number;
    toDocDate?: any;
    searchType?: string;
    searchField?: string;
    cmLocation?: string;
  };

  page?: number;
  size?: number;
  txnType?: string;
  subTxnType?: string;
}

export interface ConfirmGrnWithOutApprovalPayload {
  data: {
    cancelType: string;
    customerId: number;
    focItems?: [
      {
        itemId: string;
        quantity: number;
      }
    ];
    items: ItemDataPayload[];
    reasonForCancellation: string;
    refTxnId: string;
    remarks: string;
    isVoid?: boolean;
  };
  grnId?: string;
  txnType: string;
  subTxnType: string;
}

export interface TcsCollectedResponse {
  tcsAmountCollected: number;
}

export interface ConfirmGrnSuccessPayload {
  cnAmt: number;
  cndocTypes?: any;
  cndocNos: any;
  docNo: number;
  id: string;
  loyaltyReversalPoint: number;
  tcsCnAmt?: number;
}

export interface SendForApprovalPayload {
  data: {
    approvalCode?: string;
    approvalDate?: any;
    tempFileIds?: any;
    approverRoleCode: string;
    cancelType: string;
    ccafNo?: string;
    customerId: number;
    focItems?: [
      {
        itemId: string;
        quantity: number;
      }
    ];
    items: ItemDataPayload[];
    reasonForCancellation: string;
    refTxnId: string;
    requestorRemarks: string;
    isVoid?: boolean;
  };

  grnId?: string;
  txnType: string;
  subTxnType: string;
}

export interface GrnInitPayload {
  refDocNo: number;
  locationCode?: string;
  fiscalYear: number;
  subTxnType?: string;
  txnType?: string;
}

export interface GrnInitResponse {
  refCustomerId: number;
  refDocDate: Moment;
  refFiscalYear: number;
  refDocNo: number;
  focValue: string;
  grnCustomerId: number;
  cmNetAmount: string;
  id: string;
  invoicedGoldRate?: string;
  invoicedPlatinumRate?: string;
  invoicedSilverRate?: string;
  items: GrnProductDetails[];
  encirclePoints?: number;
  loyaltyPoints?: number;
  otherCharges: number;
  status: string;
  totalValue: number;
  returnableItemIds: string[];
  returnedItemIds: returnedItemDataPayload[];
  txnType: string;
  subTxnType: string;
  tcsTobeRefund?: string;
  tcsAmountCollected: number;
  txnSource?: string;
  isVoid?: boolean;
}
export interface GrnApproversPayload {
  data: { locationCode: string };
  ruleType: string;
}
export interface GrnPriceDetailsPayload {
  data: { refTxnId: string; items: ItemDataPayload[] };
  txnType: string;
  subTxnType: string;
}

export interface ItemDataPayload {
  itemId: string;
  totalQuantity: number;
}

export interface returnedItemDataPayload {
  itemId: string;
  totalQuantity: number;
}

export interface ItemDetailsPayload {
  refTxnId: string;
  data: { itemId: string; totalQuantity: number };
  selected: boolean;
}

export interface GrnPriceDetailsSuccess {
  totalItemsValue: number;
  focDeductionValue: number;
  finalValue: number;
  totalReturnQuantity: number;
  encirclePoints: number;
  tcsAmountToBeRefund?: number;
}
export interface GrnApproverSuccessList {
  value: string;
  description: string;
  // roleCode: string;
  processType: string;
  // fromDays: number;
  // tillDays: number;
  // upperLimit: number;
}
// export interface GrnInitProductDetails {
//   employeeCode: string;
//   finalValue: number;
//   inventoryWeight: number;
//   itemCode: string;
//   itemId: string;
//   lotNumber: string;
//   rowId: string;
//   totalDiscount: number;
//   totalQuantity: number;
//   totalTax: number;
//   totalValue: number;
//   totalWeight: number;
//   unitValue: number;
// }
export interface GrnSendForAprovalSuccess {
  docNo: number;
  id: string;
  requestNo: number;
}
export enum GrnEnums {
  GOODS_RETURN = 'GOODS_RETURN',
  ALL = 'ALL',
  TODAY = 'TODAY',
  LAST_MONTH = 'LAST_MONTH',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  CLOSED = 'CLOSED',
  TXN_TYPE = 'GRN',
  SUB_TXN_TYPE = 'CASH_MEMO',
  GRN_STATUS = 'status',
  GRN_CREATE = 'create',
  REGULAR_GRN = 'REGULAR_GRN',
  MFG_DEFECT = 'MFG_DEFECT',
  GRN_APPROVAL_ACCESS_REGULAR = 'GRN_APPROVAL_ACCESS_REGULAR',
  GRN_APPROVAL_ACCESS_MFG_DEFECT = 'GRN_APPROVAL_ACCESS_MFG_DEFECT',
  HISTORY = 'history',
  CONFIRMED = 'CONFIRMED'
}
export enum GrnReasonEnums {
  QUALITY_ISSUE = 'QUALITY_ISSUE',
  OTHERS = 'OTHERS'
}

export enum GrnApprovalTypeEnums {
  EMAIL = 'EMAIL',
  CODE = 'CODE'
}

export enum GRN_SEARCH_BY_ENUM {
  MOBILE_NO = 'MOBILE_NO',
  ULP_ID = 'ULP_ID',
  PAN_NO = 'PAN_NO',
  GST_NO = 'GST_NO',
  PASSPORT_ID = 'PASSPORT_ID',
  EMAIL_ID = 'EMAIL_ID'
}
