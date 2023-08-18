import { Action } from '@ngrx/store';
import {
  AbToleranceConfigMetalType,
  AdvanceBookingDetailsResponse,
  CashMemoDetailsResponse,
  CreditNote,
  CustomErrors,
  ImageUrlData,
  Lov,
  PrintPayload,
  SetCOTotalProductValuesPayload,
  SetOrderValuesPayload,
  SetTotalProductValuesPayload,
  StatusTypesEnum,
  TolerancePayload,
  TransactionConfig
} from '@poss-web/shared/models';

export enum CommonActionTypes {
  LOAD_AB_STANDARD_METAL_PRICE_DETAILS = '[Common]Load AB Standard Metal Price Details',
  LOAD_AB_STANDARD_METAL_PRICE_DETAILS_SUCCESS = '[Common]Load AB Standard Metal Price Details Success',
  LOAD_AB_STANDARD_METAL_PRICE_DETAILS_FAILURE = '[Common]Load AB Standard Metal Price Details Failure',

  LOAD_CO_STANDARD_METAL_PRICE_DETAILS = '[Common]Load CO Standard Metal Price Details',
  LOAD_CO_STANDARD_METAL_PRICE_DETAILS_SUCCESS = '[Common]Load CO Standard Metal Price Details Success',
  LOAD_CO_STANDARD_METAL_PRICE_DETAILS_FAILURE = '[Common]Load CO Standard Metal Price Details Failure',

  LOAD_CM_STANDARD_METAL_PRICE_DETAILS = '[Common]Load CM Standard Metal Price Details',
  LOAD_CM_STANDARD_METAL_PRICE_DETAILS_SUCCESS = '[Common]Load CM Standard Metal Price Details Success',
  LOAD_CM_STANDARD_METAL_PRICE_DETAILS_FAILURE = '[Common]Load CM Standard Metal Price Details Failure',

  LOAD_TEP_STANDARD_METAL_PRICE_DETAILS = '[Common]Load TEP Standard Metal Price Details',
  LOAD_TEP_STANDARD_METAL_PRICE_DETAILS_SUCCESS = '[Common]Load TEP Standard Metal Price Details Success',
  LOAD_TEP_STANDARD_METAL_PRICE_DETAILS_FAILURE = '[Common]Load TEP Standard Metal Price Details Failure',

  LOAD_GRF_STANDARD_METAL_PRICE_DETAILS = '[Common]Load GRF Standard Metal Price Details',
  LOAD_GRF_STANDARD_METAL_PRICE_DETAILS_SUCCESS = '[Common]Load GRF Standard Metal Price Details Success',
  LOAD_GRF_STANDARD_METAL_PRICE_DETAILS_FAILURE = '[Common]Load GRF Standard Metal Price Details Failure',

  SET_TRANSACTION_ID = '[Common] Set Transaction ID',
  SET_AB_TRANSACTION_ID = '[Common] Set AB Transaction ID',
  SET_CM_TRANSACTION_ID = '[Common] Set CM Transaction ID',
  SET_BILL_CANCELLATION_TRANSACTION_ID = '[Common] Set Bill Cancellation Transaction ID',
  SET_GC_TRANSACTION_ID = '[Common] Set GC Transaction ID',
  SET_ACCEPT_ADVANCE_TRANSACTION_ID = '[Common] Set Accept Advance Transaction ID',
  SET_GEP_TRANSACTION_ID = '[Common] Set GEP Transaction ID',
  SET_GRF_TRANSACTION_ID = '[Common] Set GRF Transaction ID',
  SET_TEP_TRANSACTION_ID = '[Common] Set TEP Transaction ID',
  SET_TCS_COLLECTED_AMOUNT = '[Common] Set Tcs Collected Amount',

  SET_TRANSACTION_TOTAL_AMOUNT = '[Common] Set Transaction Total amount',
  SET_AB_TRANSACTION_TOTAL_AMOUNT = '[Common] Set AB Transaction Total amount',
  SET_CM_TRANSACTION_TOTAL_AMOUNT = '[Common] Set CM Transaction Total amount',
  SET_GC_TRANSACTION_TOTAL_AMOUNT = '[Common] Set GC Transaction Total amount',
  SET_ACCEPT_ADVANCE_TRANSACTION_TOTAL_AMOUNT = '[Common] Set Accept AdvanceTransaction Total amount',
  SET_GRF_TRANSACTION_TOTAL_AMOUNT = '[Common] Set GRF Transaction Total amount',
  SET_BILL_CANCELLATION_TRANSACTION_TOTAL_AMOUNT = '[Common] Set Bill Cancellation Transaction Total amount',

  SET_TRANSACTION_CONFIG = '[Common] Set Transaction Config',
  SET_AB_TRANSACTION_CONFIG = '[Common] Set AB Transaction Config',
  SET_CM_TRANSACTION_CONFIG = '[Common] Set CM Transaction Config',
  SET_GRF_TRANSACTION_CONFIG = '[Common] Set GRF Transaction Config',
  SET_BILL_CANCELLATION_TRANSACTION_CONFIG = '[Common] Set Bill Cancellation Transaction Config',
  SET_GC_TRANSACTION_CONFIG = '[Common] Set GC Transaction Config',
  SET_GEP_TRANSACTION_CONFIG = '[Common] Set GEP Transaction Config',
  SET_ACCEPT_ADVANCE_TRANSACTION_CONFIG = '[Common] Set Accept Advance Transaction Config',
  SET_TEP_TRANSACTION_CONFIG = '[Common] Set TEP Transaction Config',

  SET_CM_MIN_AB_VALUE = '[Common] Set-CM Min AB Value',
  SET_AB_MIN_AB_VALUE = '[Common] Set-AB Min AB Value',
  SET_AB_FROZEN_AB_VALUE = '[Common] Set-AB Frozen AB Value',
  SET_CO_FROZEN_CO_VALUE = '[Common] Set-CO Frozen CO Value',
  SET_MIN_FROZEN_ORDER_VALUE = '[Common] Set-AB MIn Frozen Order Value',
  SET_MIN_FROZEN_CO_ORDER_VALUE = '[Common] Set-CO MIn Frozen Order Value',
  SET_AB_STATUS = '[Common] Set-AB Status',
  SET_TCS_AMOUNT = '[Common] Set TCS Amount',
  SET_TCS_AMOUNT_NEED_TO_RESET = '[Common] Set TCS Amount need to Reset',
  CLEAR_TCS_AMOUNT_NEED_TO_RESET = '[Common] Clear TCS Amount need to Reset',
  SET_AB_WEIGHT = '[Common] Set-AB Weight',
  SET_CO_WEIGHT = '[Common] Set-CO Weight',

  CLEAR_TRANSACTION_ID = '[Common] Clear Transaction ID',
  CLEAR_TRANSACTION_CONFIG = '[Common] Clear Transaction Config',

  CLEAR_TOLERANCE = '[Common] Clear Tolerance',
  CLEAR_AB_TRANSACTION_ID = '[Common] Clear AB Transaction ID',
  CLEAR_CM_TRANSACTION_ID = '[Common] Clear CM Transaction ID',
  CLEAR_BILL_CANCELLATION_TRANSACTION_ID = '[Common] Clear Bill Cancellation Transaction ID',
  CLEAR_GC_TRANSACTION_ID = '[Common] Clear GC Transaction ID',
  CLEAR_ACCEPT_ADVANCE_TRANSACTION_ID = '[Common] Clear Accept Advance Transaction ID',
  CLEAR_GEP_TRANSACTION_ID = '[Common] Clear GEP Transaction ID',
  CLEAR_GRF_TRANSACTION_ID = '[Common] Clear GRF Transaction ID',
  CLEAR_TEP_TRANSACTION_ID = '[Common] Clear TEP Transaction ID',

  CLEAR_AB_TRANSACTION_CONFIG = '[Common] Clear AB Transaction Config',
  CLEAR_CM_TRANSACTION_CONFIG = '[Common] Clear CM Transaction Config',
  CLEAR_GC_TRANSACTION_CONFIG = '[Common] Clear GC Transaction Config',
  CLEAR_ACCEPT_ADVANCE_TRANSACTION_CONFIG = '[Common] Clear Accept Advance Transaction Config',
  CLEAR_GRF_TRANSACTION_CONFIG = '[Common] Clear GRF Transaction Config',
  CLEAR_BILL_CANCELLATION_TRANSACTION_CONFIG = '[Common] Clear Bill Cancellation Transaction Config',
  CLEAR_GEP_TRANSACTION_CONFIG = '[Common] Clear GEP Transaction Config',
  CLEAR_TEP_TRANSACTION_CONFIG = '[Common] Clear TEP Transaction Config',
  CLEAR_TCS_AMOUNT = '[Common] Clear TCS Amount',
  CLEAR_TCS_COLLECTED_AMOUNT = '[Common] Clear Tcs Collected Amount',

  CLEAR_CM_GRF_TOLERANCE = '[Common] Clear CM Grf Tolerance',
  CLEAR_AB_GRF_TOLERANCE = '[Common] Clear AB Grf Tolerance',
  CLEAR_CM_GRN_TOLERANCE = '[Common] Clear CM Grn Tolerance',
  CLEAR_AB_GRN_TOLERANCE = '[Common] Clear AB Grn Tolerance',

