import { EventEmitter } from '@angular/core';

import { Moment } from 'moment';

export interface CreateOpenTepTransactionResponse {
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

export interface PatchTepRequestPayload {
  customerId?: number;
  employeeCode?: string;
  exchangeDetails?: {
    data: {};
    type: string;
  };
}

export interface GetTepItemConfiguratonResponse {
  isCMMandatory: boolean;
  isQuantityEditable: boolean;
  isTepAllowed: boolean;
  allowedRefundMode: string;
  maxFlatTepException: number;
  subRefundModes: [];
  refundCashLimit: number;
  isTEPSaleBin: boolean;
  isCutPieceTepAllowed?: boolean;
  isFVTAllowed?: boolean;
  tepOfferDetails?: {
    offerDetails?: any;
    type: string;
    data: {
      deductionPercent: number;
      flatTepExchangeValue: number;
      isWeightToleranceAllowed: boolean;
      approvedBy: string;
      reasonForException: string;
    };
  };
  goldDeductionPercent: number;
  silverDeductionPercent: number;
  platinumDeductionPercent: number;
  ucpDeductionPercent: number;
  ucpDeductionFlatValue: any;
  isStoneChargesApplicable: boolean;
  stoneDeductionPercent: number;
  cmUnavailableDeductionPercent: number;
  recoverDiscountPercent: number;
  refundDeductionPercent: number;
  weightTolerancePercent: number;
  isProportionedValue: boolean;
  typeOfExchange: string;
  isInterBrandTepAllowed?: boolean;
  fvtDeductionPercent?: number;
  tepGeneralCodeConfig?: {
    allowedProductGroups?: string[];
    isCMMandatory?: boolean;
    isValuationAtStore?: boolean;
  };
  tepValidationConfig?: {
    isInterBrandCashRefundAllowed: boolean;
  };
  tepCutPieceConfig?: {
    cutPieceItemCode?: string;
    weightTolerancePercent: number;
  };
}

export interface TepCashMemoResponseItem {
  itemCode: string;
  discountRecovered: number;
  lotNumber: string;
  totalWeight: number;
  cashMemoDetailsId: string;
  totalValue: number;
  totalQuantity: number;
  totalPendingQuantity: number;
  productGroupCode?: string;
  isCMMandatory?: boolean;
  isCmAllowed?: boolean;
}

export interface GetTepCashMemoResponse {
  results: TepCashMemoResponseItem[];
}
export interface TEPDownValues {
  type?: string;
  status: string;
  refundType?: string;
}

export interface RefundStatus {
  id: string;
  refundType: string;
  status: string;
  docNo: string;
  locationCode: string;
  refTxnId: string;
  headerData: any;
  approvedData: any;
}
export interface RefundStatusCount {
  refundList: RefundStatus[];
  totalElements: number;
}

export interface RefundRequestPayload {
  id: string;
  status?: string;
  txnType: string;
}
export interface GetTepPriceDetailsRequestPayload {
  cashMemoDetailsId?: string;
  customerMobileNo?: string;
  itemCode: string;
  lotNumber?: string;
  customerType?: string;
  tepExceptionDetails?: {
    approvedData?: {
      type: string;
      data: {
        deductionPercent?: number;
        flatExchangeValue?: number;
        customerId: number;
        itemCode: number;
        approvedBy: string;
      };
    };
    approverRemarks: string;
  };
  measuredQuantity?: number;
  measuredWeight?: number;
  standardPrice: any;
  stones?: StoneList[];
  mobileNo?: string;
  tepType: string;
  isDummyCode?: boolean;
}

export interface StoneList {
  measuredNoOfStones: number;
  stoneCode: string;
  measuredStoneWeight?: number;
}

export interface GetTepPriceDetailsResponse {
  currencyCode: string;
  deductionAmount: number;
  discountRecovered: number;
  refundDeductionAmount: number;
  finalValue: number;
  isUCPproduct: boolean;
  isExceptionValue: boolean;
  isUCPCMValue: boolean;
  iscashMemoAvailable: boolean;
  itemCode: string;
  itemQuantity: number;
  itemTypeCode: string;
  lotNumber: string;
  measuredWeight?: number;
  materialDetails: {
    materialWeight: number;
    preDiscountValue: number;
    weightUnit: string;
  };
  metalPriceDetails: {
    metalPrices: {
      karat: number;
      metalTypeCode: string;
      metalValue: number;
      netWeight: number;
      purity: number;
      ratePerUnit: number;
      type: string;
      weightUnit: string;
    }[];
    preDiscountValue: number;
  };
  netWeight: number;
  productCategoryCode: string;
  productCategoryDesc: string;
  productGroupCode: string;
  productGroupDesc: string;
  stdWeight: number;
  stonePriceDetails: {
    numberOfStones: number;
    preDiscountValue: number;
    stoneWeight: number;
    weightUnit: string;
  };
  stones: StoneDetail[];
  taxDetails?: any;
}

export interface StoneDetail {
  currencyCode: string;
  deductionValue: number;
  finalStoneValue: number;
  measuredNoOfStones: number;
  measuredStoneWeight?: number;
  noOfStones: number;
  ratePerCarat: number;
  stdValue: number;
  measuredValue?: number;
  stoneCode: string;
  stoneTypeCode?: string;
  stoneWeight: number;
  weightUnit: string;
  totalStoneWeight?: number;
}

export interface TEPSearchResponse {
  totalElements: number;
  TEPList: TEPList[];
}

export interface TEPList {
  refDocNo: number;
  customerName: string;
  refTxnTime: Moment;
  refTxnId: string;
  txnType: string;
  subTxnType: string;
  refDocDate: Moment;
  totalValue: number;
  currencyCode: string;
}
export interface SaveTepDataType {
  cashMemoDetailsId: string;
  variantCode: string;
  isDummy?: boolean;
  cmAvailable: boolean;
  grossWt: number;
  saleableValue?: boolean;
  enableSaleable?: boolean;
  valuation?: '';
  deductionAmt: number;
  exchangeValue: number;
  refundDeduction: number;
  quantity: number;
  stonesDetails: any[];
  totalValue: number;
  totalWeight: number;
  unitValue: number;
  unitWeight: number;
  rowKey: string;
  discountRecovery: number;
  discountDetails: any;
  totalTax?: number;
  lotNumber?: any;
  isRequestApprovalScenario: boolean;
  stoneDetailsList?: StoneDetail[];
  productGroupCode?: string;
  viewTepItemData?: any;
  viewPriceDetails?: GetTepPriceDetailsResponse;
  isExceptionScenario?: boolean;
}

export interface AddTepItemRequestPayload {
  cashMemoDetailsId?: string;
  discountDetails?: any;
  finalValue: number;
  isSaleable?: boolean;
  itemCode: string;
  quantity: number;
  inventoryId?: string;
  stonesDetails?: any[];
  stoneDetailsList?: StoneDetail[];
  totalValue: number;
  totalWeight?: number;
  unitValue?: number;
  unitWeight?: number;
  itemDetails?: {
    type?: string;
    data?: {
      itemCode: string;
      lotNumber: string;
      grossWeight: number;
      metalWeight: {
        type: string;
        data: {
          silverWeight: number;
          stoneWeight: number;
          materialWeight: number;
          goldWeight: number;
          diamondWeight: number;
          platinumWeight: number;
        };
      };
    };
  };
}

export interface AddOrUpdateTepItemResponse {
  confirmedTime: string;
  currencyCode: string;
  customerId: number;
  docDate: string;
  docNo: number;
  employeeCode: string;
  netRefundAmount: number;
  firstHoldTime: string;
  fiscalYear: number;
  id: string;
  itemDetails: {
    binCode: string;
    cashMemoDetailsId: string;
    refDocDate: any;
    finalValue: number;
    inventoryId: string;
    itemCode: string;
    itemId: string;
    itemType: string;
    isSaleable?: boolean;
    karat: number;
    lotNumber: string;
    measuredPurity: number;
    measuredWeight: number;
    metalType: string;
    preMeltingDetails: {
      karatage: number;
      purity: number;
      weight: number;
    };
    priceDetails: any;
    purity: number;
    quantity: number;
    rowId: number;
    taxDetails: {
      cess: {
        cessCode: string;
        cessOnTax: true;
        cessPercentage: 0;
        cessValue: 0;
      }[];
      data: {
        taxCode: string;
        taxPercentage: number;
        taxValue: number;
      }[];
      taxClass: string;
      taxType: string;
    };
    totalTax: number;
    totalValue: number;
    totalWeight: number;
    unitValue: number;
    unitWeight: number;
  };
  lastHoldTime: string;
  metalRateList: {
    metalRates: any;
  };
  remarks: string;
  roundingVariance: number;
  status: string;
  manualBillDetails: any;
  totalQuantity: number;
  totalTax: number;
  totalValue: number;
  cumulativeRefundAmt: number;
  totalWeight: number;
  weightUnit: string;
  taxDetails: any;
  refundDeductionAmount: number;
}

export interface UpdateTepItemRequestPayload {
  finalValue?: number;
  isSaleable?: boolean;
  quantity?: number;
  stonesDetails?: StoneList[];
  totalValue?: number;
  totalWeight?: number;
  unitValue?: number;
  unitWeight?: number;
}

export interface ConfirmOrHoldTepRequestPayload {
  approvalDetails?: {
    type: string;
    data: {
      approvalDate?: string;
      approvalCode?: string;
      processType: string;
      approvedBy: string;
      fileList?: FileList[];
    };
  };
  tepExceptionDetails?: {
    type: string;
    data: {
      deductionPercent?: number;
      flatExchangeValue?: number;
      customerId: number;
      itemCode: number;
      approvedBy: string;
    };
  };

