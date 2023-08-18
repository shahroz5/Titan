import { createFeatureSelector } from '@ngrx/store';
import { CommonState } from './common.state';
import { CommonActionTypes, CommonActions } from './common.actions';

export const commonFeatureKey = 'common';

export const selectCommonState = createFeatureSelector<CommonState>(
  commonFeatureKey
);

export const initialState: CommonState = {
  global: {
    transactionConfig: null,
    transactionID: null,
    transactionTotalAmount: 0,
    disableFullPaymentCheck: false,
    configHoldTime: 60,
    isFileUploadVisible: true
  },
  cashMemo: {
    hasError: null,
    isLoading: false,
    standardMetalPriceDetails: null,
    printData: null,
    transactionConfig: null,
    transactionID: null,
    transactionTotalAmount: 0,
    minABvalue: null,
    productGroupDesc: null,
    imageUrlData: null,
    selectedRsoName: null,
    occasionList: [],
    productQty: 0,
    partialCmDetails: null,
    coinQty: 0,
    productWeight: 0,
    coinWeight: 0,
    productDisc: 0,
    coinDisc: 0,
    productAmt: 0,
    coinAmt: 0,
    taxAmt: 0,
    totalAmt: 0,
    totalAmtInUi: 0,
    finalAmt: 0,
    roundOff: 0,
    hallmarkCharges: 0,
    hallmarkDiscount: 0,
    otherCharges: null,
    orderNumber: { orderNo: 0, status: null },
    errorInUpdatePrice: false,
    abDetails: null,
    metalType: [],
    tolerance: {
      data: null,
      itemType: null
    },
    grfTolerance: null,
    grnTolerance: null,
    totalDiscount: 0, //productDisc+coinDisc
    totalWeight: 0, // productWeigh+coinWeight: number;
    totalQuantity: 0,
    tcsToBeCollected: 0,
    tcsAmountNeedToReset: false,
    closeTolerance: false,
    isIGSTFlag: false,
    ghsCustomerId: null,
    isCMLegacy: false
  },
  ab: {
    hasError: null,
    isLoading: false,
    standardMetalPriceDetails: null,
    printData: null,
    frozen: null,
    transactionConfig: null,
    minFrozenAmount: 0,
    transactionID: null,
    transactionTotalAmount: 0,
    minABvalue: null,
    productGroupDesc: null,
    imageUrlData: null,
    orderWeightDetails: null,
    selectedRsoName: null,
    occasionList: [],
    status: null,
    productQty: 0,
    coinQty: 0,
    productWeight: 0,
    coinWeight: 0,
    productDisc: 0,
    coinDisc: 0,
    productAmt: 0,
    coinAmt: 0,
    taxAmt: 0,
    totalAmt: 0,
    totalAmtInUi: 0,
    finalAmt: 0,
    tolerance: {
      data: null,
      itemType: null
    },
    grfTolerance: null,
    grnTolerance: null,
    roundOff: 0,
    hallmarkCharges: 0,
    hallmarkDiscount: 0,
    orderNumber: { orderNo: 0, status: null },
    errorInUpdatePrice: false,
    totalDiscount: 0, //productDisc+coinDisc
    totalWeight: 0, // productWeigh+coinWeight: number;
    totalQuantity: 0,
    ghsCustomerId: null
  },
  mergeGrf: {
    hasError: null,
    mergeCNs: [],
    cashAmountMaxCap: null,
    configAmountForAdv: 0,
    cashPaymentConfigurationDetails: null,
    isPanCardMan: true,
    isSameCustomer: true
  },

  invoice: {
    hasError: null,
    isLoading: false,
    isCopyInvoiceDocument: false,
    failedInvoices: null
  },

  gc: {
    orderNumber: { orderNo: 0, status: null },
    transactionConfig: null,
    transactionID: null,
    transactionTotalAmount: 0,
    gcTotalCardsQty: 0,
    selectedRsoName: null
  },
  acceptAdv: {
    orderNumber: { orderNo: 0, status: null },
    transactionTotalAmount: 0,
    transactionConfig: null,
    transactionID: null
  },
  grf: {
    orderNumber: { orderNo: 0, status: null },
    grfGoldWeight: 0,
    transactionTotalAmount: 0,
    transactionConfig: null,
    transactionID: null,
    hasError: null,
    isLoading: false,
    standardMetalPriceDetails: null
  },
  tep: {
    orderNumber: { orderNo: 0, status: null },
    tepTotalExchangeAmt: 0,
    tepTotalGrossWt: 0,
    tepTotalQty: 0,
    isTepRefundFormValid: false,
    tepSelectedPaymentMethod: null,
    selectedTepType: null,
    sendToCommercial: false,

    isTepRequestRaising: false,
    cutPieceTepTotalQuantity: 0,
    cutPieceTepTotalValue: 0,
    hasError: null,
    isLoading: false,
    standardMetalPriceDetails: null,
    transactionTotalAmount: 0,
    transactionConfig: null,
    transactionID: null,
    tepTotalRefundAmt: 0
  },
  walkins: {
    walksInsConversionCount: 0,
    walkInsCount: 0,
    isWalkInsFormInvalid: false
  },
  gep: {
    transactionTotalAmount: 0,
    transactionConfig: null,
    transactionID: null,
    orderNumber: { orderNo: 0, status: null },
    standardMetalPriceDetails: null,
    productQty: 0,
    coinQty: 0,
    productWeight: 0,
    coinWeight: 0,
    productDisc: 0,
    coinDisc: 0,
    productAmt: 0,
    coinAmt: 0,
    taxAmt: 0,
    totalAmt: 0,
    finalAmt: 0,
    roundOff: 0,
    componentInstance: null,
    totalDiscount: 0,
    totalQuantity: 0,
    totalWeight: 0
  },
  grn: {
    hasError: null,
    isLoading: false,
    grnStatus: null,
    totalReturnGrn: 0,
    totalReturnProducts: 0,
    productGroupDesc: null,
    imageUrlData: null,
    grnWorkflowFlag: true,
    creditNoteType: null
  },
  foc: {
    focItems: [],
    totalEligibleQty: 0,
    totalEligibleWt: 0
  },
  manualFoc: {
    manualFocItems: []
  },
  bill_cancellation: {
    productGroupDesc: null,
    imageUrlData: null,
    transactionTotalAmount: 0,
    transactionConfig: null,
    transactionID: null,
    occasionList: [],
    productQty: 0,
    coinQty: 0,
    productWeight: 0,
    coinWeight: 0,
    productDisc: 0,
    coinDisc: 0,
    productAmt: 0,
    coinAmt: 0,
    taxAmt: 0,
    totalAmt: 0,
    finalAmt: 0,
    roundOff: 0,
    hasError: null,
    isLoading: false,
    tcsCollectedAmount: 0,
    hallmarkCharges: 0,
    hallmarkDiscount: 0
  },
  discount: {
    discountDetails: null
  },
  inventory: {
    error: null,
    imageCatalogueDetails: null
  },
  co: {
    hasError: null,
    isLoading: false,
    minCOvalue: 0,
    productQty: 0,
    productWeight: 0,
    productDisc: 0,
    productAmt: 0,
    taxAmt: 0,
    finalAmt: 0,
    roundOff: 0,
    totalGrossWeight: 0,
    totalOrderValue: 0,
    orderNumber: { orderNo: 0, status: null },
    totalDiscount: 0,
    coinQty: 0,
    totalQuantity: 0,
    coinDisc: 0,
    totalAmt: 0,
    hallmarkCharges: 0,
    hallmarkDiscount: 0,
    totalWeight: 0,
    standardMetalPriceDetails: null,
    orderWeightDetails: null,
    minFrozenAmount: 0,
    frozen: null
  }
};

