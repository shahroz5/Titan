import {
  AbToleranceConfigMetalType,
  AdvanceBookingDetailsResponse,
  CashMemoDetailsResponse,
  CashPaymentConfiguration,
  CreditNote,
  CustomErrors,
  ImageUrlData,
  Lov,
  StatusTypesEnum,
  TransactionConfig
} from '@poss-web/shared/models';

export class CommonState {
  global: {
    transactionConfig: TransactionConfig;
    transactionID: string;
    transactionTotalAmount: number;
    disableFullPaymentCheck: boolean;
    configHoldTime: number;
    isFileUploadVisible: boolean;
  };
  cashMemo: {
    hasError: CustomErrors;
    isLoading: boolean;
    standardMetalPriceDetails: any;
    printData: any;
    transactionConfig: TransactionConfig;
    transactionID: string;
    transactionTotalAmount: number;
    minABvalue: number;
    productGroupDesc: {};
    imageUrlData: ImageUrlData;
    otherCharges: any;
    // configHoldTime: number;
    selectedRsoName: any;
    occasionList: Lov[];
    productQty: number;
    coinQty: number;
    productWeight: number;
    coinWeight: number;
    productDisc: number;
    coinDisc: number;
    productAmt: number;
    coinAmt: number;
    taxAmt: number;
    totalAmt: number;
    totalAmtInUi: number;
    finalAmt: number;
    roundOff: number;
    hallmarkCharges: number;
    hallmarkDiscount: number;
    orderNumber: { orderNo: number; status: StatusTypesEnum | string };
    errorInUpdatePrice: boolean;
    abDetails: AdvanceBookingDetailsResponse;
    partialCmDetails: CashMemoDetailsResponse;
    metalType: AbToleranceConfigMetalType[];
    tolerance: {
      data: {};
      itemType: string;
    };
    grfTolerance: {};
    grnTolerance: {};
    closeTolerance: boolean;
    totalDiscount: number; //productDisc+coinDisc
    totalWeight: number; //productWeigh+coinWeight: number;
    totalQuantity: number; //productQty + coinQty
    tcsToBeCollected: number;
    tcsAmountNeedToReset: boolean;
    isIGSTFlag: boolean;
    ghsCustomerId: number;
    isCMLegacy: boolean;
  };
  ab: {
    hasError: CustomErrors;
    isLoading: boolean;
    standardMetalPriceDetails: any;
    printData: any;
    transactionConfig: TransactionConfig;
    transactionID: string;
    transactionTotalAmount: number;
    minABvalue: number;
    minFrozenAmount: number;
    productGroupDesc: {};
    imageUrlData: ImageUrlData;
    orderWeightDetails: any;
    frozen: boolean;
    // configHoldTime: number;
    selectedRsoName: any;
    status: StatusTypesEnum | string;
    occasionList: Lov[];
    productQty: number;
    coinQty: number;
    productWeight: number;
    coinWeight: number;
    productDisc: number;
    tolerance: {
      data: {};
      itemType: string;
    };
    grfTolerance: {};
    grnTolerance: {};
    coinDisc: number;
    productAmt: number;
    coinAmt: number;
    taxAmt: number;
    totalAmt: number;
    totalAmtInUi: number;
    finalAmt: number;
    roundOff: number;
    hallmarkCharges: number;
    hallmarkDiscount: number;
    orderNumber: { orderNo: number; status: StatusTypesEnum | string };
    errorInUpdatePrice: boolean;
    totalDiscount: number; //productDisc+coinDisc
    totalWeight: number; //productWeigh+coinWeight: number;
    totalQuantity: number; //productQty + coinQty
    ghsCustomerId: number;
  };
  mergeGrf: {
    hasError: CustomErrors;
    mergeCNs: CreditNote[];
    cashAmountMaxCap: string;
    configAmountForAdv: number;
    cashPaymentConfigurationDetails: CashPaymentConfiguration;
    isPanCardMan: boolean;
    isSameCustomer: boolean;
  };