  discountTypeSelected?: string;
  customerId: number;
  employeeCode: string;
  exchangeDetails: {
    data: {};
    type: string;
  };
  isRefund?: boolean;
  paymentType?: string;
  metalRateList: {
    metalRates: any;
  };
  refundDetails?: {
    data: any;
    type: string;
  };
  reason?: string;
  remarks: string;
  totalQuantity: number;
  totalTax: number;
  totalValue: number;
  totalWeight: number;
  finalValue?: number;
}

export interface ConfirmRequestTepRequestPayload {
  metalRateList: {
    metalRates: any;
  };

  remarks: string;
  discountTypeSelected?: string;
  totalValue: number;
  totalWeight: number;
  refundDetails?: any;
}

export interface ConfirmTepItemResponse {
  cnDocNo: number;
  confirmedTime: string;
  currencyCode: string;
  customerId: number;
  docDate: string;
  docNo: number;
  reqDocNo?: number;
  employeeCode: string;
  firstHoldTime: string;
  fiscalYear: number;
  id: string;
  itemDetails: {
    binCode: string;
    cashMemoDetailsId: string;
    finalValue: number;
    inventoryId: string;
    itemCode: string;
    itemId: string;
    itemType: string;
    karat: number;
    lotNumber: string;
    measuredPurity: number;
    measuredWeight: number;
    metalType: string;
    preMeltingDetails: {
      karatage: number;
      purity: number;
      weight: number;
    };
    priceDetails: {};
    purity: number;
    quantity: number;
    rowId: number;
    taxDetails: {
      cess: {
        cessCode: string;
        cessOnTax: true;
        cessPercentage: 0;
        cessValue: 0;
      }[];
      data: {
        taxCode: string;
        taxPercentage: number;
        taxValue: number;
      }[];
      taxClass: string;
      taxType: string;
    };
    totalTax: number;
    totalValue: number;
    totalWeight: number;
    unitValue: number;
    unitWeight: number;
  };
  lastHoldTime: string;
  metalRateList: {
    metalRates: any;
  };
  tepExceptionDetails?: {
    type: string;
    data: {
      deductionPercent?: number;
      flatExchangeValue?: number;
      customerId: number;
      itemCode: number;
      approvedBy: string;
    };
  };
  remarks: string;
  roundingVariance: number;
  status: string;
  manualBillDetails: any;
  totalQuantity: number;
  totalTax: number;
  totalValue: number;
  totalWeight: number;
  weightUnit: string;
}

export interface CancelTEPResponse {
  msg: string;
}

export interface DeleteTepItemResponse {
  confirmedTime: string;
  currencyCode: string;
  customerId: number;
  docDate: string;
  docNo: number;
  employeeCode: string;
  firstHoldTime: string;
  fiscalYear: number;
  id: string;
  itemDetails: {
    binCode: string;
    cashMemoDetailsId: string;
    finalValue: number;
    inventoryId: string;
    itemCode: string;
    itemId: string;
    itemType: string;
    karat: number;
    lotNumber: string;
    measuredPurity: number;
    measuredWeight: number;
    metalType: string;
    preMeltingDetails: {
      karatage: number;
      purity: number;
      weight: number;
    };
    priceDetails: {};
    purity: number;
    quantity: number;
    rowId: number;
    taxDetails: {
      cess: {
        cessCode: string;
        cessOnTax: true;
        cessPercentage: 0;
        cessValue: 0;
      }[];
      data: {
        taxCode: string;
        taxPercentage: number;
        taxValue: number;
      }[];
      taxClass: string;
      taxType: string;
    };
    totalTax: number;
    totalValue: number;
    totalWeight: number;
    unitValue: number;
    unitWeight: number;
  };
  lastHoldTime: string;
  metalRateList: {
    metalRates: any;
  };
  remarks: string;
  roundingVariance: number;
  status: string;
  manualBillDetails: any;
  totalQuantity: number;
  totalTax: number;
  totalValue: number;
  totalWeight: number;
  weightUnit: string;
}

export abstract class TepItemPopUpServiceAbstraction {
  public abstract open(itemObject: any): EventEmitter<any>;
}

export interface TepTransactionResponse {
  approvalDetails?: {
    type: string;
    data: {
      approvalDate?: string;
      approvalCode?: string;
      processType: string;
      approvedBy: string;
      fileList?: FileList[];
    };
  };
  reason: string;
  confirmedTime: string;
  currencyCode: string;
  customerId: number;
  docDate: string;
  docNo: number;
  employeeCode: string;
  exchangeDetails: any;
  firstHoldTime: Moment;
  fiscalYear: number;
  id: string;
  itemIdList: string[];
  itemIds?: string[];
  lastHoldTime: Moment;
  manualBillDetails: any;
  manualBillId: string;
  finalValue: number;
  metalRateList: {
    metalRates: any;
  };
  roundingVariance: number;
  status: string;
  netRefundAmount: number;
  taxDetails: any;
  totalQuantity: number;
  cumulativeRefundAmt: number;
  custTaxNo?: string;
  custTaxNoOld?: string;
  totalTax: number;
  totalValue: number;
  totalWeight: number;
  weightUnit: string;
  remarks?: string;
  refundDetails?: {
    type: string;
    data: any;
  };
}

export interface TepItemResponse {
  binCode: string;
  cashMemoDetailsId: string;
  discountDetails: {
    data: any;
    type: string;
  };
  discountRecovered?: number;
  deductionAmount?: number;
  finalValue: number;
  inventoryId: string;
  itemCode: string;
  itemId: string;
  itemType: string;
  karat: number;
  lotNumber: string;
  measuredPurity: number;
  measuredWeight: number;
  metalType: string;
  preMeltingDetails: {
    karatage: number;
    purity: number;
    weight: number;
  };
  priceDetails: any;
  purity: number;
  quantity: number;
  rowId: number;
  stones: StoneDetail[];
  taxDetails: {
    cess: [
      {
        cessCode: string;
        cessOnTax: boolean;
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
  totalTax: number;
  totalValue: number;
  totalWeight: number;
  unitValue: number;
  unitWeight: number;
  itemDetails: {
    type: string;
    data: any;
  };
  karatage?: any;
  totalQuantity?: number;
  stdWeight?: number;
  productCategoryCode?: string;
  productCategoryDescription?: string;
  productGroupCode?: string;
  productGroupDescription?: string;
  totalWeightDetails?: any;
  imageUrl?: string;
  binGroupCode?: string;
  itemDescription?: string;
  stdValue?: number;
  id?: string;
  isHallmarking?: boolean;
}

export interface RefundDetails {
  refundTypeSelected: string;
  paymentSubRefundModes?: string;
  nameAsPerBankRecord: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  reenteredAccountNumber: string;
  branch: string;
  ifscCode: string;
  invalid?: boolean;
}

export interface GoldPlusLocation {
  description: string;
  locationCode: string;
  locationFormat: string;
}

export interface RefundListingPayload {
  dateRangeType?: string;
  docNo?: number;
  endDate?: number;
  fiscalYear?: number;
  locationCode?: string;
  refundType?: string;
  startDate?: number;
  status?: string;
  subTxnType: string;
}

export interface RefundListItem {
  approvedData: {
    type: string;
    data: {
      refundMode: string;
      utrNumber?: string;
      customerName: string;
      bankName: string;
      bankAccountNo?: string;
      branchName?: string;
      ifscCode?: string;
      chequeNumber?: string;
      micrCode?: string;
      payeeName?: string;
    };
  };
  docDate: string;
  docNo: number;
  headerData: {
    type: string;
    data: {
      customerName: string;
      customerId: number;
      remarks: string;
      totalWeight: number;
      totalRefundAmount: number;
      totalValue: number;
      totalQuantity: number;
      itemDetails: {
        itemCode: string;
        isCmAvailable: boolean;
        isSaleable: boolean;
        priceDetails: any;
        totalWeight: number;
        totalValue: number;
      }[];
    };
  };
  id: string;
  locationCode: string;
  refTxnId: string;
  refundType: string;
  remarks: string;
  requestorName: string;
  status: string;
}

export interface RefundList {
  pageNumber: 0;
  pageSize: 0;
  results: RefundListItem[];
  totalElements: 0;
  totalPages: 0;
}

export interface RefundCashLimit {
  cashLimit?: number;
  isCashPaymentAllowed?: boolean;
  totalTxnAmt?: number;
}

export interface EditRefundItemPayload {
  approvedData: {
    type: string;
    data: {
      refundMode: string;
      utrNumber?: string;
      customerName: string;
      bankName: string;
      bankAccountNo?: string;
      branchName?: string;
      ifscCode?: string;
      chequeNumber?: string;
      micrCode?: string;
    };
  };
}

export interface createOpenOrPatchCutPieceTepStockManagementResponse {
  docNo: number;
  fiscalYear: number;
  id: string;
  locationCode: string;
  status: string;
  totalValue: number;
  totalWeight: number;
  transactionType: number;
}

export interface patchCutPieceTepStockManagementPayload {
  employeeCode: string;
}

export interface addCutPieceTepItemInStockManagementPayload {
  inventoryId: string;
  itemCode: string;
  lotNumber: string;
  measuredWeight?: number;
}

export interface patchCutPieceTepItemInStockManagementPayload {
  measuredWeight: number;
}

export interface addOrPatchCutPieceTepItemInStockManagementResponse {
  isHallmarking?: boolean;
  binCode: string;
  binGroupCode: string;
  currencyCode: string;
  id: string;
  itemCode: string;
  itemDetails: {
    data: any;
    type: string;
  };
  karat: number;
  lotNumber: string;
  quantity: number;
  stdValue: number;
  stdWeight: number;
  stockTransactionId: string;
  weightUnit: string;
}

export interface confirmCutPieceTepItemInStockManagementPayload {
  employeeCode: string;
  remarks: string;
  totalQuantity: number;
  totalValue: number;
  totalWeight: number;
}

export interface DiscountsList {
  discountId: string;
  discountCode: string;
  discountType: string;
  discountValue?: number;
  oneKTDiscountValue?: number;
  twoKTDiscountValue?: number;
}

export interface DiscountListPayload {
  id: string;
  subTxnType: string;
  txnType: string;
}