export function commonReducer(
  state: CommonState = initialState,
  action: CommonActions
): CommonState {
  switch (action.type) {
    case CommonActionTypes.LOAD_AB_STANDARD_METAL_PRICE_DETAILS:
      return {
        ...state
        // isLoading: true
      };
    case CommonActionTypes.LOAD_AB_STANDARD_METAL_PRICE_DETAILS_SUCCESS:
      return {
        ...state,
        ab: {
          ...state.ab,
          standardMetalPriceDetails: action.payload,
          isLoading: false
        }
      };
    case CommonActionTypes.LOAD_AB_STANDARD_METAL_PRICE_DETAILS_FAILURE:
      return {
        ...state,
        ab: {
          ...state.ab,
          hasError: action.payload,
          isLoading: false
        }
      };

    case CommonActionTypes.LOAD_CO_STANDARD_METAL_PRICE_DETAILS:
      return {
        ...state
        // isLoading: true
      };
    case CommonActionTypes.LOAD_CO_STANDARD_METAL_PRICE_DETAILS_SUCCESS:
      return {
        ...state,
        co: {
          ...state.co,
          standardMetalPriceDetails: action.payload,
          isLoading: false
        }
      };
    case CommonActionTypes.LOAD_CO_STANDARD_METAL_PRICE_DETAILS_FAILURE:
      return {
        ...state,
        co: {
          ...state.co,
          hasError: action.payload,
          isLoading: false
        }
      };

    case CommonActionTypes.LOAD_CM_STANDARD_METAL_PRICE_DETAILS:
      return {
        ...state
        // isLoading: true
      };
    case CommonActionTypes.LOAD_CM_STANDARD_METAL_PRICE_DETAILS_SUCCESS:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          standardMetalPriceDetails: action.payload,
          isLoading: false
        }
      };
    case CommonActionTypes.LOAD_CM_STANDARD_METAL_PRICE_DETAILS_FAILURE:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          hasError: action.payload,
          isLoading: false
        }
      };

    case CommonActionTypes.LOAD_TEP_STANDARD_METAL_PRICE_DETAILS:
      return {
        ...state,
        tep: {
          ...state.tep,
          standardMetalPriceDetails: null,
          isLoading: true
        }
      };
    case CommonActionTypes.LOAD_TEP_STANDARD_METAL_PRICE_DETAILS_SUCCESS:
      return {
        ...state,
        tep: {
          ...state.tep,
          standardMetalPriceDetails: action.payload,
          isLoading: false
        }
      };
    case CommonActionTypes.LOAD_TEP_STANDARD_METAL_PRICE_DETAILS_FAILURE:
      return {
        ...state,
        tep: { ...state.tep, hasError: action.payload, isLoading: false }
      };
    case CommonActionTypes.LOAD_GRF_STANDARD_METAL_PRICE_DETAILS:
      return {
        ...state
        // isLoading: true
      };
    case CommonActionTypes.LOAD_GRF_STANDARD_METAL_PRICE_DETAILS_SUCCESS:
      return {
        ...state,
        grf: {
          ...state.grf,
          standardMetalPriceDetails: action.payload,
          isLoading: false
        }
      };
    case CommonActionTypes.LOAD_GRF_STANDARD_METAL_PRICE_DETAILS_FAILURE:
      return {
        ...state,
        grf: {
          ...state.grf,
          hasError: action.payload,
          isLoading: false
        }
      };

    case CommonActionTypes.LOAD_AB_PRINT_DETAILS:
      return {
        ...state,
        ab: {
          ...state.ab,
          isLoading: true,
          hasError: null
        }
      };
    case CommonActionTypes.LOAD_AB_PRINT_DETAILS_SUCCESS:
      return {
        ...state,
        ab: {
          ...state.ab,
          isLoading: false,
          printData: action.payload
        }
      };
    case CommonActionTypes.LOAD_AB_PRINT_DETAILS_FAILURE:
      return {
        ...state,
        ab: {
          ...state.ab,
          hasError: action.payload,
          isLoading: false
        }
      };
    case CommonActionTypes.LOAD_CM_PRINT_DETAILS:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isLoading: true,
          hasError: null
        }
      };
    case CommonActionTypes.LOAD_CM_PRINT_DETAILS_SUCCESS:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isLoading: false,
          printData: action.payload
        }
      };
    case CommonActionTypes.LOAD_CM_PRINT_DETAILS_FAILURE:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          hasError: action.payload,
          isLoading: false
        }
      };

    case CommonActionTypes.LOAD_FAILED_INVOICE:
      return {
        ...state,
        invoice: {
          ...state.invoice,
          isLoading: true,
          hasError: null,
          failedInvoices: null
        }
      };
    case CommonActionTypes.LOAD_FAILED_INVOICE_SUCCESS:
      return {
        ...state,
        invoice: {
          ...state.invoice,
          isLoading: false,
          failedInvoices: action.payload
        }
      };
    case CommonActionTypes.LOAD_FAILED_INVOICE_FAILURE:
      return {
        ...state,
        invoice: {
          ...state.invoice,
          hasError: action.payload,
          isLoading: false
        }
      };
    // case CommonActionTypes.SET_TRANSACTION_TOTAL_AMOUNT:
    //   return {
    //     ...state,
    //     global: { ...state.global, transactionTotalAmount: action.payload }
    //   };
    case CommonActionTypes.SET_TRANSACTION_TOTAL_AMOUNT:
      return {
        ...state,
        global: {
          ...state.global,
          transactionTotalAmount: action.payload
        }
      };
    case CommonActionTypes.SET_CM_TRANSACTION_TOTAL_AMOUNT:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          transactionTotalAmount: action.payload
        }
      };

    case CommonActionTypes.SET_GC_TRANSACTION_TOTAL_AMOUNT:
      return {
        ...state,
        gc: {
          ...state.gc,
          transactionTotalAmount: action.payload
        }
      };
    case CommonActionTypes.SET_ACCEPT_ADVANCE_TRANSACTION_TOTAL_AMOUNT:
      return {
        ...state,
        acceptAdv: {
          ...state.acceptAdv,
          transactionTotalAmount: action.payload
        }
      };
    case CommonActionTypes.SET_GRF_TRANSACTION_TOTAL_AMOUNT:
      return {
        ...state,
        grf: { ...state.grf, transactionTotalAmount: action.payload }
      };
    case CommonActionTypes.SET_BILL_CANCELLATION_TRANSACTION_TOTAL_AMOUNT:
      return {
        ...state,
        bill_cancellation: {
          ...state.bill_cancellation,
          transactionTotalAmount: action.payload
        }
      };

    case CommonActionTypes.SET_TCS_COLLECTED_AMOUNT:
      return {
        ...state,
        bill_cancellation: {
          ...state.bill_cancellation,
          tcsCollectedAmount: action.payload
        }
      };

    case CommonActionTypes.SET_TCS_AMOUNT_NEED_TO_RESET:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          tcsAmountNeedToReset: action.payload
        }
      };

    // case CommonActionTypes.SET_TRANSACTION_ID:
    //   return {
    //     ...state,
    //     global: { ...state.global, transactionID: action.payload }
    //   };
    case CommonActionTypes.SET_TRANSACTION_ID:
      return {
        ...state,
        global: {
          ...state.global,
          transactionID: action.payload
        }
      };
    case CommonActionTypes.SET_CM_TRANSACTION_ID:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          transactionID: action.payload
        }
      };
    case CommonActionTypes.SET_BILL_CANCELLATION_TRANSACTION_ID:
      return {
        ...state,
        bill_cancellation: {
          ...state.bill_cancellation,
          transactionID: action.payload
        }
      };
    case CommonActionTypes.SET_GC_TRANSACTION_ID:
      return {
        ...state,
        gc: {
          ...state.gc,
          transactionID: action.payload
        }
      };
    case CommonActionTypes.SET_ACCEPT_ADVANCE_TRANSACTION_ID:
      return {
        ...state,
        acceptAdv: { ...state.acceptAdv, transactionID: action.payload }
      };
    case CommonActionTypes.SET_GEP_TRANSACTION_ID:
      return {
        ...state,
        gep: { ...state.gep, transactionID: action.payload }
      };
    case CommonActionTypes.SET_GRF_TRANSACTION_ID:
      return {
        ...state,
        grf: { ...state.grf, transactionID: action.payload }
      };
    case CommonActionTypes.SET_TCS_AMOUNT:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          tcsToBeCollected: action.payload
        }
      };

    case CommonActionTypes.CLEAR_TCS_AMOUNT:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          tcsToBeCollected: 0
        }
      };

    case CommonActionTypes.CLEAR_TCS_AMOUNT_NEED_TO_RESET:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          tcsAmountNeedToReset: false
        }
      };
    //TODO
    // case CommonActionTypes.PRINT_RECEIPT:
    // case CommonActionTypes.PRINT_RECEIPT_FAILURE:

    // case CommonActionTypes.LOAD_PRINT_DETAILS_FAILURE:
    //   return {
    //     ...state,
    //     isLoading: false,
    //     hasError: action.payload
    //   };

    case CommonActionTypes.CLEAR_TRANSACTION_ID:
      return {
        ...state,
        global: {
          ...state.global,
          transactionID: null
        }
      };
    case CommonActionTypes.CLEAR_CM_TRANSACTION_ID:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          transactionID: null,
          hasError: null
        }
      };
    case CommonActionTypes.CLEAR_AB_TRANSACTION_ID:
      return {
        ...state,
        ab: {
          ...state.ab,
          transactionID: null,
          hasError: null
        }
      };
    case CommonActionTypes.CLEAR_BILL_CANCELLATION_TRANSACTION_ID:
      return {
        ...state,
        bill_cancellation: {
          ...state.bill_cancellation,
          transactionID: null,
          hasError: null
        }
      };

    case CommonActionTypes.CLEAR_TCS_COLLECTED_AMOUNT:
      return {
        ...state,
        bill_cancellation: {
          ...state.bill_cancellation,
          tcsCollectedAmount: 0,
          hasError: null
        }
      };
    case CommonActionTypes.CLEAR_GC_TRANSACTION_ID:
      return {
        ...state,
        gc: {
          ...state.gc,
          transactionID: null
          // hasError: null
        }
      };
    case CommonActionTypes.CLEAR_ACCEPT_ADVANCE_TRANSACTION_ID:
      return {
        ...state,
        acceptAdv: {
          ...state.acceptAdv,
          transactionID: null
          // hasError: null
        }
      };
    case CommonActionTypes.CLEAR_GEP_TRANSACTION_ID:
      return {
        ...state,
        gep: {
          ...state.gep,
          transactionID: null
          // hasError: null
        }
      };
    case CommonActionTypes.CLEAR_GRF_TRANSACTION_ID:
      return {
        ...state,
        grf: {
          ...state.grf,
          transactionID: null
          // hasError: null
        }
      };

    case CommonActionTypes.CLEAR_TRANSACTION_CONFIG:
      return {
        ...state,
        global: {
          ...state.global,
          transactionID: null,
          transactionTotalAmount: 0,
          transactionConfig: null
        }
      };
    case CommonActionTypes.CLEAR_AB_TRANSACTION_CONFIG:
      return {
        ...state,
        ab: {
          ...state.ab,
          hasError: null,
          transactionID: null,
          transactionTotalAmount: 0,
          transactionConfig: null
        }
      };
    case CommonActionTypes.CLEAR_CM_TRANSACTION_CONFIG:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          hasError: null,
          transactionID: null,
          transactionTotalAmount: 0,
          transactionConfig: null
        }
      };
    case CommonActionTypes.CLEAR_GRF_TRANSACTION_CONFIG:
      return {
        ...state,
        grf: {
          ...state.grf,
          transactionID: null,
          transactionTotalAmount: 0,
          transactionConfig: null
        }
      };
    case CommonActionTypes.CLEAR_BILL_CANCELLATION_TRANSACTION_CONFIG:
      return {
        ...state,
        bill_cancellation: {
          ...state.bill_cancellation,
          transactionID: null,
          transactionTotalAmount: 0,
          transactionConfig: null
        }
      };
    case CommonActionTypes.CLEAR_GC_TRANSACTION_CONFIG:
      return {
        ...state,
        gc: {
          ...state.gc,
          // hasError: null,
          transactionID: null,
          transactionTotalAmount: 0,
          transactionConfig: null
        }
      };
    case CommonActionTypes.CLEAR_GEP_TRANSACTION_CONFIG:
      return {
        ...state,
        gep: {
          ...state.gep,
          // hasError: null,
          transactionID: null,
          transactionTotalAmount: 0,
          transactionConfig: null
        }
      };
    case CommonActionTypes.CLEAR_ACCEPT_ADVANCE_TRANSACTION_CONFIG:
      return {
        ...state,
        acceptAdv: {
          ...state.acceptAdv,
          // hasError: null,
          transactionID: null,
          transactionTotalAmount: 0,
          transactionConfig: null
        }
      };

    // case CommonActionTypes.SET_TRANSACTION_CONFIG:
    //   return {
    //     ...state,
    //     global: { ...state.global, transactionConfig: action.payload }
    //   };
    case CommonActionTypes.SET_TRANSACTION_CONFIG:
      return {
        ...state,
        global: {
          ...state.global,
          transactionConfig: action.payload
        }
      };
    case CommonActionTypes.SET_CM_TRANSACTION_CONFIG:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          transactionConfig: action.payload
        }
      };
    case CommonActionTypes.SET_GRF_TRANSACTION_CONFIG:
      return {
        ...state,
        grf: { ...state.grf, transactionConfig: action.payload }
      };
    case CommonActionTypes.SET_BILL_CANCELLATION_TRANSACTION_CONFIG:
      return {
        ...state,
        bill_cancellation: {
          ...state.bill_cancellation,
          transactionConfig: action.payload
        }
      };
    case CommonActionTypes.SET_GC_TRANSACTION_CONFIG:
      return {
        ...state,
        gc: {
          ...state.gc,
          transactionConfig: action.payload
        }
      };
    case CommonActionTypes.SET_GEP_TRANSACTION_CONFIG:
      return {
        ...state,
        gep: { ...state.gep, transactionConfig: action.payload }
      };
    case CommonActionTypes.SET_ACCEPT_ADVANCE_TRANSACTION_CONFIG:
      return {
        ...state,
        acceptAdv: { ...state.acceptAdv, transactionConfig: action.payload }
      };
    case CommonActionTypes.SET_AB_MIN_AB_VALUE:
      return {
        ...state,
        ab: {
          ...state.ab,
          minABvalue: action.payload
        }
      };

    case CommonActionTypes.SET_MIN_FROZEN_ORDER_VALUE:
      return {
        ...state,
        ab: {
          ...state.ab,
          minFrozenAmount: action.payload
        }
      };

    case CommonActionTypes.SET_MIN_FROZEN_CO_ORDER_VALUE:
      return {
        ...state,
        co: {
          ...state.co,
          minFrozenAmount: action.payload
        }
      };

    case CommonActionTypes.SET_AB_STATUS:
      return {
        ...state,
        ab: {
          ...state.ab,
          status: action.payload
        }
      };

    case CommonActionTypes.SET_AB_FROZEN_AB_VALUE:
      return {
        ...state,
        ab: {
          ...state.ab,
          frozen: action.payload
        }
      };

    case CommonActionTypes.SET_CO_FROZEN_CO_VALUE:
      return {
        ...state,
        co: {
          ...state.co,
          frozen: action.payload
        }
      };

    case CommonActionTypes.SET_AB_WEIGHT:
      return {
        ...state,
        ab: {
          ...state.ab,
          orderWeightDetails: action.payload
        }
      };

    case CommonActionTypes.SET_CO_WEIGHT:
      return {
        ...state,
        co: {
          ...state.co,
          orderWeightDetails: action.payload
        }
      };
    case CommonActionTypes.SET_CM_MIN_AB_VALUE:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          minABvalue: action.payload
        }
      };

    case CommonActionTypes.CLEAR_AB_TRANSACTION_CONFIG:
      return {
        ...state,
        ab: {
          ...state.ab,
          transactionConfig: null,
          printData: null
        }
      };
    case CommonActionTypes.CLEAR_CM_TRANSACTION_CONFIG:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          transactionConfig: null,
          printData: null
        }
      };
    case CommonActionTypes.CLEAR_BILL_CANCELLATION_TRANSACTION_CONFIG:
      return {
        ...state,
        bill_cancellation: {
          ...state.bill_cancellation,
          transactionConfig: null
          // printData: null
        }
      };

    case CommonActionTypes.LOAD_AB_PG_DESC:
      return {
        ...state,
        ab: {
          ...state.ab,
          isLoading: true,
          hasError: null
        }
      };

    case CommonActionTypes.LOAD_AB_PG_DESC_SUCCESS:
      return {
        ...state,
        ab: {
          ...state.ab,
          isLoading: false,
          productGroupDesc: action.payload
        }
      };

    case CommonActionTypes.LOAD_AB_PG_DESC_FAILURE:
      return {
        ...state,
        ab: {
          ...state.ab,
          isLoading: false,
          hasError: action.payload
        }
      };
    case CommonActionTypes.LOAD_CM_PG_DESC:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isLoading: true,
          hasError: null
        }
      };

    case CommonActionTypes.LOAD_CM_PG_DESC_SUCCESS:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isLoading: false,
          productGroupDesc: action.payload
        }
      };

    case CommonActionTypes.LOAD_CM_PG_DESC_FAILURE:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isLoading: false,
          hasError: action.payload
        }
      };

    case CommonActionTypes.LOAD_BILL_CANCELLATION_PG_DESC:
      return {
        ...state,
        bill_cancellation: {
          ...state.bill_cancellation,
          isLoading: true,
          hasError: null
        }
      };

    case CommonActionTypes.LOAD_BILL_CANCELLATION_PG_DESC_SUCCESS:
      return {
        ...state,
        bill_cancellation: {
          ...state.bill_cancellation,
          isLoading: false,
          productGroupDesc: action.payload
        }
      };

    case CommonActionTypes.LOAD_BILL_CANCELLATION_PG_DESC_FAILURE:
      return {
        ...state,
        bill_cancellation: {
          ...state.bill_cancellation,
          isLoading: false,
          hasError: action.payload
        }
      };

    case CommonActionTypes.LOAD_GRN_PG_DESC:
      return {
        ...state,
        grn: {
          ...state.grn,
          isLoading: true,
          hasError: null
        }
      };

    case CommonActionTypes.LOAD_GRN_PG_DESC_SUCCESS:
      return {
        ...state,
        grn: {
          ...state.grn,
          isLoading: false,
          productGroupDesc: action.payload
        }
      };

    case CommonActionTypes.LOAD_GRN_PG_DESC_FAILURE:
      return {
        ...state,
        grn: {
          ...state.grn,
          isLoading: false,
          hasError: action.payload
        }
      };

    case CommonActionTypes.LOAD_AB_IMAGE_URL:
      return {
        ...state,
        ab: {
          ...state.ab,
          isLoading: true,
          hasError: null,
          imageUrlData: null
        }
      };

    case CommonActionTypes.LOAD_AB_IMAGE_URL_SUCCESS:
      return {
        ...state,
        ab: {
          ...state.ab,
          imageUrlData: action.payload,
          hasError: null,
          isLoading: false
        }
      };
    case CommonActionTypes.LOAD_AB_IMAGE_URL_FAILURE:
      return {
        ...state,
        ab: {
          ...state.ab,
          isLoading: false,
          imageUrlData: action.payload
        }
      };

    case CommonActionTypes.LOAD_CM_IMAGE_URL:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isLoading: true,
          hasError: null,
          imageUrlData: null
        }
      };

    case CommonActionTypes.LOAD_CM_IMAGE_URL_SUCCESS:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          imageUrlData: action.payload,
          hasError: null,
          isLoading: false
        }
      };
    case CommonActionTypes.LOAD_CM_IMAGE_URL_FAILURE:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isLoading: false,
          imageUrlData: action.payload
        }
      };
    case CommonActionTypes.LOAD_BILL_CANCELLATION_IMAGE_URL:
      return {
        ...state,
        bill_cancellation: {
          ...state.bill_cancellation,
          isLoading: true,
          hasError: null,
          imageUrlData: null
        }
      };

    case CommonActionTypes.LOAD_BILL_CANCELLATION_IMAGE_URL_SUCCESS:
      return {
        ...state,
        bill_cancellation: {
          ...state.bill_cancellation,
          imageUrlData: action.payload,
          hasError: null,
          isLoading: false
        }
      };
    case CommonActionTypes.LOAD_BILL_CANCELLATION_IMAGE_URL_FAILURE:
      return {
        ...state,
        bill_cancellation: {
          ...state.bill_cancellation,
          isLoading: false,
          imageUrlData: action.payload
        }
      };
    case CommonActionTypes.LOAD_GRN_IMAGE_URL:
      return {
        ...state,
        grn: {
          ...state.grn,
          isLoading: true,
          hasError: null,
          imageUrlData: null
        }
      };

    case CommonActionTypes.LOAD_GRN_IMAGE_URL_SUCCESS:
      return {
        ...state,
        grn: {
          ...state.grn,
          imageUrlData: action.payload,
          hasError: null,
          isLoading: false
        }
      };
    case CommonActionTypes.LOAD_GRN_IMAGE_URL_FAILURE:
      return {
        ...state,
        grn: {
          ...state.grn,
          imageUrlData: action.payload,
          isLoading: false
        }
      };

    case CommonActionTypes.SET_HOLD_TIME:
      return {
        ...state,
        global: {
          ...state.global,

          configHoldTime: action.payload
        }
      };

    case CommonActionTypes.SET_FINAL_AMOUNT:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          finalAmt: action.payload
        }
      };

    case CommonActionTypes.SET_GRN_STATUS:
      return {
        ...state,
        grn: {
          ...state.grn,
          grnStatus: action.payload
        }
      };

    case CommonActionTypes.SET_GRN_TOTAL_RETURN_PRODUCTS:
      return {
        ...state,
        grn: {
          ...state.grn,
          totalReturnProducts: action.payload
        }
      };

    case CommonActionTypes.SET_GRN_TOTAL_RETURN_VALUE:
      return {
        ...state,
        grn: {
          ...state.grn,
          totalReturnGrn: action.payload
        }
      };

    case CommonActionTypes.SET_GRN_CREDIT_NOTE_TYPE:
      return {
        ...state,
        grn: {
          ...state.grn,
          creditNoteType: action.payload
        }
      };

    case CommonActionTypes.SET_GC_TOTAL_CARDS_QTY:
      return {
        ...state,
        gc: {
          ...state.gc,
          gcTotalCardsQty: action.payload
        }
      };

    case CommonActionTypes.SET_AB_SELECTED_RSO_NAME:
      return {
        ...state,
        ab: {
          ...state.ab,
          selectedRsoName: action.payload
        }
      };
    case CommonActionTypes.SET_CM_SELECTED_RSO_NAME:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          selectedRsoName: action.payload
        }
      };
    case CommonActionTypes.SET_GC_SELECTED_RSO_NAME:
      return {
        ...state,
        gc: {
          ...state.gc,
          selectedRsoName: action.payload
        }
      };

    case CommonActionTypes.SET_GRF_GOLD_WEIGHT:
      return {
        ...state,
        grf: { ...state.grf, grfGoldWeight: action.payload }
      };

    case CommonActionTypes.SET_WALK_INS_CONVERSION_COUNT:
      return {
        ...state,
        walkins: { ...state.walkins, walksInsConversionCount: action.payload }
      };

    case CommonActionTypes.SET_WALK_INS_COUNT:
      return {
        ...state,
        walkins: { ...state.walkins, walkInsCount: action.payload }
      };

    case CommonActionTypes.SET_IS_WALK_INS_FORM_INVALID:
      return {
        ...state,
        walkins: { ...state.walkins, isWalkInsFormInvalid: action.payload }
      };

    case CommonActionTypes.SET_TEP_TOTAL_EXCHANGE_AMOUNT:
      return {
        ...state,
        tep: { ...state.tep, tepTotalExchangeAmt: action.payload }
      };

    case CommonActionTypes.SET_TEP_TOTAL_REFUND_AMOUNT:
      return {
        ...state,
        tep: { ...state.tep, tepTotalRefundAmt: action.payload }
      };

    case CommonActionTypes.SET_TEP_TOTAL_GROSS_WEIGHT:
      return {
        ...state,
        tep: { ...state.tep, tepTotalGrossWt: action.payload }
      };

    case CommonActionTypes.SET_TEP_TOTAL_QTY:
      return {
        ...state,
        tep: { ...state.tep, tepTotalQty: action.payload }
      };

    case CommonActionTypes.SET_TEP_SELECTED_PAYMENT_METHOD:
      return {
        ...state,
        tep: { ...state.tep, tepSelectedPaymentMethod: action.payload }
      };

    case CommonActionTypes.SELECTED_TEP_TYPE:
      return {
        ...state,
        tep: { ...state.tep, selectedTepType: action.payload }
      };

    case CommonActionTypes.SET_IS_TEP_APPROVAL_VALID:
      return {
        ...state,
        tep: { ...state.tep, sendToCommercial: action.payload }
      };

    case CommonActionTypes.SET_IS_TEP_REFUND_FORM_VALID:
      return {
        ...state,
        tep: { ...state.tep, isTepRefundFormValid: action.payload }
      };

    case CommonActionTypes.SET_IS_TEP_REQUEST_RAISING:
      return {
        ...state,
        tep: { ...state.tep, isTepRequestRaising: action.payload }
      };

    case CommonActionTypes.SET_CUT_PIECE_TEP_TOTAL_QTY:
      return {
        ...state,
        tep: { ...state.tep, cutPieceTepTotalQuantity: action.payload }
      };

    case CommonActionTypes.SET_CUT_PIECE_TEP_TOTAL_VALUE:
      return {
        ...state,
        tep: { ...state.tep, cutPieceTepTotalValue: action.payload }
      };
    case CommonActionTypes.SET_MERGING_CNS:
      return {
        ...state,
        mergeGrf: { ...state.mergeGrf, mergeCNs: action.payload }
      };
    case CommonActionTypes.LOAD_MAX_CASH_LIMIT:
      return {
        ...state
      };
    case CommonActionTypes.LOAD_MAX_CASH_LIMIT_SUCCESS:
      return {
        ...state,
        mergeGrf: { ...state.mergeGrf, cashAmountMaxCap: action.payload }
      };
    case CommonActionTypes.LOAD_MAX_CASH_LIMIT_FAILURE:
      return {
        ...state,
        mergeGrf: { ...state.mergeGrf, hasError: action.payload }
      };
    case CommonActionTypes.SET_AB_DETAILS:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          abDetails: action.payload
        }
      };

    case CommonActionTypes.SET_PARTIAL_CM_DETAILS:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          partialCmDetails: action.payload
        }
      };

    case CommonActionTypes.LOAD_METAL_TYPES:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isLoading: true,
          hasError: null,
          metalType: []
        }
      };
    case CommonActionTypes.LOAD_TOLERANCE:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isLoading: true,
          hasError: null,
          tolerance: {
            data: null,
            itemType: null
          }
        }
      };

    case CommonActionTypes.LOAD_AB_TOLERANCE:
      return {
        ...state,
        ab: {
          ...state.ab,
          isLoading: true,
          hasError: null,
          tolerance: {
            data: null,
            itemType: null
          }
        }
      };

    case CommonActionTypes.LOAD_CM_GRF_TOLERANCE:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isLoading: true,
          hasError: null,
          grfTolerance: null
        }
      };

    case CommonActionTypes.LOAD_AB_GRF_TOLERANCE:
      return {
        ...state,
        ab: {
          ...state.ab,
          isLoading: true,
          hasError: null,
          grfTolerance: {
            data: null,
            itemType: null
          }
        }
      };

    case CommonActionTypes.LOAD_CM_GRN_TOLERANCE:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isLoading: true,
          hasError: null,
          grnTolerance: null
        }
      };

    case CommonActionTypes.LOAD_AB_GRN_TOLERANCE:
      return {
        ...state,
        ab: {
          ...state.ab,
          isLoading: true,
          hasError: null,
          grnTolerance: null
        }
      };

    case CommonActionTypes.LOAD_METAL_TYPES_SUCCESS:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isLoading: false,
          metalType: action.payload
        }
      };
    case CommonActionTypes.LOAD_METAL_TYPES_FAILURE:
    case CommonActionTypes.LOAD_TOLERANCE_FAILURE:
    case CommonActionTypes.LOAD_CM_GRF_TOLERANCE_FAILURE:
    case CommonActionTypes.LOAD_CM_GRN_TOLERANCE_FAILURE:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isLoading: false,
          hasError: action.payload
        }
      };

    case CommonActionTypes.LOAD_AB_GRF_TOLERANCE_FAILURE:
    case CommonActionTypes.LOAD_AB_GRN_TOLERANCE_FAILURE:
      return {
        ...state,
        ab: {
          ...state.ab,
          isLoading: false,
          hasError: action.payload
        }
      };

    case CommonActionTypes.LOAD_TOLERANCE_SUCCESS:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isLoading: false,
          tolerance: action.payload
        }
      };

    case CommonActionTypes.LOAD_AB_TOLERANCE_SUCCESS:
      return {
        ...state,
        ab: {
          ...state.ab,
          isLoading: false,
          tolerance: action.payload
        }
      };

    case CommonActionTypes.LOAD_CM_GRF_TOLERANCE_SUCCESS:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isLoading: false,
          grfTolerance: action.payload
        }
      };

    case CommonActionTypes.LOAD_AB_GRF_TOLERANCE_SUCCESS:
      return {
        ...state,
        ab: {
          ...state.ab,
          isLoading: false,
          grfTolerance: action.payload
        }
      };

    case CommonActionTypes.LOAD_CM_GRN_TOLERANCE_SUCCESS:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isLoading: false,
          grnTolerance: action.payload
        }
      };

    case CommonActionTypes.LOAD_AB_GRN_TOLERANCE_SUCCESS:
      return {
        ...state,
        ab: {
          ...state.ab,
          isLoading: false,
          grnTolerance: action.payload
        }
      };

    case CommonActionTypes.CLEAR_TOLERANCE:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          tolerance: {
            data: null,
            itemType: null
          },
          abDetails: null,
          hasError: null,
          metalType: []
        }
      };

    case CommonActionTypes.CLEAR_CM_GRF_TOLERANCE:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          grfTolerance: null,
          hasError: null
        }
      };

    case CommonActionTypes.CLEAR_AB_GRF_TOLERANCE:
      return {
        ...state,
        ab: {
          ...state.ab,
          grfTolerance: null,
          hasError: null
        }
      };

    case CommonActionTypes.CLEAR_CM_GRN_TOLERANCE:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          grnTolerance: null,
          hasError: null
        }
      };

    case CommonActionTypes.CLEAR_AB_GRN_TOLERANCE:
      return {
        ...state,
        ab: {
          ...state.ab,
          grnTolerance: null,
          hasError: null
        }
      };

    case CommonActionTypes.SET_CONFIGURATION_AMOUNT_ADAVNCE:
      return {
        ...state,
        mergeGrf: {
          ...state.mergeGrf,
          configAmountForAdv: action.payload.amount,
          isPanCardMan: action.payload.isPanCardMan
        }
      };

    case CommonActionTypes.SET_FOC_ITEMS:
      return {
        ...state,
        foc: {
          ...state.foc,
          focItems: action.payload
        }
      };
    case CommonActionTypes.SET_MANUAL_FOC_ITEMS:
      return {
        ...state,
        manualFoc: {
          ...state.manualFoc,
          manualFocItems: action.payload
        }
      };
    case CommonActionTypes.SET_FOC_ELIGIBLE_WT_AND_QTY:
      return {
        ...state,
        foc: {
          ...state.foc,
          totalEligibleQty: action.payload.qty,
          totalEligibleWt: action.payload.wt
        }
      };

    case CommonActionTypes.LOAD_AB_OCCASIONS:
      return { ...state, ab: { ...state.ab, isLoading: true, hasError: null } };
    case CommonActionTypes.LOAD_AB_OCCASIONS_SUCCESS:
      return {
        ...state,
        ab: {
          ...state.ab,
          occasionList: action.payload,
          hasError: null,
          isLoading: false
        }
      };
    case CommonActionTypes.LOAD_AB_OCCASIONS_FAILURE:
      return {
        ...state,
        ab: {
          ...state.ab,
          hasError: action.payload,
          isLoading: false
        }
      };
    case CommonActionTypes.LOAD_CM_OCCASIONS:
      return {
        ...state,
        cashMemo: { ...state.cashMemo, isLoading: true, hasError: null }
      };
    case CommonActionTypes.LOAD_CM_OCCASIONS_SUCCESS:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          occasionList: action.payload,
          hasError: null,
          isLoading: false
        }
      };
    case CommonActionTypes.LOAD_CM_OCCASIONS_FAILURE:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          hasError: action.payload,
          isLoading: false
        }
      };

    case CommonActionTypes.CLEAR_CASH_MEMO:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          productQty: 0,
          coinQty: 0,
          productWeight: 0,
          coinWeight: 0,
          productDisc: 0,
          coinDisc: 0,
          productAmt: 0,
          coinAmt: 0,
          taxAmt: 0,
          totalAmt: 0,
          occasionList: [],
          totalAmtInUi: 0,
          finalAmt: 0,
          roundOff: 0,
          orderNumber: { orderNo: 0, status: null },
          errorInUpdatePrice: false,
          isCMLegacy: false,
          ghsCustomerId: null
        }
      };
    case CommonActionTypes.CLEAR_ADVANCE_BOOKING:
      return {
        ...state,
        ab: {
          ...state.ab,
          productQty: 0,
          coinQty: 0,
          productWeight: 0,
          coinWeight: 0,
          productDisc: 0,
          coinDisc: 0,
          productAmt: 0,
          coinAmt: 0,
          taxAmt: 0,
          totalAmt: 0,
          occasionList: [],
          totalAmtInUi: 0,
          finalAmt: 0,
          roundOff: 0,
          hallmarkCharges: 0,
          hallmarkDiscount: 0,
          orderNumber: { orderNo: 0, status: null },
          errorInUpdatePrice: false,
          ghsCustomerId: null
        }
      };

    case CommonActionTypes.SET_CM_TOTAL_PRODUCT_VALUES:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          productQty: action.payload.productQty ? action.payload.productQty : 0,
          coinQty: action.payload.coinQty ? action.payload.coinQty : 0,
          productWeight: action.payload.productWeight
            ? action.payload.productWeight
            : 0,
          coinWeight: action.payload.coinWeight ? action.payload.coinWeight : 0,
          productDisc: action.payload.productDisc
            ? action.payload.productDisc
            : 0,
          coinDisc: action.payload.coinDisc ? action.payload.coinDisc : 0,
          productAmt: action.payload.productAmt ? action.payload.productAmt : 0,
          coinAmt: action.payload.coinAmt ? action.payload.coinAmt : 0,
          taxAmt: action.payload.taxAmt ? action.payload.taxAmt : 0,
          totalAmt: action.payload.totalAmt ? action.payload.totalAmt : 0,
          finalAmt: action.payload.finalAmt ? action.payload.finalAmt : 0,
          roundOff: action.payload.roundOff
            ? action.payload.roundOff > 0
              ? action.payload.roundOff
              : -action.payload.roundOff
            : 0,
          totalDiscount: action.payload.productDisc + action.payload.coinDisc,
          totalWeight: action.payload.productWeight + action.payload.coinWeight,
          totalQuantity: action.payload.productQty + action.payload.coinQty,
          hallmarkCharges: action.payload.hallmarkCharges
            ? action.payload.hallmarkCharges
            : 0,
          hallmarkDiscount: action.payload.hallmarkDiscount
            ? action.payload.hallmarkDiscount
            : 0
        }
      };

    case CommonActionTypes.SET_CM_ORDER_VALUES:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          taxAmt: action.payload.taxAmt ? action.payload.taxAmt : 0,
          totalAmt: action.payload.totalAmt ? action.payload.totalAmt : 0,
          finalAmt: action.payload.finalAmt ? action.payload.finalAmt : 0,
          roundOff: action.payload.roundOff
            ? action.payload.roundOff > 0
              ? action.payload.roundOff
              : -action.payload.roundOff
            : 0,
          hallmarkCharges: action.payload.hallmarkCharges
            ? action.payload.hallmarkCharges
            : 0,
          hallmarkDiscount: action.payload.hallmarkDiscount
            ? action.payload.hallmarkDiscount
            : 0
        }
      };

    case CommonActionTypes.SET_AB_TOTAL_PRODUCT_VALUES:
      return {
        ...state,
        ab: {
          ...state.ab,
          productQty: action.payload.productQty ? action.payload.productQty : 0,
          coinQty: action.payload.coinQty ? action.payload.coinQty : 0,
          productWeight: action.payload.productWeight
            ? action.payload.productWeight
            : 0,
          coinWeight: action.payload.coinWeight ? action.payload.coinWeight : 0,
          productDisc: action.payload.productDisc
            ? action.payload.productDisc
            : 0,
          coinDisc: action.payload.coinDisc ? action.payload.coinDisc : 0,
          productAmt: action.payload.productAmt ? action.payload.productAmt : 0,
          coinAmt: action.payload.coinAmt ? action.payload.coinAmt : 0,
          taxAmt: action.payload.taxAmt ? action.payload.taxAmt : 0,
          totalAmt: action.payload.totalAmt ? action.payload.totalAmt : 0,
          finalAmt: action.payload.finalAmt ? action.payload.finalAmt : 0,
          roundOff: action.payload.roundOff
            ? action.payload.roundOff > 0
              ? action.payload.roundOff
              : -action.payload.roundOff
            : 0,
          totalDiscount: action.payload.productDisc + action.payload.coinDisc,
          totalWeight: action.payload.productWeight + action.payload.coinWeight,
          totalQuantity: action.payload.productQty + action.payload.coinQty,
          hallmarkCharges: action.payload.hallmarkCharges
            ? action.payload.hallmarkCharges
            : 0,
          hallmarkDiscount: action.payload.hallmarkDiscount
            ? action.payload.hallmarkDiscount
            : 0
        }
      };

    case CommonActionTypes.SET_AB_FINAL_AMT:
      return {
        ...state,
        ab: { ...state.ab, finalAmt: action.payload }
      };

    case CommonActionTypes.SET_CM_FINAL_AMT:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          finalAmt: action.payload,
          taxAmt: action.taxValue,
          otherCharges: action.otherCharges
        }
      };

    case CommonActionTypes.SET_CM_OTHER_CHARGES:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          otherCharges: action.payload
        }
      };

    case CommonActionTypes.SET_BILL_CANCELLATION_TOTAL_PRODUCT_VALUES:
      return {
        ...state,
        bill_cancellation: {
          ...state.bill_cancellation,
          productQty: action.payload.productQty ? action.payload.productQty : 0,
          coinQty: action.payload.coinQty ? action.payload.coinQty : 0,
          productWeight: action.payload.productWeight
            ? action.payload.productWeight
            : 0,
          coinWeight: action.payload.coinWeight ? action.payload.coinWeight : 0,
          productDisc: action.payload.productDisc
            ? action.payload.productDisc
            : 0,
          coinDisc: action.payload.coinDisc ? action.payload.coinDisc : 0,
          productAmt: action.payload.productAmt ? action.payload.productAmt : 0,
          coinAmt: action.payload.coinAmt ? action.payload.coinAmt : 0,
          taxAmt: action.payload.taxAmt ? action.payload.taxAmt : 0,
          totalAmt: action.payload.totalAmt ? action.payload.totalAmt : 0,
          finalAmt: action.payload.finalAmt ? action.payload.finalAmt : 0,
          roundOff: action.payload.roundOff
            ? action.payload.roundOff > 0
              ? action.payload.roundOff
              : -action.payload.roundOff
            : 0,
          hallmarkCharges: action.payload.hallmarkCharges
            ? action.payload.hallmarkCharges
            : 0,
          hallmarkDiscount: action.payload.hallmarkDiscount
            ? action.payload.hallmarkDiscount
            : 0
        }
      };
    case CommonActionTypes.SET_GEP_TOTAL_PRODUCT_VALUES:
      return {
        ...state,
        gep: {
          ...state.gep,
          productQty: action.payload.productQty ? action.payload.productQty : 0,
          coinQty: action.payload.coinQty ? action.payload.coinQty : 0,
          productWeight: action.payload.productWeight
            ? action.payload.productWeight
            : 0,
          coinWeight: action.payload.coinWeight ? action.payload.coinWeight : 0,
          productDisc: action.payload.productDisc
            ? action.payload.productDisc
            : 0,
          coinDisc: action.payload.coinDisc ? action.payload.coinDisc : 0,
          productAmt: action.payload.productAmt ? action.payload.productAmt : 0,
          coinAmt: action.payload.coinAmt ? action.payload.coinAmt : 0,
          taxAmt: action.payload.taxAmt ? action.payload.taxAmt : 0,
          totalAmt: action.payload.totalAmt ? action.payload.totalAmt : 0,
          finalAmt: action.payload.finalAmt ? action.payload.finalAmt : 0,
          roundOff: action.payload.roundOff
            ? action.payload.roundOff > 0
              ? action.payload.roundOff
              : -action.payload.roundOff
            : 0,
          totalDiscount: action.payload.productDisc + action.payload.coinDisc,
          totalWeight: action.payload.productWeight + action.payload.coinWeight,
          totalQuantity: action.payload.productQty + action.payload.coinQty
        }
      };

    case CommonActionTypes.SET_CM_ORDER_NUMBER:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          orderNumber: action.payload
        }
      };
    case CommonActionTypes.SET_AB_ORDER_NUMBER:
      return {
        ...state,
        ab: {
          ...state.ab,
          orderNumber: action.payload
        }
      };
    case CommonActionTypes.SET_GEP_ORDER_NUMBER:
      return {
        ...state,
        gep: { ...state.gep, orderNumber: action.payload }
      };
    case CommonActionTypes.SET_GC_ORDER_NUMBER:
      return {
        ...state,
        gc: { ...state.gc, orderNumber: action.payload }
      };
    case CommonActionTypes.SET_GRF_ORDER_NUMBER:
      return {
        ...state,
        grf: { ...state.grf, orderNumber: action.payload }
      };
    case CommonActionTypes.SET_ACCEPT_ADVANCE_ORDER_NUMBER:
      return {
        ...state,
        acceptAdv: { ...state.acceptAdv, orderNumber: action.payload }
      };
    case CommonActionTypes.SET_TEP_ORDER_NUMBER:
      return {
        ...state,
        tep: { ...state.tep, orderNumber: action.payload }
      };
    case CommonActionTypes.SET_COMPONENT_INSTANCE:
      return {
        ...state,
        gep: { ...state.gep, componentInstance: action.payload }
      };

    case CommonActionTypes.SET_AB_ERROR_IN_UPDATE_PRICE:
      return {
        ...state,
        ab: {
          ...state.ab,
          isLoading: false,
          errorInUpdatePrice: action.payload
        }
      };
    case CommonActionTypes.DISABLE_FULL_PAYMENT_CHECK:
      return {
        ...state,
        global: { ...state.global, disableFullPaymentCheck: action.payload }
      };
    case CommonActionTypes.SET_CM_ERROR_IN_UPDATE_PRICE:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isLoading: false,
          errorInUpdatePrice: action.payload
        }
      };
    case CommonActionTypes.SET_SAME_MERGE_GRF_CUSTOMER:
      return {
        ...state,
        mergeGrf: { ...state.mergeGrf, isSameCustomer: action.payload }
      };
    case CommonActionTypes.SET_FILE_UPLOAD_VISIBLE:
      return {
        ...state,
        global: { ...state.global, isFileUploadVisible: action.payload }
      };
    case CommonActionTypes.SET_DISCOUNT_DETAILS:
      return {
        ...state,
        discount: { ...state.discount, discountDetails: action.payload }
      };
    case CommonActionTypes.SET_GRN_WORKFLOW_FLAG:
      return {
        ...state,
        grn: {
          ...state.grn,
          grnWorkflowFlag: action.payload
        }
      };
    case CommonActionTypes.CLOSE_TOLERANCE:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          closeTolerance: action.payload
        }
      };
    // Inventory Image Loading
    case CommonActionTypes.LOAD_IMAGE_CATALOGUE_DETAILS:
      return {
        ...state,
        inventory: {
          ...state.inventory,
          error: null,
          imageCatalogueDetails: null
        }
      };

    case CommonActionTypes.LOAD_IMAGE_CATALOGUE_DETAILS_SUCCESS:
      return {
        ...state,
        inventory: {
          ...state.inventory,
          error: null,
          imageCatalogueDetails: action.payload
        }
      };

    case CommonActionTypes.SET_CM_GHS_CUSTOMER_ID:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          ghsCustomerId: action.payload
        }
      };

    case CommonActionTypes.SET_AB_GHS_CUSTOMER_ID:
      return {
        ...state,
        ab: {
          ...state.ab,
          ghsCustomerId: action.payload
        }
      };

    case CommonActionTypes.SET_CM_IS_LEGACY:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isCMLegacy: action.payload
        }
      };

    case CommonActionTypes.LOAD_IMAGE_CATALOGUE_DETAILS_FAILURE:
      return {
        ...state,
        inventory: {
          ...state.inventory,
          error: action.payload,
          imageCatalogueDetails: null
        }
      };
    case CommonActionTypes.SET_IS_IGST_FLAG:
      return {
        ...state,
        cashMemo: {
          ...state.cashMemo,
          isIGSTFlag: action.payload
        }
      };
  }

  switch (action.type) {
    case CommonActionTypes.SET_CO_TOTAL_PRODUCT_VALUES:
      return {
        ...state,
        co: {
          ...state.co,
          productQty: action.payload.productQty ? action.payload.productQty : 0,
          productWeight: action.payload.productWeight
            ? action.payload.productWeight
            : 0,
          productDisc: action.payload.productDisc
            ? action.payload.productDisc
            : 0,
          productAmt: action.payload.productAmt ? action.payload.productAmt : 0,
          taxAmt: action.payload.taxAmt ? action.payload.taxAmt : 0,
          finalAmt: action.payload.finalAmt ? action.payload.finalAmt : 0,
          coinQty: action.payload.coinQty ? action.payload.coinQty : 0,
          coinDisc: action.payload.coinDisc ? action.payload.coinDisc : 0,
          roundOff: action.payload.roundOff
            ? action.payload.roundOff > 0
              ? action.payload.roundOff
              : -action.payload.roundOff
            : 0,
          totalGrossWeight: action.payload.totalGrossWeight
            ? action.payload.totalGrossWeight
            : 0,
          totalOrderValue: action.payload.totalOrderValue
            ? action.payload.totalOrderValue
            : 0,
          totalQuantity: action.payload.productQty + action.payload.coinQty,
          totalDiscount: action.payload.productDisc + action.payload.coinDisc,
          totalAmt: action.payload.totalAmt ? action.payload.totalAmt : 0,
          hallmarkCharges: action.payload.hallmarkCharges
            ? action.payload.hallmarkCharges
            : 0,
          hallmarkDiscount: action.payload.hallmarkDiscount
            ? action.payload.hallmarkDiscount
            : 0,
          totalWeight: action.payload.productWeight
        }
      };

    case CommonActionTypes.SET_MIN_CO_VALUE:
      return {
        ...state,
        co: {
          ...state.co,
          minCOvalue: action.payload
        }
      };

    case CommonActionTypes.CLEAR_CUSTOMER_ORDER:
      return {
        ...state,
        co: {
          ...state.co,
          productQty: 0,
          productWeight: 0,
          productDisc: 0,
          productAmt: 0,
          taxAmt: 0,
          finalAmt: 0,
          roundOff: 0,
          orderNumber: { orderNo: 0, status: null },
          minCOvalue: 0,
          totalGrossWeight: 0,
          totalOrderValue: 0,
          totalDiscount: 0,
          coinQty: 0,
          totalQuantity: 0,
          coinDisc: 0,
          totalAmt: 0,
          hallmarkCharges: 0,
          hallmarkDiscount: 0,
          totalWeight: 0,
          standardMetalPriceDetails: null,
          orderWeightDetails: null,
          minFrozenAmount: 0,
          frozen: null
        }
      };

    case CommonActionTypes.SET_CO_ORDER_NUMBER:
      return {
        ...state,
        co: {
          ...state.co,
          orderNumber: action.payload
        }
      };

    case CommonActionTypes.LOAD_COPIED_INVOICE_DOCUMENT:
      return {
        ...state,
        invoice: {
          ...state.invoice,
          isLoading: true,
          hasError: null,
          isCopyInvoiceDocument: false
        }
      };
    case CommonActionTypes.LOAD_COPIED_INVOICE_DOCUMENT_SUCCESS:
      return {
        ...state,
        invoice: {
          ...state.invoice,
          isLoading: false,
          isCopyInvoiceDocument: action.payload
        }
      };
    case CommonActionTypes.LOAD_COPIED_INVOICE_DOCUMENT_FAILURE:
      return {
        ...state,
        invoice: {
          ...state.invoice,
          hasError: action.payload,
          isLoading: false
        }
      };
    case CommonActionTypes.RESET_INVOICES:
      return {
        ...state,
        invoice: {
          ...state.invoice,
          hasError: null,
          isLoading: false,
          isCopyInvoiceDocument: false,
          failedInvoices: null
        }
      };
  }

  return state;
}