  gc: {
    orderNumber: { orderNo: number; status: StatusTypesEnum | string };
    transactionConfig: TransactionConfig;
    transactionID: string;
    transactionTotalAmount: number;
    gcTotalCardsQty: number;
    selectedRsoName: any;
  };
  acceptAdv: {
    orderNumber: { orderNo: number; status: StatusTypesEnum | string };
    transactionTotalAmount: number;
    transactionConfig: TransactionConfig;
    transactionID: string;
  };
  grf: {
    orderNumber: { orderNo: number; status: StatusTypesEnum | string };
    grfGoldWeight: number;
    transactionTotalAmount: number;
    transactionConfig: TransactionConfig;
    transactionID: string;
    standardMetalPriceDetails: any;
    hasError: CustomErrors;
    isLoading: boolean;
  };
  tep: {
    orderNumber: { orderNo: number; status: StatusTypesEnum | string };
    tepTotalQty: number;
    tepTotalGrossWt: number;
    tepTotalExchangeAmt: number;
    isTepRefundFormValid: boolean;
    tepSelectedPaymentMethod: string;
    selectedTepType: string;
    isTepRequestRaising: boolean;
    sendToCommercial: boolean;
    cutPieceTepTotalQuantity: number;
    cutPieceTepTotalValue: number;
    hasError: CustomErrors;
    isLoading: boolean;
    standardMetalPriceDetails: any;
    transactionConfig: TransactionConfig;
    transactionID: string;
    transactionTotalAmount: number;
    tepTotalRefundAmt: number;
  };
  walkins: {
    walksInsConversionCount: number;
    walkInsCount: number;
    isWalkInsFormInvalid: boolean;
  };
  gep: {
    transactionConfig: TransactionConfig;
    transactionID: string;
    transactionTotalAmount: number;
    orderNumber: { orderNo: number; status: StatusTypesEnum | string };
    standardMetalPriceDetails: any;
    productQty: number;
    coinQty: number;
    productWeight: number;
    productDisc: number;
    productAmt: number;
    taxAmt: number;
    totalAmt: number;
    coinWeight: number;
    coinDisc: number;
    coinAmt: number;
    finalAmt: number;
    roundOff: number;
    componentInstance: string;
    totalDiscount: number; //productDisc+coinDisc
    totalWeight: number; //productWeigh+coinWeight: number;
    totalQuantity: number; //productQty + coinQty
  };
  grn: {
    grnStatus: string;
    totalReturnGrn: number;
    totalReturnProducts: number;
    productGroupDesc: {};
    imageUrlData: ImageUrlData;
    hasError: CustomErrors;
    isLoading: boolean;
    grnWorkflowFlag: boolean;
    creditNoteType: string;
  };
  foc: {
    focItems: any[];
    totalEligibleQty: number;
    totalEligibleWt: number;
  };
  manualFoc: {
    manualFocItems: any[];
  };
  bill_cancellation: {
    productGroupDesc: {};
    imageUrlData: ImageUrlData;
    transactionTotalAmount: number;
    transactionConfig: TransactionConfig;
    transactionID: string;
    occasionList: Lov[];
    productQty: number;
    coinQty: number;
    productWeight: number;
    coinWeight: number;
    productDisc: number;
    coinDisc: number;
    productAmt: number;
    coinAmt: number;
    taxAmt: number;
    totalAmt: number;
    finalAmt: number;
    roundOff: number;
    hasError: CustomErrors;
    isLoading: boolean;
    tcsCollectedAmount: number;
    hallmarkCharges: number;
    hallmarkDiscount: number;
  };
  discount: {
    discountDetails: any;
  };

  invoice: {
    hasError: CustomErrors;
    isLoading: boolean;
    isCopyInvoiceDocument: boolean;
    failedInvoices: string[];
  };

  inventory: {
    error: CustomErrors;
    imageCatalogueDetails: any;
  };

  co: {
    hasError: CustomErrors;
    isLoading: boolean;
    minCOvalue: number;
    productQty: number;
    productWeight: number;
    productDisc: number;
    productAmt: number;
    taxAmt: number;
    finalAmt: number;
    roundOff: number;
    totalGrossWeight: number;
    totalOrderValue: number;
    orderNumber: { orderNo: number; status: StatusTypesEnum | string };
    totalQuantity: number;
    coinQty: number;
    totalDiscount: number;
    coinDisc: number;
    totalAmt: number;
    hallmarkCharges: number;
    hallmarkDiscount: number;
    totalWeight: number;
    standardMetalPriceDetails: any;
    orderWeightDetails: any;
    minFrozenAmount: number;
    frozen: boolean;
  };
}