  //Not FOund
  LOAD_CONFIG_DETAILS = '[Common] Load Config Details',
  LOAD_CONFIG_DETAILS_SUCCESS = '[Common] Load Config Details Success',
  LOAD_CONFIG_DETAILS_FAILURE = '[Common] Load Config Details Failure',

  LOAD_CM_PG_DESC = '[Common Load CM PG Desc',
  LOAD_CM_PG_DESC_SUCCESS = '[Common]  Load CM PG Desc Success',
  LOAD_CM_PG_DESC_FAILURE = '[Common]  Load CM PG Desc Failure',

  LOAD_AB_PG_DESC = '[Common Load AB PG Desc',
  LOAD_AB_PG_DESC_SUCCESS = '[Common]  Load AB PG Desc Success',
  LOAD_AB_PG_DESC_FAILURE = '[Common]  Load AB PG Desc Failure',

  LOAD_GRN_PG_DESC = '[Common Load GRN PG Desc',
  LOAD_GRN_PG_DESC_SUCCESS = '[Common]  Load GRN PG Desc Success',
  LOAD_GRN_PG_DESC_FAILURE = '[Common]  Load GRN PG Desc Failure',

  LOAD_BILL_CANCELLATION_PG_DESC = '[Common Load Bill Cancellation PG Desc',
  LOAD_BILL_CANCELLATION_PG_DESC_SUCCESS = '[Common]  Load Bill Cancellation PG Desc Success',
  LOAD_BILL_CANCELLATION_PG_DESC_FAILURE = '[Common]  Load Bill Cancellation PG Desc Failure',

  LOAD_AB_IMAGE_URL = '[Common Product] Load AB Image Url',
  LOAD_AB_IMAGE_URL_SUCCESS = '[Common Product]  Load AB Image Url Success',
  LOAD_AB_IMAGE_URL_FAILURE = '[Common Product]  Load AB Image Url Failure',

  LOAD_CM_IMAGE_URL = '[Common Product] Load CM Image Url',
  LOAD_CM_IMAGE_URL_SUCCESS = '[Common Product]  Load CM Image Url Success',
  LOAD_CM_IMAGE_URL_FAILURE = '[Common Product]  Load CM Image Url Failure',

  LOAD_GRF_IMAGE_URL = '[Common Product] Load GRF Image Url',
  LOAD_GRF_IMAGE_URL_SUCCESS = '[Common Product]  Load GRF Image Url Success',
  LOAD_GRF_IMAGE_URL_FAILURE = '[Common Product]  Load GRF Image Url Failure',

  LOAD_GRN_IMAGE_URL = '[Common Product] Load GRN Image Url',
  LOAD_GRN_IMAGE_URL_SUCCESS = '[Common Product]  Load GRN Image Url Success',
  LOAD_GRN_IMAGE_URL_FAILURE = '[Common Product]  Load GRN Image Url Failure',

  LOAD_BILL_CANCELLATION_IMAGE_URL = '[Common Product] Load Bill Cancellation Image Url',
  LOAD_BILL_CANCELLATION_IMAGE_URL_SUCCESS = '[Common Product]  Load Bill Cancellation Image Url Success',
  LOAD_BILL_CANCELLATION_IMAGE_URL_FAILURE = '[Common Product]  Load Bill Cancellation Image Url Failure',
  //Print to check
  LOAD_AB_PRINT_DETAILS = '[Common Advance Booking] LOAD AB PRINT DETAILS',
  LOAD_AB_PRINT_DETAILS_SUCCESS = '[Advance Booking] LOAD AB PRINT DETAILS Success',
  LOAD_AB_PRINT_DETAILS_FAILURE = '[Advance Booking] LOAD AB PRINT DETAILS Failure',

  LOAD_CM_PRINT_DETAILS = 'Common Advance Booking] LOAD CM PRINT DETAILS',
  LOAD_CM_PRINT_DETAILS_SUCCESS = '[Common Advance Booking] LOAD CM PRINT DETAILS Success',
  LOAD_CM_PRINT_DETAILS_FAILURE = '[Common Advance Booking] LOAD CM PRINT DETAILS Failure',

  LOAD_FAILED_INVOICE = 'Common] LOAD Failed Invoices',
  LOAD_FAILED_INVOICE_SUCCESS = '[Common] LOAD Failed Invoices Success',
  LOAD_FAILED_INVOICE_FAILURE = '[Common] LOAD Failed Invoices Failure',

  LOAD_COPIED_INVOICE_DOCUMENT = 'Common] LOAD Copied Invoices',
  LOAD_COPIED_INVOICE_DOCUMENT_SUCCESS = '[Common] LOAD Copied Invoices Success',
  LOAD_COPIED_INVOICE_DOCUMENT_FAILURE = '[Common] LOAD Copied Invoices Failure',

  TRIGGER_FAILED_INVOICE = '[Common] Trigger Failed Invoices',
  TRIGGER_FAILED_INVOICE_SUCCESS = '[Common] Trigger Failed Invoices Success',
  TRIGGER_FAILED_INVOICE_FAILURE = '[Common] Trigger Failed Invoices Failure',

  //TODO Not FoundT
  PRINT_RECEIPT = '[Common] Print Receipt',
  PRINT_RECEIPT_SUCCESS = '[Common]Print Receipt Success',
  PRINT_RECEIPT_FAILURE = '[Common]Print Receipt Failure',

  SET_HOLD_TIME = '[Product] Set AB Hold Time',

  // SET_CM_HOLD_TIME = '[Product] Set AB Hold Time',
  // SET_AB_HOLD_TIME = '[Product] Set CM Hold Time',
  // SET_GEP_HOLD_TIME = '[Product] Set GEP Hold Time',
  //TODO NOT Found
  GET_HOLD_TIME = '[Product] Get Hold Time',

  SET_GRN_STATUS = '[Grn]Set grn status',
  SET_GRN_TOTAL_RETURN_PRODUCTS = '[Grn] Set Grn total return products',
  SET_GRN_TOTAL_RETURN_VALUE = '[Grn] Set Grn total return grn value',
  SET_GRN_CREDIT_NOTE_TYPE = '[Grn] Set GRN Credit Note Type',

  SET_GC_TOTAL_CARDS_QTY = '[GC] Set Gc Total Cards Qty',
  //TO CHECK
  SET_CM_SELECTED_RSO_NAME = '[GC] Set CM Selected Rso Name',
  SET_AB_SELECTED_RSO_NAME = '[GC] Set AB Selected Rso Name',
  SET_GC_SELECTED_RSO_NAME = '[GC] Set GC Selected Rso Name',

  SET_GRF_GOLD_WEIGHT = '[GRF] Set Grf Gold Weight',

  SET_WALK_INS_COUNT = '[Walk-ins] Set Walk In Count',
  SET_IS_WALK_INS_FORM_INVALID = '[Walk-ins] Set Is Walk Ins Form Invalid',
  SET_WALK_INS_CONVERSION_COUNT = '[Walk-ins] Set Walk Ins Conversion Count',

  SET_TEP_TOTAL_QTY = '[TEP] Set Tep Total Qty',
  SET_TEP_TOTAL_GROSS_WEIGHT = '[TEP] Set Tep Total Gross Wt',
  SET_TEP_TOTAL_EXCHANGE_AMOUNT = '[TEP] Set Tep Total Exchange Amount',
  SET_TEP_TOTAL_REFUND_AMOUNT = '[TEP] Set Tep Total Refund Amount',
  SET_IS_TEP_REFUND_FORM_VALID = '[TEP] Set Is Tep Refund Form Valid',
  SET_IS_TEP_APPROVAL_VALID = '[TEP] Set Is Tep Approval Valid',
  SET_TEP_SELECTED_PAYMENT_METHOD = '[TEP] Set Tep Selected Payment Method',
  SELECTED_TEP_TYPE = '[TEP] Selected Tep Type',
  SET_IS_TEP_REQUEST_RAISING = '[TEP] Set Is Tep Request Raising',
  SET_CUT_PIECE_TEP_TOTAL_QTY = '[TEP] Set Cut Piece Tep Total Qty',
  SET_CUT_PIECE_TEP_TOTAL_VALUE = '[TEP] Set Cut Piece Tep Total Value',

  SET_MERGING_CNS = '[MERGE CN TEP] Set Merging CNs',

  LOAD_MAX_CASH_LIMIT = '[Common] Load Max Cash Limit',
  LOAD_MAX_CASH_LIMIT_SUCCESS = '[Common]Load Max Cash Limit Success',
  LOAD_MAX_CASH_LIMIT_FAILURE = '[Common]Load Max Cash Limit Failure',

  SET_CONFIGURATION_AMOUNT_ADAVNCE = '[Common]Set Configuration Amount Advance',

  SET_FOC_ITEMS = '[FOC-Common] Set FOC Items',
  SET_MANUAL_FOC_ITEMS = '[FOC-Common] Set Manual FOC Items',
  SET_FOC_ELIGIBLE_WT_AND_QTY = '[FOC-Common] Set FOC Eligible Weight and Qty',
  // cm
  //to check
  LOAD_AB_OCCASIONS = '[Cash Memo] Load AB Occasions',
  LOAD_AB_OCCASIONS_SUCCESS = '[Cash Memo] Load AB Occasions Success',
  LOAD_AB_OCCASIONS_FAILURE = '[Cash Memo] Load AB Occasions Failure',

  LOAD_CM_OCCASIONS = '[Cash Memo] Load CM Occasions',
  LOAD_CM_OCCASIONS_SUCCESS = '[Cash Memo] Load CM Occasions Success',
  LOAD_CM_OCCASIONS_FAILURE = '[Cash Memo] Load CM Occasions Failure',

  CLEAR_CASH_MEMO = '[ Cash Memo] Clear  Cash Memo',
  CLEAR_ADVANCE_BOOKING = '[Common] Clear  Advance Booking Memo',
  CONFRIM_CASH_MEMO = '[ Cash Memo] Confrim  Cash Memo',
  HOLD_CASH_MEMO = '[ Cash Memo] Hold  Cash Memo',
  CONVERT_TO_ADVANCE = '[ Cash Memo] Convert to Advance',

  SET_CM_GHS_CUSTOMER_ID = '[Cash Memo] Set CM GHS Customer Id',

  //TO CHECK
  SET_AB_TOTAL_PRODUCT_VALUES = '[Cash Memo] Set AB Total Product Values',
  SET_CM_TOTAL_PRODUCT_VALUES = '[Cash Memo] Set CM Total Product Values',
  SET_CM_ORDER_VALUES = '[Cash Memo] Set CM Order Values',
  SET_BILL_CANCELLATION_TOTAL_PRODUCT_VALUES = '[Cash Memo] Set Bill Cancellation Total Product Values',
  SET_GEP_TOTAL_PRODUCT_VALUES = '[Cash Memo] Set GEP Total Product Values',

  //TO CHECK
  SET_AB_ORDER_NUMBER = '[Cash Memo] Set AB Order Number',
  SET_CM_ORDER_NUMBER = '[Cash Memo] Set CM Order Number',
  SET_GEP_ORDER_NUMBER = '[Cash Memo] Set GEP Order Number',

  GET_ORDER_NUMBER = '[Cash Memo] Get Order Number',

  SET_AB_GHS_CUSTOMER_ID = '[Cash Memo] Set AB GHS Customer Id',

  SET_CM_IS_LEGACY = '[Cash Memo] Set CM isLegacy',

  SET_COMPONENT_INSTANCE = '[Cash Memo] Set COMPONENT INSTANCE',
  GET_COMPONENT_INSTANCE = '[Cash Memo] Get COMPONENT INSTANCE',

  SET_ERROR_IN_UPDATE_PRICE = '[Cash Memo] Set Error in Update Price',
  GET_ERROR_IN_UPDATE_PRICE = '[Cash Memo] Get Error in Update Price',

  SET_AB_DETAILS = '[Common] Set AB Details',

  SET_PARTIAL_CM_DETAILS = '[Common] Set Partial CM Details',

  LOAD_METAL_TYPES = '[Common] Load Metal Types',
  LOAD_METAL_TYPES_SUCCESS = '[Common] Load Metal Types Success',
  LOAD_METAL_TYPES_FAILURE = '[Common] Load Metal Types Failure',

  LOAD_TOLERANCE = '[Common] Load Tolerance',
  LOAD_TOLERANCE_SUCCESS = '[Common] Load Tolerance Success',
  LOAD_TOLERANCE_FAILURE = '[Common] Load Tolerance Failure',
  LOAD_AB_TOLERANCE = '[Common] Load AB Tolerance',
  LOAD_AB_TOLERANCE_SUCCESS = '[Common] Load AB Tolerance Success',
  LOAD_AB_TOLERANCE_FAILURE = '[Common] Load AB Tolerance Failure',

  LOAD_CM_GRF_TOLERANCE = '[Common] Load CM Grf Tolerance',
  LOAD_CM_GRF_TOLERANCE_SUCCESS = '[Common] Load CM Grf Tolerance Success',
  LOAD_CM_GRF_TOLERANCE_FAILURE = '[Common] Load CM Grf Tolerance Failure',
  LOAD_AB_GRF_TOLERANCE = '[Common] Load AB Grf Tolerance',
  LOAD_AB_GRF_TOLERANCE_SUCCESS = '[Common] Load AB Grf Tolerance Success',
  LOAD_AB_GRF_TOLERANCE_FAILURE = '[Common] Load AB Grf Tolerance Failure',

  LOAD_CM_GRN_TOLERANCE = '[Common] Load CM Grn Tolerance',
  LOAD_CM_GRN_TOLERANCE_SUCCESS = '[Common] Load CM Grn Tolerance Success',
  LOAD_CM_GRN_TOLERANCE_FAILURE = '[Common] Load CM Grn Tolerance Failure',

  LOAD_AB_GRN_TOLERANCE = '[Common] Load AB Grn Tolerance',
  LOAD_AB_GRN_TOLERANCE_SUCCESS = '[Common] Load AB Grn Tolerance Success',
  LOAD_AB_GRN_TOLERANCE_FAILURE = '[Common] Load AB Grn Tolerance Failure',

  DISABLE_FULL_PAYMENT_CHECK = '[Common] Disable Full Payment Check',
  //TO CHECK
  SET_AB_ERROR_IN_UPDATE_PRICE = '[Cash Memo] Set AB Error in Update Price',
  SET_CM_ERROR_IN_UPDATE_PRICE = '[Cash Memo] Set CM Error in Update Price',

  // GET_ERROR_IN_UPDATE_PRICE = '[Cash Memo] Get Error in Update Price'

  SET_SAME_MERGE_GRF_CUSTOMER = '[Cash Memo] Set Same MergeGrf Customer',

  SET_FILE_UPLOAD_VISIBLE = '[Common] Set File Upload Visible',

  SET_DISCOUNT_DETAILS = '[Common] Set Discount Details',

  SET_FINAL_AMOUNT = '[Common] Set Final Amount',
  //other charges
  SET_CM_FINAL_AMT = '[Common] Set CM Final Amount',
  SET_CM_OTHER_CHARGES = '[Common] Set CM Other Charges',

  SET_AB_FINAL_AMT = '[Common] Set AB Final Amount',

  SET_GRF_ORDER_NUMBER = '[GRF] Set GRF Order Number',
  SET_ACCEPT_ADVANCE_ORDER_NUMBER = '[Accept Advance] Set Accept Advance Order Number',
  SET_GC_ORDER_NUMBER = '[GC] Set GC Order Number',
  SET_TEP_ORDER_NUMBER = '[TEP] Set TEP Order Number',

  SET_GRN_WORKFLOW_FLAG = '[Grn] Set Grn Workflow Flag',

  CLOSE_TOLERANCE = '[Common] Close Tolerance',

  // Inventory Image Loading
  LOAD_IMAGE_CATALOGUE_DETAILS = '[ Inventory ] Load Image Catalogue Details',
  LOAD_IMAGE_CATALOGUE_DETAILS_SUCCESS = '[ Inventory ] Load Image Catalogue Details Success',
  LOAD_IMAGE_CATALOGUE_DETAILS_FAILURE = '[ Inventory ] Load Image Catalogue Details Failure',

  SET_CO_TOTAL_PRODUCT_VALUES = '[Cash Memo] Set CO Total Product Values',
  SET_MIN_CO_VALUE = '[Common] Set Min CO Value',
  SET_FROZEN_CO_VALUE = '[Common] Set Frozen CO Value',
  SET_CO_ORDER_NUMBER = '[Cash Memo] Set CO Order Number',
  CLEAR_CUSTOMER_ORDER = '[Common] Clear Customer Order',
  SET_IS_IGST_FLAG = '[Grn] Set Is IGST Flag',
  RESET_INVOICES = '[Common] Reset Invoices'
}

export class DisableFullPaymentCheck implements Action {
  readonly type = CommonActionTypes.DISABLE_FULL_PAYMENT_CHECK;
  constructor(public payload: boolean) {}
}
export class SetGrnStatus implements Action {
  readonly type = CommonActionTypes.SET_GRN_STATUS;
  constructor(public payload: string) {}
}
export class SetGrnTotalReturnProducts implements Action {
  readonly type = CommonActionTypes.SET_GRN_TOTAL_RETURN_PRODUCTS;
  constructor(public payload: number) {}
}
export class SetGrnTotalReturnValue implements Action {
  readonly type = CommonActionTypes.SET_GRN_TOTAL_RETURN_VALUE;
  constructor(public payload: number) {}
}
export class SetAbDetails implements Action {
  readonly type = CommonActionTypes.SET_AB_DETAILS;
  constructor(public payload: AdvanceBookingDetailsResponse) {}
}

export class SetPartialCashMemoDetails implements Action {
  readonly type = CommonActionTypes.SET_PARTIAL_CM_DETAILS;
  constructor(public payload: CashMemoDetailsResponse) {}
}

export class SetTcsAmount implements Action {
  readonly type = CommonActionTypes.SET_TCS_AMOUNT;
  constructor(public payload: number) {}
}

export class SetFinalAmount implements Action {
  readonly type = CommonActionTypes.SET_FINAL_AMOUNT;
  constructor(public payload: number) {}
}
export class SetTcsCollectedAmount implements Action {
  readonly type = CommonActionTypes.SET_TCS_COLLECTED_AMOUNT;
  constructor(public payload: number) {}
}

export class SetTcsAmountNeedToReset implements Action {
  readonly type = CommonActionTypes.SET_TCS_AMOUNT_NEED_TO_RESET;
  constructor(public payload: boolean) {}
}

export class SetCMGhsCustomerId implements Action {
  readonly type = CommonActionTypes.SET_CM_GHS_CUSTOMER_ID;
  constructor(public payload: number) {}
}

export class SetABGhsCustomerId implements Action {
  readonly type = CommonActionTypes.SET_AB_GHS_CUSTOMER_ID;
  constructor(public payload: number) {}
}

export class SetCMisLegacy implements Action {
  readonly type = CommonActionTypes.SET_CM_IS_LEGACY;
  constructor(public payload: boolean) {}
}

export class LoadMetalTypes implements Action {
  readonly type = CommonActionTypes.LOAD_METAL_TYPES;
}
export class LoadMetalTypesSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_METAL_TYPES_SUCCESS;
  constructor(public payload: AbToleranceConfigMetalType[]) {}
}
export class LoadMetalTypesFailure implements Action {
  readonly type = CommonActionTypes.LOAD_METAL_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTolerance implements Action {
  readonly type = CommonActionTypes.LOAD_TOLERANCE;
  constructor(public payload: TolerancePayload) {}
}
export class LoadToleranceSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_TOLERANCE_SUCCESS;
  constructor(
    public payload: {
      data: {};
      itemType: string;
    }
  ) {}
}
export class LoadToleranceFailure implements Action {
  readonly type = CommonActionTypes.LOAD_TOLERANCE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadABTolerance implements Action {
  readonly type = CommonActionTypes.LOAD_AB_TOLERANCE;
  constructor(public payload: TolerancePayload) {}
}
export class LoadABToleranceSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_AB_TOLERANCE_SUCCESS;
  constructor(
    public payload: {
      data: {};
      itemType: string;
    }
  ) {}
}
export class LoadABToleranceFailure implements Action {
  readonly type = CommonActionTypes.LOAD_AB_TOLERANCE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCMGrfTolerance implements Action {
  readonly type = CommonActionTypes.LOAD_CM_GRF_TOLERANCE;
  constructor(public payload: TolerancePayload) {}
}
export class LoadCMGrfToleranceSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_CM_GRF_TOLERANCE_SUCCESS;
  constructor(public payload: {}) {}
}
export class LoadCMGrfToleranceFailure implements Action {
  readonly type = CommonActionTypes.LOAD_CM_GRF_TOLERANCE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadABGrfTolerance implements Action {
  readonly type = CommonActionTypes.LOAD_AB_GRF_TOLERANCE;
  constructor(public payload: TolerancePayload) {}
}
export class LoadABGrfToleranceSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_AB_GRF_TOLERANCE_SUCCESS;
  constructor(public payload: {}) {}
}
export class LoadABGrfToleranceFailure implements Action {
  readonly type = CommonActionTypes.LOAD_AB_GRF_TOLERANCE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCMGrnTolerance implements Action {
  readonly type = CommonActionTypes.LOAD_CM_GRN_TOLERANCE;
  constructor(public payload: TolerancePayload) {}
}
export class LoadCMGrnToleranceSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_CM_GRN_TOLERANCE_SUCCESS;
  constructor(public payload: {}) {}
}
export class LoadCMGrnToleranceFailure implements Action {
  readonly type = CommonActionTypes.LOAD_CM_GRN_TOLERANCE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadABGrnTolerance implements Action {
  readonly type = CommonActionTypes.LOAD_AB_GRN_TOLERANCE;
  constructor(public payload: TolerancePayload) {}
}
export class LoadABGrnToleranceSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_AB_GRN_TOLERANCE_SUCCESS;
  constructor(public payload: {}) {}
}
export class LoadABGrnToleranceFailure implements Action {
  readonly type = CommonActionTypes.LOAD_AB_GRN_TOLERANCE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadABStandardMetalPriceDetails implements Action {
  readonly type = CommonActionTypes.LOAD_AB_STANDARD_METAL_PRICE_DETAILS;
}
export class LoadABStandardMetalPriceDetailsSuccess implements Action {
  readonly type =
    CommonActionTypes.LOAD_AB_STANDARD_METAL_PRICE_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadABStandardMetalPriceDetailsFailure implements Action {
  readonly type =
    CommonActionTypes.LOAD_AB_STANDARD_METAL_PRICE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCOStandardMetalPriceDetails implements Action {
  readonly type = CommonActionTypes.LOAD_CO_STANDARD_METAL_PRICE_DETAILS;
}
export class LoadCOStandardMetalPriceDetailsSuccess implements Action {
  readonly type =
    CommonActionTypes.LOAD_CO_STANDARD_METAL_PRICE_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadCOStandardMetalPriceDetailsFailure implements Action {
  readonly type =
    CommonActionTypes.LOAD_CO_STANDARD_METAL_PRICE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCMStandardMetalPriceDetails implements Action {
  readonly type = CommonActionTypes.LOAD_CM_STANDARD_METAL_PRICE_DETAILS;
}
export class LoadCMStandardMetalPriceDetailsSuccess implements Action {
  readonly type =
    CommonActionTypes.LOAD_CM_STANDARD_METAL_PRICE_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadCMStandardMetalPriceDetailsFailure implements Action {
  readonly type =
    CommonActionTypes.LOAD_CM_STANDARD_METAL_PRICE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTEPStandardMetalPriceDetails implements Action {
  readonly type = CommonActionTypes.LOAD_TEP_STANDARD_METAL_PRICE_DETAILS;
}
export class LoadTEPStandardMetalPriceDetailsSuccess implements Action {
  readonly type =
    CommonActionTypes.LOAD_TEP_STANDARD_METAL_PRICE_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadTEPStandardMetalPriceDetailsFailure implements Action {
  readonly type =
    CommonActionTypes.LOAD_TEP_STANDARD_METAL_PRICE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadGRFStandardMetalPriceDetails implements Action {
  readonly type = CommonActionTypes.LOAD_GRF_STANDARD_METAL_PRICE_DETAILS;
}
export class LoadGRFStandardMetalPriceDetailsSuccess implements Action {
  readonly type =
    CommonActionTypes.LOAD_GRF_STANDARD_METAL_PRICE_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadGRFStandardMetalPriceDetailsFailure implements Action {
  readonly type =
    CommonActionTypes.LOAD_GRF_STANDARD_METAL_PRICE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SetTransactionID implements Action {
  readonly type = CommonActionTypes.SET_TRANSACTION_ID;
  constructor(public payload: string) {}
}
export class SetABTransactionID implements Action {
  readonly type = CommonActionTypes.SET_AB_TRANSACTION_ID;
  constructor(public payload: string) {}
}
export class SetCMTransactionID implements Action {
  readonly type = CommonActionTypes.SET_CM_TRANSACTION_ID;
  constructor(public payload: string) {}
}
export class SetBillCancellationTransactionID implements Action {
  readonly type = CommonActionTypes.SET_BILL_CANCELLATION_TRANSACTION_ID;
  constructor(public payload: string) {}
}
export class SetGCTransactionID implements Action {
  readonly type = CommonActionTypes.SET_GC_TRANSACTION_ID;
  constructor(public payload: string) {}
}
export class SetAcceptAdvanceTransactionID implements Action {
  readonly type = CommonActionTypes.SET_ACCEPT_ADVANCE_TRANSACTION_ID;
  constructor(public payload: string) {}
}
export class SetGEPTransactionID implements Action {
  readonly type = CommonActionTypes.SET_GEP_TRANSACTION_ID;
  constructor(public payload: string) {}
}
export class SetGRFTransactionID implements Action {
  readonly type = CommonActionTypes.SET_GRF_TRANSACTION_ID;
  constructor(public payload: string) {}
}
export class SetTEPTransactionID implements Action {
  readonly type = CommonActionTypes.SET_TEP_TRANSACTION_ID;
  constructor(public payload: string) {}
}

export class SetABMinABVAlue implements Action {
  readonly type = CommonActionTypes.SET_AB_MIN_AB_VALUE;
  constructor(public payload: number) {}
}

export class SetMinFrozenVAlue implements Action {
  readonly type = CommonActionTypes.SET_MIN_FROZEN_ORDER_VALUE;
  constructor(public payload: number) {}
}

export class SetMinFrozenCOVAlue implements Action {
  readonly type = CommonActionTypes.SET_MIN_FROZEN_CO_ORDER_VALUE;
  constructor(public payload: number) {}
}

export class SetFrozenMinABVAlue implements Action {
  readonly type = CommonActionTypes.SET_AB_FROZEN_AB_VALUE;
  constructor(public payload: boolean) {}
}

export class SetFrozenMinCOVAlue implements Action {
  readonly type = CommonActionTypes.SET_CO_FROZEN_CO_VALUE;
  constructor(public payload: boolean) {}
}

export class SetAbStatus implements Action {
  readonly type = CommonActionTypes.SET_AB_STATUS;
  constructor(public payload: StatusTypesEnum) {}
}
export class UpdateABWeight implements Action {
  readonly type = CommonActionTypes.SET_AB_WEIGHT;
  constructor(public payload: number) {}
}

export class UpdateCOWeight implements Action {
  readonly type = CommonActionTypes.SET_CO_WEIGHT;
  constructor(public payload: number) {}
}
export class SetCMMinABVAlue implements Action {
  readonly type = CommonActionTypes.SET_CM_MIN_AB_VALUE;
  constructor(public payload: number) {}
}
export class SetTransactionConfig implements Action {
  readonly type = CommonActionTypes.SET_TRANSACTION_CONFIG;
  constructor(public payload: TransactionConfig) {}
}
export class SetABTransactionConfig implements Action {
  readonly type = CommonActionTypes.SET_AB_TRANSACTION_CONFIG;
  constructor(public payload: TransactionConfig) {}
}
export class SetCMTransactionConfig implements Action {
  readonly type = CommonActionTypes.SET_CM_TRANSACTION_CONFIG;
  constructor(public payload: TransactionConfig) {}
}
export class SetGRFTransactionConfig implements Action {
  readonly type = CommonActionTypes.SET_GRF_TRANSACTION_CONFIG;
  constructor(public payload: TransactionConfig) {}
}
export class SetBillCancellationTransactionConfig implements Action {
  readonly type = CommonActionTypes.SET_BILL_CANCELLATION_TRANSACTION_CONFIG;
  constructor(public payload: TransactionConfig) {}
}
export class SetGCTransactionConfig implements Action {
  readonly type = CommonActionTypes.SET_GC_TRANSACTION_CONFIG;
  constructor(public payload: TransactionConfig) {}
}
export class SetGEPTransactionConfig implements Action {
  readonly type = CommonActionTypes.SET_GEP_TRANSACTION_CONFIG;
  constructor(public payload: TransactionConfig) {}
}
export class SetAcceptAdvanceTransactionConfig implements Action {
  readonly type = CommonActionTypes.SET_ACCEPT_ADVANCE_TRANSACTION_CONFIG;
  constructor(public payload: TransactionConfig) {}
}
export class SetTEPTransactionConfig implements Action {
  readonly type = CommonActionTypes.SET_TEP_TRANSACTION_CONFIG;
  constructor(public payload: TransactionConfig) {}
}
export class ClearTransactionConfig implements Action {
  readonly type = CommonActionTypes.CLEAR_TRANSACTION_CONFIG;
}

export class ClearTcsCollectedAmount implements Action {
  readonly type = CommonActionTypes.CLEAR_TCS_COLLECTED_AMOUNT;
}

export class ClearTcsAmountNeedToReset implements Action {
  readonly type = CommonActionTypes.CLEAR_TCS_AMOUNT_NEED_TO_RESET;
}
export class ClearABTransactionConfig implements Action {
  readonly type = CommonActionTypes.CLEAR_AB_TRANSACTION_CONFIG;
}
export class ClearCMTransactionConfig implements Action {
  readonly type = CommonActionTypes.CLEAR_CM_TRANSACTION_CONFIG;
}
export class ClearGCTransactionConfig implements Action {
  readonly type = CommonActionTypes.CLEAR_GC_TRANSACTION_CONFIG;
}
export class ClearGRFTransactionConfig implements Action {
  readonly type = CommonActionTypes.CLEAR_GRF_TRANSACTION_CONFIG;
}
export class ClearBillCancellationTransactionConfig implements Action {
  readonly type = CommonActionTypes.CLEAR_BILL_CANCELLATION_TRANSACTION_CONFIG;
}
export class ClearGEPTransactionConfig implements Action {
  readonly type = CommonActionTypes.CLEAR_GEP_TRANSACTION_CONFIG;
}
export class ClearAcceptAdvanceTransactionConfig implements Action {
  readonly type = CommonActionTypes.CLEAR_ACCEPT_ADVANCE_TRANSACTION_CONFIG;
}
export class ClearTEPTransactionConfig implements Action {
  readonly type = CommonActionTypes.CLEAR_TEP_TRANSACTION_CONFIG;
}
export class ClearTransactionID implements Action {
  readonly type = CommonActionTypes.CLEAR_TRANSACTION_ID;
}
export class ClearABTransactionID implements Action {
  readonly type = CommonActionTypes.CLEAR_AB_TRANSACTION_ID;
}
export class ClearCMTransactionID implements Action {
  readonly type = CommonActionTypes.CLEAR_CM_TRANSACTION_ID;
}
export class ClearBillCancellationTransactionID implements Action {
  readonly type = CommonActionTypes.CLEAR_BILL_CANCELLATION_TRANSACTION_ID;
}
export class ClearGCTransactionID implements Action {
  readonly type = CommonActionTypes.CLEAR_GC_TRANSACTION_ID;
}

export class ClearTolerance implements Action {
  readonly type = CommonActionTypes.CLEAR_TOLERANCE;
}

export class ClearCMGrfTolerance implements Action {
  readonly type = CommonActionTypes.CLEAR_CM_GRF_TOLERANCE;
}

export class ClearABGrfTolerance implements Action {
  readonly type = CommonActionTypes.CLEAR_AB_GRF_TOLERANCE;
}

export class ClearCMGrnTolerance implements Action {
  readonly type = CommonActionTypes.CLEAR_CM_GRN_TOLERANCE;
}

export class ClearABGrnTolerance implements Action {
  readonly type = CommonActionTypes.CLEAR_AB_GRN_TOLERANCE;
}

export class ClearAcceptAdvanceTransactionID implements Action {
  readonly type = CommonActionTypes.CLEAR_ACCEPT_ADVANCE_TRANSACTION_ID;
}
export class ClearGEPTransactionID implements Action {
  readonly type = CommonActionTypes.CLEAR_GEP_TRANSACTION_ID;
}
export class ClearGRFTransactionID implements Action {
  readonly type = CommonActionTypes.CLEAR_GRF_TRANSACTION_ID;
}
export class ClearTEPTransactionID implements Action {
  readonly type = CommonActionTypes.CLEAR_TEP_TRANSACTION_ID;
}

export class ClearTcsAmount implements Action {
  readonly type = CommonActionTypes.CLEAR_TCS_AMOUNT;
}
export class SetTransactionTotalAmount implements Action {
  readonly type = CommonActionTypes.SET_TRANSACTION_TOTAL_AMOUNT;
  constructor(public payload: number) {}
}
export class SetABTransactionTotalAmount implements Action {
  readonly type = CommonActionTypes.SET_AB_TRANSACTION_TOTAL_AMOUNT;
  constructor(public payload: number) {}
}
export class SetCMTransactionTotalAmount implements Action {
  readonly type = CommonActionTypes.SET_CM_TRANSACTION_TOTAL_AMOUNT;
  constructor(public payload: number) {}
}
export class SetGCTransactionTotalAmount implements Action {
  readonly type = CommonActionTypes.SET_GC_TRANSACTION_TOTAL_AMOUNT;
  constructor(public payload: number) {}
}

export class SetBillCancellationTransactionTotalAmount implements Action {
  readonly type =
    CommonActionTypes.SET_BILL_CANCELLATION_TRANSACTION_TOTAL_AMOUNT;
  constructor(public payload: number) {}
}
export class SetAcceptAdvanceTransactionTotalAmount implements Action {
  readonly type = CommonActionTypes.SET_ACCEPT_ADVANCE_TRANSACTION_TOTAL_AMOUNT;
  constructor(public payload: number) {}
}
export class SetGRFTransactionTotalAmount implements Action {
  readonly type = CommonActionTypes.SET_GRF_TRANSACTION_TOTAL_AMOUNT;
  constructor(public payload: number) {}
}

export class LoadCMPgDesc implements Action {
  readonly type = CommonActionTypes.LOAD_CM_PG_DESC;
}

export class LoadCMPgDescSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_CM_PG_DESC_SUCCESS;
  constructor(public payload: {}) {}
}

export class LoadCMPgDescFailure implements Action {
  readonly type = CommonActionTypes.LOAD_CM_PG_DESC_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadABPgDesc implements Action {
  readonly type = CommonActionTypes.LOAD_AB_PG_DESC;
}

export class LoadABPgDescSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_AB_PG_DESC_SUCCESS;
  constructor(public payload: {}) {}
}

export class LoadABPgDescFailure implements Action {
  readonly type = CommonActionTypes.LOAD_AB_PG_DESC_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadGRNPgDesc implements Action {
  readonly type = CommonActionTypes.LOAD_GRN_PG_DESC;
}

export class LoadGRNPgDescSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_GRN_PG_DESC_SUCCESS;
  constructor(public payload: {}) {}
}

export class LoadGRNPgDescFailure implements Action {
  readonly type = CommonActionTypes.LOAD_GRN_PG_DESC_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadBillCancellationPgDesc implements Action {
  readonly type = CommonActionTypes.LOAD_BILL_CANCELLATION_PG_DESC;
}

export class LoadBillCancellationPgDescSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_BILL_CANCELLATION_PG_DESC_SUCCESS;
  constructor(public payload: {}) {}
}

export class LoadBillCancellationPgDescFailure implements Action {
  readonly type = CommonActionTypes.LOAD_BILL_CANCELLATION_PG_DESC_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadABImageUrl implements Action {
  readonly type = CommonActionTypes.LOAD_AB_IMAGE_URL;
  constructor(public payload: string) {}
}

export class LoadABImageUrlSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_AB_IMAGE_URL_SUCCESS;
  constructor(public payload: ImageUrlData) {}
}
export class LoadABImageUrlFailure implements Action {
  readonly type = CommonActionTypes.LOAD_AB_IMAGE_URL_FAILURE;
  constructor(public payload: ImageUrlData) {}
}
export class LoadBillCancellationImageUrl implements Action {
  readonly type = CommonActionTypes.LOAD_BILL_CANCELLATION_IMAGE_URL;
  constructor(public payload: string) {}
}

export class LoadBillCancellationImageUrlSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_BILL_CANCELLATION_IMAGE_URL_SUCCESS;
  constructor(public payload: ImageUrlData) {}
}
export class LoadBillCancellationImageUrlFailure implements Action {
  readonly type = CommonActionTypes.LOAD_BILL_CANCELLATION_IMAGE_URL_FAILURE;
  constructor(public payload: ImageUrlData) {}
}
export class LoadCMImageUrl implements Action {
  readonly type = CommonActionTypes.LOAD_CM_IMAGE_URL;
  constructor(public payload: string) {}
}

export class LoadCMImageUrlSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_CM_IMAGE_URL_SUCCESS;
  constructor(public payload: ImageUrlData) {}
}
export class LoadCMImageUrlFailure implements Action {
  readonly type = CommonActionTypes.LOAD_CM_IMAGE_URL_FAILURE;
  constructor(public payload: ImageUrlData) {}
}

export class LoadGRNImageUrl implements Action {
  readonly type = CommonActionTypes.LOAD_GRN_IMAGE_URL;
  constructor(public payload: string) {}
}

export class LoadGRNImageUrlSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_GRN_IMAGE_URL_SUCCESS;
  constructor(public payload: ImageUrlData) {}
}
export class LoadGRNImageUrlFailure implements Action {
  readonly type = CommonActionTypes.LOAD_GRN_IMAGE_URL_FAILURE;
  constructor(public payload: ImageUrlData) {}
}
export class LoadABPrintDeatils implements Action {
  readonly type = CommonActionTypes.LOAD_AB_PRINT_DETAILS;
  constructor(readonly printData: PrintPayload) {}
}

export class LoadABPrintDeatilsSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_AB_PRINT_DETAILS_SUCCESS;
  constructor(readonly payload: any) {}
}
export class LoadABPrintDeatilsFailure implements Action {
  readonly type = CommonActionTypes.LOAD_AB_PRINT_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class LoadCMPrintDeatils implements Action {
  readonly type = CommonActionTypes.LOAD_CM_PRINT_DETAILS;
  constructor(readonly printData: PrintPayload) {}
}

export class LoadCMPrintDeatilsSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_CM_PRINT_DETAILS_SUCCESS;
  constructor(readonly payload: any) {}
}
export class LoadCMPrintDeatilsFailure implements Action {
  readonly type = CommonActionTypes.LOAD_CM_PRINT_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadFaileInvoicesDeatils implements Action {
  readonly type = CommonActionTypes.LOAD_FAILED_INVOICE;
}

export class LoadFaileInvoicesDeatilsSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_FAILED_INVOICE_SUCCESS;
  constructor(readonly payload: string[]) {}
}
export class LoadFaileInvoicesDeatilsFailure implements Action {
  readonly type = CommonActionTypes.LOAD_FAILED_INVOICE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadCopiedInvoicesDocument implements Action {
  readonly type = CommonActionTypes.LOAD_COPIED_INVOICE_DOCUMENT;
}

export class LoadCopiedInvoicesDocumentSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_COPIED_INVOICE_DOCUMENT_SUCCESS;
  constructor(readonly payload: boolean) {}
}
export class LoadCopiedInvoicesDocumentFailure implements Action {
  readonly type = CommonActionTypes.LOAD_COPIED_INVOICE_DOCUMENT_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class TriggerFailedInvoicesDetails implements Action {
  readonly type = CommonActionTypes.TRIGGER_FAILED_INVOICE;
}

export class TriggerFailedInvoicesDetailsSuccess implements Action {
  readonly type = CommonActionTypes.TRIGGER_FAILED_INVOICE_SUCCESS;
}

export class TriggerFailedInvoicesDetailsFailure implements Action {
  readonly type = CommonActionTypes.TRIGGER_FAILED_INVOICE_FAILURE;
}

export class PrintReceipt implements Action {
  readonly type = CommonActionTypes.PRINT_RECEIPT;
  constructor(readonly printName: string, readonly printData: string) {}
}

export class PrintReceiptSuccess implements Action {
  readonly type = CommonActionTypes.PRINT_RECEIPT_SUCCESS;
  constructor(readonly payload: any) {}
}
export class PrintReceiptFailure implements Action {
  readonly type = CommonActionTypes.PRINT_RECEIPT_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class SetHoldTime implements Action {
  readonly type = CommonActionTypes.SET_HOLD_TIME;
  constructor(public payload: number) {}
}

export class GetHoldTime implements Action {
  readonly type = CommonActionTypes.GET_HOLD_TIME;
  constructor(public payload: boolean) {}
}

export class SetABSelectedRsoName implements Action {
  readonly type = CommonActionTypes.SET_AB_SELECTED_RSO_NAME;
  constructor(public payload: any) {}
}
export class SetCMSelectedRsoName implements Action {
  readonly type = CommonActionTypes.SET_CM_SELECTED_RSO_NAME;
  constructor(public payload: any) {}
}
export class SetGCSelectedRsoName implements Action {
  readonly type = CommonActionTypes.SET_GC_SELECTED_RSO_NAME;
  constructor(public payload: any) {}
}

export class SetGcTotalCardsQty implements Action {
  readonly type = CommonActionTypes.SET_GC_TOTAL_CARDS_QTY;
  constructor(public payload: number) {}
}

export class SetGrfGoldWeight implements Action {
  readonly type = CommonActionTypes.SET_GRF_GOLD_WEIGHT;
  constructor(public payload: number) {}
}

export class SetWalkInsCount implements Action {
  readonly type = CommonActionTypes.SET_WALK_INS_COUNT;
  constructor(public payload: number) {}
}

export class SetIsWalkInsFormInvalid implements Action {
  readonly type = CommonActionTypes.SET_IS_WALK_INS_FORM_INVALID;
  constructor(public payload: boolean) {}
}

export class SetWalkInsConversionCount implements Action {
  readonly type = CommonActionTypes.SET_WALK_INS_CONVERSION_COUNT;
  constructor(public payload: number) {}
}

export class SetTepTotalQty implements Action {
  readonly type = CommonActionTypes.SET_TEP_TOTAL_QTY;
  constructor(public payload: number) {}
}

export class SetTepTotalExchangeAmount implements Action {
  readonly type = CommonActionTypes.SET_TEP_TOTAL_EXCHANGE_AMOUNT;
  constructor(public payload: number) {}
}

export class SetTepTotalRefundAmount implements Action {
  readonly type = CommonActionTypes.SET_TEP_TOTAL_REFUND_AMOUNT;
  constructor(public payload: number) {}
}

export class SetTepTotalGrossWt implements Action {
  readonly type = CommonActionTypes.SET_TEP_TOTAL_GROSS_WEIGHT;
  constructor(public payload: number) {}
}

export class SetIsTepRefundFormValid implements Action {
  readonly type = CommonActionTypes.SET_IS_TEP_REFUND_FORM_VALID;
  constructor(public payload: boolean) {}
}

export class SetIsTepApprovalValid implements Action {
  readonly type = CommonActionTypes.SET_IS_TEP_APPROVAL_VALID;
  constructor(public payload: boolean) {}
}

export class SetTepSelectedPaymentMethod implements Action {
  readonly type = CommonActionTypes.SET_TEP_SELECTED_PAYMENT_METHOD;
  constructor(public payload: string) {}
}
export class SetSelectedTepType implements Action {
  readonly type = CommonActionTypes.SELECTED_TEP_TYPE;
  constructor(public payload: string) {}
}

export class SetIsTepRequestRaising implements Action {
  readonly type = CommonActionTypes.SET_IS_TEP_REQUEST_RAISING;
  constructor(public payload: boolean) {}
}

export class SetCutPieceTepTotalQty implements Action {
  readonly type = CommonActionTypes.SET_CUT_PIECE_TEP_TOTAL_QTY;
  constructor(public payload: number) {}
}

export class SetCutPieceTepTotalValue implements Action {
  readonly type = CommonActionTypes.SET_CUT_PIECE_TEP_TOTAL_VALUE;
  constructor(public payload: number) {}
}

export class SetMergingCNs implements Action {
  readonly type = CommonActionTypes.SET_MERGING_CNS;
  constructor(public payload: CreditNote[]) {}
}

export class LoadMaxCashLimit implements Action {
  readonly type = CommonActionTypes.LOAD_MAX_CASH_LIMIT;
  constructor(public payload: { ruleType: string; requestBody: any }) {}
}
export class LoadMaxCashLimitSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_MAX_CASH_LIMIT_SUCCESS;
  constructor(public payload: string) {}
}

export class LoadMaxCashLimitFailure implements Action {
  readonly type = CommonActionTypes.LOAD_MAX_CASH_LIMIT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SetFocItems implements Action {
  readonly type = CommonActionTypes.SET_FOC_ITEMS;
  constructor(readonly payload: any[]) {}
}

export class SetManualFocItems implements Action {
  readonly type = CommonActionTypes.SET_MANUAL_FOC_ITEMS;
  constructor(readonly payload: any[]) {}
}
export class SetFocEligibleWtAndQty implements Action {
  readonly type = CommonActionTypes.SET_FOC_ELIGIBLE_WT_AND_QTY;
  constructor(readonly payload: { qty: number; wt: number }) {}
}

export class SetConfigurationAmountAdvance implements Action {
  readonly type = CommonActionTypes.SET_CONFIGURATION_AMOUNT_ADAVNCE;
  constructor(public payload: { amount: number; isPanCardMan: boolean }) {}
}

export class LoadABOccasions implements Action {
  readonly type = CommonActionTypes.LOAD_AB_OCCASIONS;
  constructor(readonly payload: string) {}
}

export class LoadABOccasionsSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_AB_OCCASIONS_SUCCESS;
  constructor(readonly payload: Lov[]) {}
}

export class LoadABOccasionsFailure implements Action {
  readonly type = CommonActionTypes.LOAD_AB_OCCASIONS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class LoadCMOccasions implements Action {
  readonly type = CommonActionTypes.LOAD_CM_OCCASIONS;
  constructor(readonly payload: string) {}
}

export class LoadCMOccasionsSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_CM_OCCASIONS_SUCCESS;
  constructor(readonly payload: Lov[]) {}
}

export class LoadCMOccasionsFailure implements Action {
  readonly type = CommonActionTypes.LOAD_CM_OCCASIONS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ClearCashMemo implements Action {
  readonly type = CommonActionTypes.CLEAR_CASH_MEMO;
}

export class ClearAdvanceBooking implements Action {
  readonly type = CommonActionTypes.CLEAR_ADVANCE_BOOKING;
}
export class ConfrimCashMemo implements Action {
  readonly type = CommonActionTypes.CONFRIM_CASH_MEMO;
}

export class HoldCashMemo implements Action {
  readonly type = CommonActionTypes.HOLD_CASH_MEMO;
}

export class ConvertToAdvance implements Action {
  readonly type = CommonActionTypes.CONVERT_TO_ADVANCE;
}

export class SetABTotalProductValues implements Action {
  readonly type = CommonActionTypes.SET_AB_TOTAL_PRODUCT_VALUES;
  constructor(public payload: SetTotalProductValuesPayload) {}
}
export class SetCMTotalProductValues implements Action {
  readonly type = CommonActionTypes.SET_CM_TOTAL_PRODUCT_VALUES;
  constructor(public payload: SetTotalProductValuesPayload) {}
}
export class SetCMOrderValues implements Action {
  readonly type = CommonActionTypes.SET_CM_ORDER_VALUES;
  constructor(public payload: SetOrderValuesPayload) {}
}
export class SetBillCancellationTotalProductValues implements Action {
  readonly type = CommonActionTypes.SET_BILL_CANCELLATION_TOTAL_PRODUCT_VALUES;
  constructor(public payload: SetTotalProductValuesPayload) {}
}
export class SetGEPTotalProductValues implements Action {
  readonly type = CommonActionTypes.SET_GEP_TOTAL_PRODUCT_VALUES;
  constructor(public payload: SetTotalProductValuesPayload) {}
}

export class SetABOrderNumber implements Action {
  readonly type = CommonActionTypes.SET_AB_ORDER_NUMBER;
  constructor(
    public payload: { orderNo: number; status: StatusTypesEnum | string }
  ) {}
}
export class SetCMOrderNumber implements Action {
  readonly type = CommonActionTypes.SET_CM_ORDER_NUMBER;
  constructor(
    public payload: { orderNo: number; status: StatusTypesEnum | string }
  ) {}
}
export class SetGEPOrderNumber implements Action {
  readonly type = CommonActionTypes.SET_GEP_ORDER_NUMBER;
  constructor(
    public payload: { orderNo: number; status: StatusTypesEnum | string }
  ) {}
}

export class SetGcOrderNumber implements Action {
  readonly type = CommonActionTypes.SET_GC_ORDER_NUMBER;
  constructor(
    public payload: { orderNo: number; status: StatusTypesEnum | string }
  ) {}
}

export class SetAcceptAdvanceOrderNumber implements Action {
  readonly type = CommonActionTypes.SET_ACCEPT_ADVANCE_ORDER_NUMBER;
  constructor(
    public payload: { orderNo: number; status: StatusTypesEnum | string }
  ) {}
}

export class SetGrfOrderNumber implements Action {
  readonly type = CommonActionTypes.SET_GRF_ORDER_NUMBER;
  constructor(
    public payload: { orderNo: number; status: StatusTypesEnum | string }
  ) {}
}

export class SetTepOrderNumber implements Action {
  readonly type = CommonActionTypes.SET_TEP_ORDER_NUMBER;
  constructor(
    public payload: { orderNo: number; status: StatusTypesEnum | string }
  ) {}
}

//TO CHECK
export class GetOrderNumber implements Action {
  readonly type = CommonActionTypes.GET_ORDER_NUMBER;
  constructor(
    public payload: { orderNo: number; status: StatusTypesEnum | string }
  ) {}
}
export class SetComponentInstance implements Action {
  readonly type = CommonActionTypes.SET_COMPONENT_INSTANCE;
  constructor(public payload: string) {}
}

export class GetComponentInstance implements Action {
  readonly type = CommonActionTypes.GET_COMPONENT_INSTANCE;
  constructor(public payload: string) {}
}

export class SetABErrorInUpdatePrice implements Action {
  readonly type = CommonActionTypes.SET_AB_ERROR_IN_UPDATE_PRICE;
  constructor(public payload: boolean) {}
}
export class SetCMErrorInUpdatePrice implements Action {
  readonly type = CommonActionTypes.SET_CM_ERROR_IN_UPDATE_PRICE;
  constructor(public payload: boolean) {}
}
//TO CHECK
export class GetErrorInUpdatePrice implements Action {
  readonly type = CommonActionTypes.GET_ERROR_IN_UPDATE_PRICE;
  constructor(public payload: boolean) {}
}
export class SetSameMergeGrfCustomer implements Action {
  readonly type = CommonActionTypes.SET_SAME_MERGE_GRF_CUSTOMER;
  constructor(public payload: boolean) {}
}
export class SetFileUploadVisible implements Action {
  readonly type = CommonActionTypes.SET_FILE_UPLOAD_VISIBLE;
  constructor(public payload: boolean) {}
}
export class SetDiscountDetails implements Action {
  readonly type = CommonActionTypes.SET_DISCOUNT_DETAILS;
  constructor(public payload: any) {}
}
export class SetCMFinalAmount implements Action {
  readonly type = CommonActionTypes.SET_CM_FINAL_AMT;
  constructor(
    public payload: number,
    public taxValue: number,
    public otherCharges: any
  ) {}
}

export class SetCMOtherCharges implements Action {
  readonly type = CommonActionTypes.SET_CM_OTHER_CHARGES;
  constructor(public payload: number) {}
}
export class SetABFinalAmount implements Action {
  readonly type = CommonActionTypes.SET_AB_FINAL_AMT;
  constructor(public payload: number) {}
}

export class setGrnWorkflowFlag implements Action {
  readonly type = CommonActionTypes.SET_GRN_WORKFLOW_FLAG;
  constructor(public payload: boolean) {}
}
export class setGrnCreditNoteType implements Action {
  readonly type = CommonActionTypes.SET_GRN_CREDIT_NOTE_TYPE;
  constructor(public payload: string) {}
}
export class CloseTolerance implements Action {
  readonly type = CommonActionTypes.CLOSE_TOLERANCE;
  constructor(public payload: boolean) {}
}

// Inventory Image Loading
export class LoadImageCatalogueDetails implements Action {
  readonly type = CommonActionTypes.LOAD_IMAGE_CATALOGUE_DETAILS;
}
export class LoadImageCatalogueDetailsSuccess implements Action {
  readonly type = CommonActionTypes.LOAD_IMAGE_CATALOGUE_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadImageCatalogueDetailsFailure implements Action {
  readonly type = CommonActionTypes.LOAD_IMAGE_CATALOGUE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

// CO
export class SetCOTotalProductValues implements Action {
  readonly type = CommonActionTypes.SET_CO_TOTAL_PRODUCT_VALUES;
  constructor(public payload: SetCOTotalProductValuesPayload) {}
}

export class SetMinCOVAlue implements Action {
  readonly type = CommonActionTypes.SET_MIN_CO_VALUE;
  constructor(public payload: number) {}
}

export class SetFrozenCOVAlue implements Action {
  readonly type = CommonActionTypes.SET_FROZEN_CO_VALUE;
  constructor(public payload: boolean) {}
}

export class SetCOOrderNumber implements Action {
  readonly type = CommonActionTypes.SET_CO_ORDER_NUMBER;
  constructor(
    public payload: { orderNo: number; status: StatusTypesEnum | string }
  ) {}
}

export class ClearCustomerOrder implements Action {
  readonly type = CommonActionTypes.CLEAR_CUSTOMER_ORDER;
}

export class SetIsIGSTFlag implements Action {
  readonly type = CommonActionTypes.SET_IS_IGST_FLAG;
  constructor(public payload: boolean) {}
}

export class ResetInvoices implements Action {
  readonly type = CommonActionTypes.RESET_INVOICES;
}

export type CommonActions =
  | LoadABStandardMetalPriceDetails
  | LoadABStandardMetalPriceDetailsSuccess
  | LoadABStandardMetalPriceDetailsFailure
  | LoadCMStandardMetalPriceDetails
  | LoadCMStandardMetalPriceDetailsSuccess
  | LoadCMStandardMetalPriceDetailsFailure
  | LoadTEPStandardMetalPriceDetails
  | LoadTEPStandardMetalPriceDetailsSuccess
  | LoadTEPStandardMetalPriceDetailsFailure
  | LoadGRFStandardMetalPriceDetails
  | LoadGRFStandardMetalPriceDetailsSuccess
  | LoadGRFStandardMetalPriceDetailsFailure
  | SetTransactionID
  | SetABTransactionID
  | SetCMTransactionID
  | SetBillCancellationTransactionID
  | SetGCTransactionID
  | SetAcceptAdvanceTransactionID
  | SetGEPTransactionID
  | SetGRFTransactionID
  | SetTEPTransactionID
  | ClearTransactionID
  | ClearABTransactionID
  | ClearCMTransactionID
  | ClearBillCancellationTransactionID
  | ClearGCTransactionID
  | ClearAcceptAdvanceTransactionID
  | ClearGEPTransactionID
  | ClearGRFTransactionID
  | ClearTEPTransactionID
  | SetTransactionTotalAmount
  | SetABTransactionTotalAmount
  | SetCMTransactionTotalAmount
  | SetGCTransactionTotalAmount
  | SetGRFTransactionTotalAmount
  | SetAcceptAdvanceTransactionTotalAmount
  | SetBillCancellationTransactionTotalAmount
  | ClearTransactionConfig
  | ClearABTransactionConfig
  | ClearCMTransactionConfig
  | ClearGCTransactionConfig
  | ClearGRFTransactionConfig
  | ClearBillCancellationTransactionConfig
  | ClearGEPTransactionConfig
  | ClearAcceptAdvanceTransactionConfig
  | ClearTEPTransactionConfig
  | SetTransactionConfig
  | SetABTransactionConfig
  | SetCMTransactionConfig
  | SetGRFTransactionConfig
  | SetBillCancellationTransactionConfig
  | SetGCTransactionConfig
  | SetGEPTransactionConfig
  | SetAcceptAdvanceTransactionConfig
  | SetTEPTransactionConfig
  | SetCMMinABVAlue
  | SetABMinABVAlue
  //TODO
  | PrintReceipt
  | PrintReceiptSuccess
  | PrintReceiptFailure
  | LoadABPrintDeatils
  | LoadABPrintDeatilsSuccess
  | LoadABPrintDeatilsFailure
  | LoadCMPrintDeatils
  | LoadCMPrintDeatilsSuccess
  | LoadCMPrintDeatilsFailure
  | LoadABPgDesc
  | LoadABPgDescSuccess
  | LoadABPgDescFailure
  | LoadCMPgDesc
  | LoadCMPgDescSuccess
  | LoadCMPgDescFailure
  | LoadGRNPgDesc
  | LoadGRNPgDescSuccess
  | LoadGRNPgDescFailure
  | LoadABImageUrl
  | LoadABImageUrlSuccess
  | LoadABImageUrlFailure
  | LoadCMImageUrl
  | LoadCMImageUrlSuccess
  | LoadCMImageUrlFailure
  | LoadBillCancellationImageUrl
  | LoadBillCancellationImageUrlSuccess
  | LoadBillCancellationImageUrlFailure
  | LoadGRNImageUrl
  | LoadGRNImageUrlSuccess
  | LoadGRNImageUrlFailure
  | SetHoldTime
  | GetHoldTime
  | SetGrnStatus
  | SetGrnTotalReturnProducts
  | SetGrnTotalReturnValue
  | SetABSelectedRsoName
  | SetCMSelectedRsoName
  | SetGCSelectedRsoName
  | SetGcTotalCardsQty
  | SetGrfGoldWeight
  | SetWalkInsCount
  | SetWalkInsConversionCount
  | SetIsWalkInsFormInvalid
  | SetTepTotalExchangeAmount
  | SetTepTotalRefundAmount
  | SetTepTotalGrossWt
  | SetTepTotalQty
  | SetIsTepRefundFormValid
  | SetTepSelectedPaymentMethod
  | SetSelectedTepType
  | SetIsTepRequestRaising
  | SetCutPieceTepTotalQty
  | SetCutPieceTepTotalValue
  | SetMergingCNs
  | LoadMaxCashLimit
  | SetIsTepApprovalValid
  | LoadMaxCashLimitSuccess
  | LoadMaxCashLimitFailure
  | SetConfigurationAmountAdvance
  | SetFocItems
  | SetFocEligibleWtAndQty
  | LoadABOccasions
  | LoadABOccasionsSuccess
  | LoadABOccasionsFailure
  | LoadCMOccasions
  | LoadCMOccasionsSuccess
  | LoadCMOccasionsFailure
  | ClearCashMemo
  | ConfrimCashMemo
  | HoldCashMemo
  | ConvertToAdvance
  | SetCMTotalProductValues
  | SetCMOrderValues
  | SetABTotalProductValues
  | SetBillCancellationTotalProductValues
  | SetGEPTotalProductValues
  | SetABOrderNumber
  | SetCMOrderNumber
  | SetGEPOrderNumber
  | GetOrderNumber
  | SetABErrorInUpdatePrice
  | SetCMErrorInUpdatePrice
  | GetErrorInUpdatePrice
  | SetComponentInstance
  | GetComponentInstance
  | SetAbDetails
  | SetPartialCashMemoDetails
  | LoadTolerance
  | LoadToleranceSuccess
  | LoadToleranceFailure
  | LoadABTolerance
  | LoadABToleranceSuccess
  | LoadABToleranceFailure
  | LoadCMGrfTolerance
  | LoadCMGrfToleranceSuccess
  | LoadCMGrfToleranceFailure
  | LoadABGrfTolerance
  | LoadABGrfToleranceSuccess
  | LoadABGrfToleranceFailure
  | LoadMetalTypes
  | LoadMetalTypesSuccess
  | LoadMetalTypesFailure
  | ClearTolerance
  | ClearCMGrfTolerance
  | ClearABGrfTolerance
  | DisableFullPaymentCheck
  | UpdateABWeight
  | SetFrozenMinABVAlue
  | LoadBillCancellationPgDesc
  | LoadBillCancellationPgDescSuccess
  | LoadBillCancellationPgDescFailure
  | SetSameMergeGrfCustomer
  | SetFileUploadVisible
  | SetMinFrozenVAlue
  | SetDiscountDetails
  | SetTcsAmount
  | ClearTcsAmount
  | SetFinalAmount
  | SetABFinalAmount
  | SetCMOtherCharges
  | SetCMFinalAmount
  | SetTcsCollectedAmount
  | ClearTcsCollectedAmount
  | LoadFaileInvoicesDeatils
  | LoadFaileInvoicesDeatilsSuccess
  | LoadFaileInvoicesDeatilsFailure
  | SetGcOrderNumber
  | SetAcceptAdvanceOrderNumber
  | SetGrfOrderNumber
  | SetTepOrderNumber
  | ClearTcsAmountNeedToReset
  | SetTcsAmountNeedToReset
  | ClearAdvanceBooking
  | SetManualFocItems
  | LoadCMGrnTolerance
  | LoadCMGrnToleranceSuccess
  | LoadCMGrnToleranceFailure
  | LoadABGrnTolerance
  | LoadABGrnToleranceSuccess
  | LoadABGrnToleranceFailure
  | ClearCMGrnTolerance
  | ClearABGrnTolerance
  | setGrnWorkflowFlag
  | setGrnCreditNoteType
  | CloseTolerance
  | LoadImageCatalogueDetails
  | LoadImageCatalogueDetailsSuccess
  | LoadImageCatalogueDetailsFailure
  | SetAbStatus
  | SetCOTotalProductValues
  | SetMinCOVAlue
  | SetFrozenCOVAlue
  | SetCOOrderNumber
  | ClearCustomerOrder
  | SetIsIGSTFlag
  | LoadCOStandardMetalPriceDetails
  | LoadCOStandardMetalPriceDetailsFailure
  | LoadCOStandardMetalPriceDetailsSuccess
  | SetMinFrozenCOVAlue
  | SetFrozenMinCOVAlue
  | UpdateCOWeight
  | SetABGhsCustomerId
  | SetCMGhsCustomerId
  | SetCMisLegacy
  | TriggerFailedInvoicesDetails
  | TriggerFailedInvoicesDetailsSuccess
  | TriggerFailedInvoicesDetailsFailure
  | LoadCopiedInvoicesDocument
  | LoadCopiedInvoicesDocumentSuccess
  | LoadCopiedInvoicesDocumentFailure
  | ResetInvoices;
