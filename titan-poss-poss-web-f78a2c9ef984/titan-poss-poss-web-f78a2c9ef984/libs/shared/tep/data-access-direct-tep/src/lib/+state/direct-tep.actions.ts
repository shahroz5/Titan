import { Action } from '@ngrx/store';
import {
  addCutPieceTepItemInStockManagementPayload,
  addOrPatchCutPieceTepItemInStockManagementResponse,
  AddOrUpdateTepItemResponse,
  AddTepItemRequestPayload,
  BillCancelPayload,
  CancelResponse,
  CancelTEPResponse,
  confirmCutPieceTepItemInStockManagementPayload,
  ConfirmOrHoldTepRequestPayload,
  ConfirmRequestTepRequestPayload,
  ConfirmTepItemResponse,
  createOpenOrPatchCutPieceTepStockManagementResponse,
  CreateOpenTepTransactionResponse,
  CustomErrors,
  DeleteTepItemResponse,
  DiscountListPayload,
  DiscountsList,
  FileUploadDownloadPayload,
  GetTepCashMemoResponse,
  GetTepItemConfiguratonResponse,
  GetTepPriceDetailsRequestPayload,
  GetTepPriceDetailsResponse,
  GoldPlusLocation,
  patchCutPieceTepItemInStockManagementPayload,
  patchCutPieceTepStockManagementPayload,
  PatchTepRequestPayload,
  RefundCashLimit,
  RsoNameObject,
  SelectDropDownOption,
  TepItemResponse,
  TepTransactionResponse,
  UpdateTepItemRequestPayload,
  workflowPayload
} from '@poss-web/shared/models';

export enum TepActionTypes {
  SET_SELECTED_RSO_NAME = '[TEP] Selected Rso Name',
  SELECTED_CM_ITEM = '[TEP] Selected CM Item',
  TOTAL_AMT = '[TEP] Total Amt',
  CREATE_OPEN_TEP_TRANSACTION = '[TEP] Create Open Tep Transaction',
  CREATE_OPEN_TEP_TRANSACTION_SUCCESS = '[TEP] Create Open Tep Transaction Success',
  CREATE_OPEN_TEP_TRANSACTION_FAILURE = '[TEP] Create Open Tep Transaction Failure',
  UPDATE_OPEN_TEP_TRANSACTION = '[TEP] Update Open Tep Transaction',
  UPDATE_OPEN_TEP_TRANSACTION_SUCCESS = '[TEP] Update Open Tep Transaction Success',
  UPDATE_OPEN_TEP_TRANSACTION_FAILURE = '[TEP] Update Open Tep Transaction Failure',
  GET_TEP_ITEM_CONFIGURATION = '[TEP] Get Tep Item Configuration',
  GET_TEP_ITEM_CONFIGURATION_SUCCESS = '[TEP] Get Tep Item Configuration Success',
  GET_TEP_ITEM_CONFIGURATION_FAILURE = '[TEP] Get Tep Item Configuration Failure',
  GET_TEP_ITEM_EXCEPTION_CONFIGURATION = '[TEP] Get Tep Item Exception Configuration',
  GET_TEP_ITEM_EXCEPTION_CONFIGURATION_SUCCESS = '[TEP] Get Tep Item Exception Configuration Success',
  GET_TEP_ITEM_EXCEPTION_CONFIGURATION_FAILURE = '[TEP] Get Tep Item Exception Configuration Failure',
  GET_TEP_CASH_MEMO_ITEM_LIST = '[TEP] Get Tep Cash Memo Item List',
  GET_TEP_CASH_MEMO_ITEM_LIST_SUCCESS = '[TEP] Get Tep Cash Memo Item List Success',
  GET_TEP_CASH_MEMO_ITEM_LIST_FAILURE = '[TEP] Get Tep Cash Memo Item List Failure',
  LOAD_TEP_ITEM_PRICE_DETAILS = '[TEP] Load Tep Item Price Details',
  LOAD_TEP_ITEM_PRICE_DETAILS_SUCCESS = '[TEP] Load Tep Item Price Details Success',
  LOAD_TEP_ITEM_PRICE_DETAILS_FAILURE = '[TEP] Load Tep Item Price Details Failure',
  UPDATE_TEP_ITEM_PRICE_DETAILS = '[TEP] Update Tep Item Price Details',
  UPDATE_TEP_ITEM_PRICE_DETAILS_SUCCESS = '[TEP] Update Tep Item Price Details Success',
  UPDATE_TEP_ITEM_PRICE_DETAILS_FAILURE = '[TEP] Update Tep Item Price Details Failure',
  ADD_TEP_ITEM = '[TEP] Add Tep Item',
  ADD_TEP_ITEM_SUCCESS = '[TEP] Add Tep Item Success',
  ADD_TEP_ITEM_FAILURE = '[TEP] Add Tep Item Failure',
  UPDATE_TEP_ITEM = '[TEP] Update Tep Item',
  UPDATE_TEP_ITEM_SUCCESS = '[TEP] Update Tep Item Success',
  UPDATE_TEP_ITEM_FAILURE = '[TEP] Update Tep Item Failure',
  CONFIRM_TEP = '[TEP] Confirm Tep',
  CONFIRM_TEP_SUCCESS = '[TEP] Confirm Tep Success',
  CONFIRM_TEP_FAILURE = '[TEP] Confirm Tep Failure',
  DELETE_TEP_ITEM = '[TEP] Delete Tep Item',
  DELETE_TEP_ITEM_SUCCESS = '[TEP] Delete Tep Item Success',
  DELETE_TEP_ITEM_FAILURE = '[TEP] Delete Tep Item Failure',
  LOAD_RSO_LIST = '[TEP] Load Rso List',
  LOAD_RSO_LIST_SUCCESS = '[TEP] Load Rso List Success',
  LOAD_RSO_LIST_FAILURE = '[TEP] Load Rso List Failure',

  LOAD_STUDDED_PRODUCT_DETAILS = '[TEP] Load Studded Product Details',
  LOAD_STUDDED_PRODUCT_DETAILS_SUCCESS = '[TEP] Load Studded Product Details Success',
  LOAD_STUDDED_PRODUCT_DETAILS_FAILURE = '[TEP] Load Studded Product Details Failure',

  LOAD_REFUND_CASH_LIMIT = '[TEP REQUEST] LOAD REFUND CASH LIMIT',
  LOAD_REFUND_CASH_LIMIT_SUCCESS = '[TEP REQUEST] LOAD REFUND CASH LIMIT Success',
  LOAD_REFUND_CASH_LIMIT_FAILURE = '[TEP REQUEST] LOAD REFUND CASH LIMIT Failure',

  SET_REMARKS = '[TEP] Set Remarks',
  SET_TOTALQTY = '[TEP] Set Total Qty',
  SET_TOTAL_GROSS_WT = '[TEP] Set Total Gross Wt',
  SET_TOTAL_EXCHANGE_AMT = '[TEP] Set Total Exchange Amt',
  SELECTED_PAYMENT_METHOD = '[TEP] Selected Payment Method',
  SELECTED_TEP_TYPE = '[TEP] Selected Tep Type',
  SET_HOLD_TRANSACCTION_METAL_RATES = '[TEP] Hold Transaction Metal Rates',
  LOAD_TEP_ITEM_CODE_DETAILS = '[TEP] Load Tep Item Code Details',
  LOAD_TEP_ITEM_CODE_DETAILS_SUCCESS = '[TEP] Load Tep Item Code Details Success',
  LOAD_TEP_ITEM_CODE_DETAILS_FAILURE = '[TEP] Load Tep Item Code Details Failure',
  LOAD_TEP_ITEM_DETAILS = '[TEP] Load Tep Item Details',
  LOAD_TEP_ITEM_DETAILS_SUCCESS = '[TEP] Load Tep Item Details Success',
  LOAD_TEP_ITEM_DETAILS_FAILURE = '[TEP] Load Tep Item Details Failure',
  LOAD_TEP_TRANSACTION_DETAILS = '[TEP] Load Tep Transaction Details',
  LOAD_TEP_TRANSACTION_DETAILS_SUCCESS = '[TEP] Load Tep Transaction Details Success',
  LOAD_TEP_TRANSACTION_DETAILS_FAILURE = '[TEP] Load Tep Transaction Details Failure',
  DELETE_TEP_TRANSACTION_DETAILS = '[TEP] Delete Tep Transaction Details',
  DELETE_TEP_TRANSACTION_DETAILS_SUCCESS = '[TEP] Delete Tep Transaction Details Success',
  DELETE_TEP_TRANSACTION_DETAILS_FAILURE = '[TEP] Delete Tep Transaction Details Failure',
  SET_CUT_PIECE_TOTAL_VALUE = '[CUT PIECE] Set Cut Piece Total Value',
  SET_CUT_PIECE_TOTAL_QTY = '[CUT PIECE] Set Cut Piece Total Qty',
  LOAD_TEP_ITEM_CUT_PIECE_DETAILS = '[CUT PIECE] Load Tep Item Cut Piece Details',
  LOAD_TEP_ITEM_CUT_PIECE_DETAILS_SUCCESS = '[CUT PIECE] Load Tep Item Cut Piece Details Success',
  LOAD_TEP_ITEM_CUT_PIECE_DETAILS_FAILURE = '[CUT PIECE] Load Tep Item Cut Piece Details Failure',
  RESET_TEP = '[TEP] Reset TEP',
  LOAD_CM_LIST_ITEM_TEP_CONFIGURATION = '[TEP] Load Cm List Item Tep Configuration',
  LOAD_CM_LIST_ITEM_TEP_CONFIGURATION_SUCCESS = '[TEP] Load Cm List Item Tep Success Configuration',
  LOAD_CM_LIST_ITEM_TEP_CONFIGURATION_FAILURE = '[TEP] Load Cm List Item Tep Failure Configuration',
  SET_IS_REFUND_FORM_VALID = '[TEP] Set Is Refund Form Valid',
  SET_IS_REQUEST_RAISING_SCENARIO = '[TEP] Set Is Request Raising Scenario',
  LOAD_GOLD_PLUS_LOCATIONS = '[TEP]Load Gold Plus Locations',
  LOAD_GOLD_PLUS_LOCATIONS_SUCCESS = '[TEP]Load Gold Plus Locations Success',
  LOAD_GOLD_PLUS_LOCATIONS_FAILURE = '[TEP]Load Gold Plus Locations Failure',
  FILE_UPLOAD = '[TEP] File Upload',
  FILE_UPLOAD_SUCCESS = '[TEP] File Upload Success',
  FILE_UPLOAD_FAILURE = '[TEP] File Upload Failure',
  FILE_DOWNLOAD_URL = '[TEP] File Download Url',
  FILE_DOWNLOAD_URL_SUCCESS = '[TEP] File Download Url Success',
  FILE_DOWNLOAD_URL_FAILURE = '[TEP] File Download Url Failure',
  LOAD_WORKFLOW_DETAILS = '[TEP] Load Workflow Details TEP ',
  LOAD_WORKFLOW_DETAILS_SUCCESS = '[TEP] Load Workflow Details TEP Success',
  LOAD_WORKFLOW_DETAILS_FAILURE = '[TEP] Load Workflow Details TEP Failure',
  FILE_ID_PROOF_DOWNLOAD_URL = '[TEP] File Id Proof Download Url',
  FILE_CANCELLED_CHEQUE_DOWNLOAD_URL = '[TEP] File Cancelled Cheque Download Url',
  FILE_APPROVAL_MAIL_DOWNLOAD_URL = '[TEP] File Approval Mail Download Url',
  FILE_ID_PROOF_DOWNLOAD_URL_SUCCESS = '[TEP] File Id Proof Download Url Success',
  FILE_CANCELLED_CHEQUE_DOWNLOAD_URL_SUCCESS = '[TEP] File Cancelled Cheque Download Url Success',
  FILE_APPROVAL_MAIL_DOWNLOAD_URL_SUCCESS = '[TEP] File Approval Mail Download Url Success',
  FILE_ID_PROOF_DOWNLOAD_URL_FAILURE = '[TEP] File Id Proof Download Url Failure',
  FILE_CANCELLED_CHEQUE_DOWNLOAD_URL_FAILURE = '[TEP] File Cancelled Cheque Download Url Failure',
  FILE_APPROVAL_MAIL_DOWNLOAD_URL_FAILURE = '[TEP] File Approval Mail Download Url Failure',
  CANCEL = '[TEP]  Cancellation',
  CANCEL_SUCCESS = '[TEP] Cancellation Success',
  CANCEL_FAILURE = '[TEP]  Cancellation Failure',
  CANCEL_TEP = '[TEP]  Cancel TEP',
  CANCEL_TEP_SUCCESS = '[TEP] Cancel TEP Success',
  CANCEL_TEP_FAILURE = '[TEP]  Cancel TEP Failure',
  CONFIRM_TEP_REQUEST = '[TEP] Confirm Tep Request',
  CONFIRM_TEP_REQUEST_SUCCESS = '[TEP] Confirm Tep Request Success',
  CONFIRM_TEP_REQUEST_FAILURE = '[TEP] Confirm Tep Request Failure',
  LOAD_FTEP_REASONS = '[TEP] LOAD FTEP REASONS',
  LOAD_FTEP_REASONS_SUCCESS = '[TEP] LOAD FTEP REASONS SUCCESS',
  LOAD_FTEP_REASONS_FAILURE = '[TEP] LOAD FTEP REASONS FAILURE',
  UPDATE_TEP_TRANSACTION_PRICE_DETAILS = '[TEP] UPDATE TEP TRANSACTION PRICE DETAILS',
  UPDATE_TEP_TRANSACTION_PRICE_DETAILS_SUCCESS = '[TEP] UPDATE TEP TRANSACTION PRICE DETAILS SUCCESS',
  UPDATE_TEP_TRANSACTION_PRICE_DETAILS_FAILURE = '[TEP] UPDATE TEP TRANSACTION PRICE DETAILS FAILURE',

  CREATE_OPEN_CUT_PIECE_TEP_TRANSACTION = '[TEP] CREATE OPEN CUT PIECE TEP TRANSACTION',
  CREATE_OPEN_CUT_PIECE_TEP_TRANSACTION_SUCCESS = '[TEP] CREATE OPEN CUT PIECE TEP TRANSACTION SUCCESS',
  CREATE_OPEN_CUT_PIECE_TEP_TRANSACTION_FAILURE = '[TEP] CREATE OPEN CUT PIECE TEP TRANSACTION FAILURE',
  PATCH_CUT_PIECE_TEP_TRANSACTION = '[TEP] PATCH CUT PIECE TEP TRANSACTION',
  PATCH_CUT_PIECE_TEP_TRANSACTION_SUCCESS = '[TEP] PATCH CUT PIECE TEP TRANSACTION SUCCESS',
  PATCH_CUT_PIECE_TEP_TRANSACTION_FAILURE = '[TEP] PATCH CUT PIECE TEP TRANSACTION FAILURE',
  ADD_CUT_PIECE_TEP_ITEM = '[TEP] ADD CUT PIECE TEP ITEM',
  ADD_CUT_PIECE_TEP_ITEM_SUCCESS = '[TEP] ADD CUT PIECE TEP ITEM SUCCESS',
  ADD_CUT_PIECE_TEP_ITEM_FAILURE = '[TEP] ADD CUT PIECE TEP ITEM FAILURE',
  PATCH_CUT_PIECE_TEP_ITEM = '[TEP] PATCH CUT PIECE TEP ITEM',
  PATCH_CUT_PIECE_TEP_ITEM_SUCCESS = '[TEP] PATCH CUT PIECE TEP ITEM SUCCESS',
  PATCH_CUT_PIECE_TEP_ITEM_FAILURE = '[TEP] PATCH CUT PIECE TEP ITEM FAILURE',
  CONFIRM_CUT_PIECE_TEP_TRANSACTION = '[TEP] CONFIRM CUT PIECE TEP TRANSACTION',
  CONFIRM_CUT_PIECE_TEP_TRANSACTION_SUCCESS = '[TEP] CONFIRM CUT PIECE TEP TRANSACTION SUCCESS',
  CONFIRM_CUT_PIECE_TEP_TRANSACTION_FAILURE = '[TEP] CONFIRM CUT PIECE TEP TRANSACTION FAILURE',
  LOAD_AVAILABLE_DISCOUNTS_LIST = '[TEP] LOAD AVAILABLE DISCOUNTS LIST',
  LOAD_AVAILABLE_DISCOUNTS_LIST_SUCCESS = '[TEP] LOAD AVAILABLE DISCOUNTS LIST SUCCESS',
  LOAD_AVAILABLE_DISCOUNTS_LIST_FAILURE = '[TEP] LOAD AVAILABLE DISCOUNTS LIST FAILURE'
}

export class SetSelectedRsoName implements Action {
  readonly type = TepActionTypes.SET_SELECTED_RSO_NAME;
  constructor(readonly payload: SelectDropDownOption) {}
}

export class CreateOpenTepTransaction implements Action {
  readonly type = TepActionTypes.CREATE_OPEN_TEP_TRANSACTION;
  constructor(
    readonly subTransactionType: string,
    readonly requestPayload: any
  ) {}
}

export class CreateOpenTepTransactionSuccess implements Action {
  readonly type = TepActionTypes.CREATE_OPEN_TEP_TRANSACTION_SUCCESS;
  constructor(readonly payload: CreateOpenTepTransactionResponse) {}
}

export class CreateOpenTepTransactionFailure implements Action {
  readonly type = TepActionTypes.CREATE_OPEN_TEP_TRANSACTION_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class UpdateOpenTepTransaction implements Action {
  readonly type = TepActionTypes.UPDATE_OPEN_TEP_TRANSACTION;
  constructor(
    readonly id: string,
    readonly subTransactionType: string,
    readonly requestPayload: PatchTepRequestPayload
  ) {}
}

export class UpdateOpenTepTransactionSuccess implements Action {
  readonly type = TepActionTypes.UPDATE_OPEN_TEP_TRANSACTION_SUCCESS;
  constructor(readonly payload: CreateOpenTepTransactionResponse) {}
}

export class UpdateOpenTepTransactionFailure implements Action {
  readonly type = TepActionTypes.UPDATE_OPEN_TEP_TRANSACTION_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class GetTepItemConfiguration implements Action {
  readonly type = TepActionTypes.GET_TEP_ITEM_CONFIGURATION;
  constructor(
    readonly itemCode: string,
    readonly tepType: string,
    readonly isDummy?: boolean,
    readonly customerMobileNo?: string
  ) {}
}

export class GetTepItemConfigurationSuccess implements Action {
  readonly type = TepActionTypes.GET_TEP_ITEM_CONFIGURATION_SUCCESS;
  constructor(readonly payload: GetTepItemConfiguratonResponse) {}
}

export class GetTepItemConfigurationFailure implements Action {
  readonly type = TepActionTypes.GET_TEP_ITEM_CONFIGURATION_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class GetTepItemExceptionConfiguration implements Action {
  readonly type = TepActionTypes.GET_TEP_ITEM_EXCEPTION_CONFIGURATION;
  constructor(
    readonly itemCode: string,
    readonly tepType: string,
    readonly isDummy?: boolean,
    readonly customerMobileNo?: string
  ) {}
}

export class GetTepItemExceptionConfigurationSuccess implements Action {
  readonly type = TepActionTypes.GET_TEP_ITEM_EXCEPTION_CONFIGURATION_SUCCESS;
  constructor(readonly payload: GetTepItemConfiguratonResponse) {}
}

export class GetTepItemExceptionConfigurationFailure implements Action {
  readonly type = TepActionTypes.GET_TEP_ITEM_EXCEPTION_CONFIGURATION_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class LoadWorkflowDeatils implements Action {
  readonly type = TepActionTypes.LOAD_WORKFLOW_DETAILS;

  constructor(readonly payload: workflowPayload) {}
}

export class LoadWorkflowDeatilsSuccess implements Action {
  readonly type = TepActionTypes.LOAD_WORKFLOW_DETAILS_SUCCESS;
  constructor(readonly payload: any) {}
}
export class LoadWorkflowDeatilsFailure implements Action {
  readonly type = TepActionTypes.LOAD_WORKFLOW_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class GetTepCashMemoItemList implements Action {
  readonly type = TepActionTypes.GET_TEP_CASH_MEMO_ITEM_LIST;
  constructor(
    readonly locationCode: string,
    readonly refDocNo: string,
    readonly refFiscalYear: string,
    readonly subTransactionType: string,
    readonly mobileNumber: string
  ) {}
}

export class GetTepCashMemoItemListSuccess implements Action {
  readonly type = TepActionTypes.GET_TEP_CASH_MEMO_ITEM_LIST_SUCCESS;
  constructor(readonly payload: GetTepCashMemoResponse) {}
}

export class GetTepCashMemoItemListFailure implements Action {
  readonly type = TepActionTypes.GET_TEP_CASH_MEMO_ITEM_LIST_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadRefundCashLimit implements Action {
  readonly type = TepActionTypes.LOAD_REFUND_CASH_LIMIT;

  constructor(
    readonly customerId: number,
    readonly refundAmt: number,
    readonly txnType: string
  ) {}
}

export class LoadRefundCashLimitSuccess implements Action {
  readonly type = TepActionTypes.LOAD_REFUND_CASH_LIMIT_SUCCESS;
  constructor(readonly payload: RefundCashLimit) {}
}
export class LoadRefundCashLimitFailure implements Action {
  readonly type = TepActionTypes.LOAD_REFUND_CASH_LIMIT_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadTepItemPriceDetails implements Action {
  readonly type = TepActionTypes.LOAD_TEP_ITEM_PRICE_DETAILS;
  constructor(
    readonly requestPayload: GetTepPriceDetailsRequestPayload,
    readonly locationCode?: string,
    readonly customerId?: number,
    readonly customerType?: string,
    readonly tepType?: string,
    readonly isFullValueTep?: boolean
  ) {}
}

export class LoadTepItemPriceDetailsSuccess implements Action {
  readonly type = TepActionTypes.LOAD_TEP_ITEM_PRICE_DETAILS_SUCCESS;
  constructor(readonly payload: GetTepPriceDetailsResponse) {}
}

export class LoadTepItemPriceDetailsFailure implements Action {
  readonly type = TepActionTypes.LOAD_TEP_ITEM_PRICE_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class UpdateTepItemPriceDetails implements Action {
  readonly type = TepActionTypes.UPDATE_TEP_ITEM_PRICE_DETAILS;
  constructor(readonly requestPayload: GetTepPriceDetailsRequestPayload) {}
}

export class UpdateTepItemPriceDetailsSuccess implements Action {
  readonly type = TepActionTypes.UPDATE_TEP_ITEM_PRICE_DETAILS_SUCCESS;
  constructor(readonly payload: GetTepPriceDetailsResponse) {}
}

export class UpdateTepItemPriceDetailsFailure implements Action {
  readonly type = TepActionTypes.UPDATE_TEP_ITEM_PRICE_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class AddTepItem implements Action {
  readonly type = TepActionTypes.ADD_TEP_ITEM;
  constructor(
    readonly id: string,
    readonly subTransactionType: string,
    readonly requestPayload: AddTepItemRequestPayload
  ) {}
}

export class AddTepItemSuccess implements Action {
  readonly type = TepActionTypes.ADD_TEP_ITEM_SUCCESS;
  constructor(readonly payload: AddOrUpdateTepItemResponse) {}
}

export class AddTepItemFailure implements Action {
  readonly type = TepActionTypes.ADD_TEP_ITEM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class UpdateTepItem implements Action {
  readonly type = TepActionTypes.UPDATE_TEP_ITEM;
  constructor(
    readonly id: string,
    readonly itemId: string,
    readonly subTransactionType: string,
    readonly requestPayload: UpdateTepItemRequestPayload
  ) {}
}

export class UpdateTepItemSuccess implements Action {
  readonly type = TepActionTypes.UPDATE_TEP_ITEM_SUCCESS;
  constructor(readonly payload: AddOrUpdateTepItemResponse) {}
}

export class UpdateTepItemFailure implements Action {
  readonly type = TepActionTypes.UPDATE_TEP_ITEM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ConfirmTep implements Action {
  readonly type = TepActionTypes.CONFIRM_TEP;
  constructor(
    readonly id: string,
    readonly status: string,
    readonly subTransactionType: string,
    readonly requestPayload: ConfirmOrHoldTepRequestPayload
  ) {}
}

export class ConfirmTepSuccess implements Action {
  readonly type = TepActionTypes.CONFIRM_TEP_SUCCESS;
  constructor(readonly payload: ConfirmTepItemResponse) {}
}

export class ConfirmTepFailure implements Action {
  readonly type = TepActionTypes.CONFIRM_TEP_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class DeleteTepItem implements Action {
  readonly type = TepActionTypes.DELETE_TEP_ITEM;
  constructor(
    readonly id: string,
    readonly itemId: string,
    readonly subTransactionType: string
  ) {}
}

export class DeleteTepItemSuccess implements Action {
  readonly type = TepActionTypes.DELETE_TEP_ITEM_SUCCESS;
  constructor(readonly payload: DeleteTepItemResponse) {}
}

export class DeleteTepItemFailure implements Action {
  readonly type = TepActionTypes.DELETE_TEP_ITEM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadRsoList implements Action {
  readonly type = TepActionTypes.LOAD_RSO_LIST;
  constructor(readonly payload: string) {}
}

export class LoadRsoListSuccess implements Action {
  readonly type = TepActionTypes.LOAD_RSO_LIST_SUCCESS;
  constructor(readonly payload: RsoNameObject[]) {}
}

export class LoadRsoListFailure implements Action {
  readonly type = TepActionTypes.LOAD_RSO_LIST_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadStuddedProductDetails implements Action {
  readonly type = TepActionTypes.LOAD_STUDDED_PRODUCT_DETAILS;
  constructor(readonly productType: string, readonly transactionType: string) {}
}

export class LoadStuddedProductDetailsSuccess implements Action {
  readonly type = TepActionTypes.LOAD_STUDDED_PRODUCT_DETAILS_SUCCESS;
  constructor(readonly payload: string[]) {}
}

export class LoadStuddedProductDetailsFailure implements Action {
  readonly type = TepActionTypes.LOAD_STUDDED_PRODUCT_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class LoadTepItemCodeDetails implements Action {
  readonly type = TepActionTypes.LOAD_TEP_ITEM_CODE_DETAILS;
  constructor(readonly itemCode: string) {}
}

export class LoadTepItemCodeDetailsSuccess implements Action {
  readonly type = TepActionTypes.LOAD_TEP_ITEM_CODE_DETAILS_SUCCESS;
  constructor(readonly payload: string) {}
}

export class LoadTepItemCodeDetailsFailure implements Action {
  readonly type = TepActionTypes.LOAD_TEP_ITEM_CODE_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadTepItemDetails implements Action {
  readonly type = TepActionTypes.LOAD_TEP_ITEM_DETAILS;
  constructor(
    readonly id: string,
    readonly itemId: string,
    readonly subTransactionType: string,
    readonly tepType?: string,
    readonly mobileNumber?: string
  ) {}
}

export class LoadTepItemDetailsSuccess implements Action {
  readonly type = TepActionTypes.LOAD_TEP_ITEM_DETAILS_SUCCESS;
  constructor(readonly payload: TepItemResponse) {}
}

export class LoadTepItemDetailsFailure implements Action {
  readonly type = TepActionTypes.LOAD_TEP_ITEM_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadTepTransactionDetails implements Action {
  readonly type = TepActionTypes.LOAD_TEP_TRANSACTION_DETAILS;
  constructor(
    readonly id: string,
    readonly subTransactionType: string,
    readonly recalculate?: boolean,
    readonly isTepException?: boolean
  ) {}
}

export class LoadTepTransactionDetailsSuccess implements Action {
  readonly type = TepActionTypes.LOAD_TEP_TRANSACTION_DETAILS_SUCCESS;
  constructor(readonly payload: TepTransactionResponse) {}
}

export class LoadTepTransactionDetailsFailure implements Action {
  readonly type = TepActionTypes.LOAD_TEP_TRANSACTION_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class DeleteTepTransactionDetails implements Action {
  readonly type = TepActionTypes.DELETE_TEP_TRANSACTION_DETAILS;
  constructor(readonly id: string, readonly subTransactionType: string) {}
}

export class DeleteTepTransactionDetailsSuccess implements Action {
  readonly type = TepActionTypes.DELETE_TEP_TRANSACTION_DETAILS_SUCCESS;
  constructor(readonly payload: any) {}
}

export class DeleteTepTransactionDetailsFailure implements Action {
  readonly type = TepActionTypes.DELETE_TEP_TRANSACTION_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class SetRemarks implements Action {
  readonly type = TepActionTypes.SET_REMARKS;
  constructor(readonly payload: string) {}
}

export class SetTotalQty implements Action {
  readonly type = TepActionTypes.SET_TOTALQTY;
  constructor(readonly payload: number) {}
}

export class SetTotalGrossWt implements Action {
  readonly type = TepActionTypes.SET_TOTAL_GROSS_WT;
  constructor(readonly payload: number) {}
}

export class SetTotalExchangeAmt implements Action {
  readonly type = TepActionTypes.SET_TOTAL_EXCHANGE_AMT;
  constructor(readonly payload: number) {}
}

export class SetHoldTransactionMetalRates implements Action {
  readonly type = TepActionTypes.SET_HOLD_TRANSACCTION_METAL_RATES;
  constructor(readonly payload: any) {}
}

export class SelectedPaymentMethod implements Action {
  readonly type = TepActionTypes.SELECTED_PAYMENT_METHOD;
  constructor(readonly payload: string) {}
}

export class SelectedTepType implements Action {
  readonly type = TepActionTypes.SELECTED_TEP_TYPE;
  constructor(readonly payload: string) {}
}

export class ResetTep implements Action {
  readonly type = TepActionTypes.RESET_TEP;
}

export class SetTepItemProductCode implements Action {
  readonly type = TepActionTypes.LOAD_TEP_ITEM_CODE_DETAILS_SUCCESS;
  constructor(readonly payload: string) {}
}

export class SetCutPieceTotalQty implements Action {
  readonly type = TepActionTypes.SET_CUT_PIECE_TOTAL_QTY;
  constructor(readonly payload: number) {}
}

export class SetCutPieceTotalValue implements Action {
  readonly type = TepActionTypes.SET_CUT_PIECE_TOTAL_VALUE;
  constructor(readonly payload: number) {}
}
export class LoadCmListItemTepConfiguration implements Action {
  readonly type = TepActionTypes.LOAD_CM_LIST_ITEM_TEP_CONFIGURATION;
  constructor(
    readonly itemCode: string,
    readonly tepType: string,
    readonly isDummy?: boolean,
    readonly customerMobileNo?: string
  ) {}
}

export class LoadCmListItemTepConfigurationSuccess implements Action {
  readonly type = TepActionTypes.LOAD_CM_LIST_ITEM_TEP_CONFIGURATION_SUCCESS;
  constructor(readonly payload: GetTepItemConfiguratonResponse) {}
}

export class LoadCmListItemTepConfigurationFailure implements Action {
  readonly type = TepActionTypes.LOAD_CM_LIST_ITEM_TEP_CONFIGURATION_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class SetIsRefundFormValid implements Action {
  readonly type = TepActionTypes.SET_IS_REFUND_FORM_VALID;
  constructor(readonly isValid: boolean) {}
}

export class SetIsRequestRaisingScenario implements Action {
  readonly type = TepActionTypes.SET_IS_REQUEST_RAISING_SCENARIO;
  constructor(readonly payload: boolean) {}
}

export class LoadGoldPlusLocations implements Action {
  readonly type = TepActionTypes.LOAD_GOLD_PLUS_LOCATIONS;
  constructor(readonly payload?: boolean) {}
}

export class LoadGoldPlusLocationsSuccess implements Action {
  readonly type = TepActionTypes.LOAD_GOLD_PLUS_LOCATIONS_SUCCESS;
  constructor(readonly payload: GoldPlusLocation[]) {}
}

export class LoadGoldPlusLocationsFailure implements Action {
  readonly type = TepActionTypes.LOAD_GOLD_PLUS_LOCATIONS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class FileUpload implements Action {
  readonly type = TepActionTypes.FILE_UPLOAD;
  constructor(public payload: FileUploadDownloadPayload) {}
}

export class FileUploadSuccess implements Action {
  readonly type = TepActionTypes.FILE_UPLOAD_SUCCESS;
  constructor(public payload: boolean) {}
}

export class FileUploadFailure implements Action {
  readonly type = TepActionTypes.FILE_UPLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FileIdProofDownloadUrl implements Action {
  readonly type = TepActionTypes.FILE_ID_PROOF_DOWNLOAD_URL;
  constructor(public payload: FileUploadDownloadPayload) {}
}

export class FileCancelledChequeDownloadUrl implements Action {
  readonly type = TepActionTypes.FILE_CANCELLED_CHEQUE_DOWNLOAD_URL;
  constructor(public payload: FileUploadDownloadPayload) {}
}

export class FileApprovalMailDownloadUrl implements Action {
  readonly type = TepActionTypes.FILE_APPROVAL_MAIL_DOWNLOAD_URL;
  constructor(public payload: FileUploadDownloadPayload) {}
}
export class FileIdProofDownloadUrlSuccess implements Action {
  readonly type = TepActionTypes.FILE_ID_PROOF_DOWNLOAD_URL_SUCCESS;
  constructor(public payload: string) {}
}

export class FileCancelledChequeDownloadUrlSuccess implements Action {
  readonly type = TepActionTypes.FILE_CANCELLED_CHEQUE_DOWNLOAD_URL_SUCCESS;
  constructor(public payload: string) {}
}

export class FileApprovalMailDownloadUrlSuccess implements Action {
  readonly type = TepActionTypes.FILE_APPROVAL_MAIL_DOWNLOAD_URL_SUCCESS;
  constructor(public payload: string) {}
}

export class FileIdProofDownloadUrlFailure implements Action {
  readonly type = TepActionTypes.FILE_ID_PROOF_DOWNLOAD_URL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FileCancelledChequeDownloadUrlFailure implements Action {
  readonly type = TepActionTypes.FILE_CANCELLED_CHEQUE_DOWNLOAD_URL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FileApprovalMailDownloadUrlFailure implements Action {
  readonly type = TepActionTypes.FILE_APPROVAL_MAIL_DOWNLOAD_URL_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class CancelRequest implements Action {
  readonly type = TepActionTypes.CANCEL;
  constructor(readonly processID: string, readonly workflow: string) {}
}

export class CancelRequestSuccess implements Action {
  readonly type = TepActionTypes.CANCEL_SUCCESS;
  constructor(readonly payload: CancelTEPResponse) {}
}

export class CancelRequestFailure implements Action {
  readonly type = TepActionTypes.CANCEL_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class CancelTEPRequest implements Action {
  readonly type = TepActionTypes.CANCEL_TEP;
  constructor(readonly paylaod: BillCancelPayload) {}
}

export class CancelTEPRequestSuccess implements Action {
  readonly type = TepActionTypes.CANCEL_TEP_SUCCESS;
  constructor(readonly payload: CancelResponse) {}
}

export class CancelTEPRequestFailure implements Action {
  readonly type = TepActionTypes.CANCEL_TEP_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class ConfirmTepRequest implements Action {
  readonly type = TepActionTypes.CONFIRM_TEP_REQUEST;
  constructor(
    readonly id: string,
    readonly status: string,
    readonly subTransactionType: string,
    readonly workflowType: string,
    readonly requestPayload: ConfirmRequestTepRequestPayload
  ) {}
}

export class ConfirmTepRequestSuccess implements Action {
  readonly type = TepActionTypes.CONFIRM_TEP_REQUEST_SUCCESS;
  constructor(readonly payload: ConfirmTepItemResponse) {}
}

export class ConfirmTepRequestFailure implements Action {
  readonly type = TepActionTypes.CONFIRM_TEP_REQUEST_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadFtepReasons implements Action {
  readonly type = TepActionTypes.LOAD_FTEP_REASONS;
}

export class LoadFtepReasonsSuccess implements Action {
  readonly type = TepActionTypes.LOAD_FTEP_REASONS_SUCCESS;
  constructor(readonly payload: string[]) {}
}

export class LoadFtepReasonsFailure implements Action {
  readonly type = TepActionTypes.LOAD_FTEP_REASONS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class UpdateTepTransactionPriceDetails implements Action {
  readonly type = TepActionTypes.UPDATE_TEP_TRANSACTION_PRICE_DETAILS;
  constructor(readonly id: string, readonly subTxnType: string) {}
}

export class UpdateTepTransactionPriceDetailsSuccess implements Action {
  readonly type = TepActionTypes.UPDATE_TEP_TRANSACTION_PRICE_DETAILS_SUCCESS;
  constructor(readonly payload: any) {}
}

export class UpdateTepTransactionPriceDetailsFailure implements Action {
  readonly type = TepActionTypes.UPDATE_TEP_TRANSACTION_PRICE_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class CreateOpenCutPieceTepTransaction implements Action {
  readonly type = TepActionTypes.CREATE_OPEN_CUT_PIECE_TEP_TRANSACTION;
}

export class CreateOpenCutPieceTepTransactionSuccess implements Action {
  readonly type = TepActionTypes.CREATE_OPEN_CUT_PIECE_TEP_TRANSACTION_SUCCESS;
  constructor(
    readonly payload: createOpenOrPatchCutPieceTepStockManagementResponse
  ) {}
}

export class CreateOpenCutPieceTepTransactionFailure implements Action {
  readonly type = TepActionTypes.CREATE_OPEN_CUT_PIECE_TEP_TRANSACTION_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class PatchCutPieceTepTransaction implements Action {
  readonly type = TepActionTypes.PATCH_CUT_PIECE_TEP_TRANSACTION;
  constructor(
    readonly id: string,
    readonly payload: patchCutPieceTepStockManagementPayload
  ) {}
}

export class PatchCutPieceTepTransactionSuccess implements Action {
  readonly type = TepActionTypes.PATCH_CUT_PIECE_TEP_TRANSACTION_SUCCESS;
  constructor(
    readonly payload: createOpenOrPatchCutPieceTepStockManagementResponse
  ) {}
}

export class PatchCutPieceTepTransactionFailure implements Action {
  readonly type = TepActionTypes.PATCH_CUT_PIECE_TEP_TRANSACTION_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class AddCutPieceTepItem implements Action {
  readonly type = TepActionTypes.ADD_CUT_PIECE_TEP_ITEM;
  constructor(
    readonly id: string,
    readonly payload: addCutPieceTepItemInStockManagementPayload
  ) {}
}

export class AddCutPieceTepItemSuccess implements Action {
  readonly type = TepActionTypes.ADD_CUT_PIECE_TEP_ITEM_SUCCESS;
  constructor(
    readonly payload: addOrPatchCutPieceTepItemInStockManagementResponse
  ) {}
}

export class AddCutPieceTepItemFailure implements Action {
  readonly type = TepActionTypes.ADD_CUT_PIECE_TEP_ITEM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class PatchCutPieceTepItem implements Action {
  readonly type = TepActionTypes.PATCH_CUT_PIECE_TEP_ITEM;
  constructor(
    readonly id: string,
    readonly itemId: string,
    readonly payload: patchCutPieceTepItemInStockManagementPayload
  ) {}
}

export class PatchCutPieceTepItemSuccess implements Action {
  readonly type = TepActionTypes.PATCH_CUT_PIECE_TEP_ITEM_SUCCESS;
  constructor(
    readonly payload: addOrPatchCutPieceTepItemInStockManagementResponse
  ) {}
}

export class PatchCutPieceTepItemFailure implements Action {
  readonly type = TepActionTypes.PATCH_CUT_PIECE_TEP_ITEM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ConfirmCutPieceTepTransaction implements Action {
  readonly type = TepActionTypes.CONFIRM_CUT_PIECE_TEP_TRANSACTION;
  constructor(
    readonly id: string,
    readonly payload: confirmCutPieceTepItemInStockManagementPayload
  ) {}
}

export class ConfirmCutPieceTepTransactionSuccess implements Action {
  readonly type = TepActionTypes.CONFIRM_CUT_PIECE_TEP_TRANSACTION_SUCCESS;
  constructor(readonly payload: any) {}
}

export class ConfirmCutPieceTepTransactionFailure implements Action {
  readonly type = TepActionTypes.CONFIRM_CUT_PIECE_TEP_TRANSACTION_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadAvailableDiscountsList implements Action {
  readonly type = TepActionTypes.LOAD_AVAILABLE_DISCOUNTS_LIST;
  constructor(readonly payload: DiscountListPayload) {}
}

export class LoadAvailableDiscountsListSuccess implements Action {
  readonly type = TepActionTypes.LOAD_AVAILABLE_DISCOUNTS_LIST_SUCCESS;
  constructor(readonly payload: DiscountsList[]) {}
}

export class LoadAvailableDiscountsListFailure implements Action {
  readonly type = TepActionTypes.LOAD_AVAILABLE_DISCOUNTS_LIST_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export type TepActions =
  | SetSelectedRsoName
  | CreateOpenTepTransaction
  | CreateOpenTepTransactionSuccess
  | CreateOpenTepTransactionFailure
  | UpdateOpenTepTransaction
  | UpdateOpenTepTransactionSuccess
  | UpdateOpenTepTransactionFailure
  | GetTepItemConfiguration
  | GetTepItemConfigurationSuccess
  | GetTepItemConfigurationFailure
  | GetTepItemExceptionConfiguration
  | GetTepItemExceptionConfigurationSuccess
  | GetTepItemExceptionConfigurationFailure
  | GetTepCashMemoItemList
  | GetTepCashMemoItemListSuccess
  | GetTepCashMemoItemListFailure
  | LoadTepItemPriceDetails
  | LoadTepItemPriceDetailsSuccess
  | LoadTepItemPriceDetailsFailure
  | AddTepItem
  | CancelTEPRequest
  | CancelTEPRequestFailure
  | CancelTEPRequestSuccess
  | AddTepItemSuccess
  | AddTepItemFailure
  | UpdateTepItem
  | UpdateTepItemSuccess
  | UpdateTepItemFailure
  | ConfirmTep
  | ConfirmTepSuccess
  | ConfirmTepFailure
  | DeleteTepItem
  | DeleteTepItemSuccess
  | DeleteTepItemFailure
  | LoadRsoList
  | LoadRsoListSuccess
  | LoadRsoListFailure
  | LoadTepItemDetails
  | LoadTepItemDetailsSuccess
  | LoadTepItemDetailsFailure
  | LoadTepTransactionDetails
  | LoadTepTransactionDetailsSuccess
  | LoadTepTransactionDetailsFailure
  | DeleteTepTransactionDetails
  | DeleteTepTransactionDetailsSuccess
  | DeleteTepTransactionDetailsFailure
  | SetRemarks
  | SetTotalQty
  | SetTotalExchangeAmt
  | SetTotalGrossWt
  | SelectedPaymentMethod
  | SelectedTepType
  | ResetTep
  | LoadTepItemCodeDetails
  | LoadTepItemCodeDetailsSuccess
  | LoadTepItemCodeDetailsFailure
  | SetTepItemProductCode
  | SetCutPieceTotalQty
  | SetCutPieceTotalValue
  | LoadCmListItemTepConfiguration
  | LoadCmListItemTepConfigurationSuccess
  | LoadCmListItemTepConfigurationFailure
  | SetIsRefundFormValid
  | SetIsRequestRaisingScenario
  | LoadGoldPlusLocations
  | LoadGoldPlusLocationsSuccess
  | LoadGoldPlusLocationsFailure
  | FileUpload
  | LoadWorkflowDeatils
  | LoadWorkflowDeatilsSuccess
  | LoadWorkflowDeatilsFailure
  | LoadCmListItemTepConfigurationFailure
  | FileUploadSuccess
  | FileUploadFailure
  | FileIdProofDownloadUrl
  | FileCancelledChequeDownloadUrl
  | FileApprovalMailDownloadUrl
  | FileIdProofDownloadUrlSuccess
  | FileCancelledChequeDownloadUrlSuccess
  | FileApprovalMailDownloadUrlSuccess
  | FileIdProofDownloadUrlFailure
  | FileCancelledChequeDownloadUrlFailure
  | FileApprovalMailDownloadUrlFailure
  | CancelRequest
  | UpdateTepItemPriceDetails
  | UpdateTepItemPriceDetailsSuccess
  | UpdateTepItemPriceDetailsFailure
  | CancelRequestFailure
  | CancelRequestSuccess
  | ConfirmTepRequest
  | ConfirmTepRequestSuccess
  | ConfirmTepRequestFailure
  | LoadFtepReasons
  | LoadFtepReasonsSuccess
  | LoadFtepReasonsFailure
  | UpdateTepTransactionPriceDetails
  | UpdateTepTransactionPriceDetailsSuccess
  | UpdateTepTransactionPriceDetailsFailure
  | CreateOpenCutPieceTepTransaction
  | CreateOpenCutPieceTepTransactionSuccess
  | CreateOpenCutPieceTepTransactionFailure
  | PatchCutPieceTepTransaction
  | PatchCutPieceTepTransactionSuccess
  | PatchCutPieceTepTransactionFailure
  | AddCutPieceTepItem
  | AddCutPieceTepItemSuccess
  | AddCutPieceTepItemFailure
  | PatchCutPieceTepItem
  | PatchCutPieceTepItemSuccess
  | PatchCutPieceTepItemFailure
  | ConfirmCutPieceTepTransaction
  | ConfirmCutPieceTepTransactionSuccess
  | ConfirmCutPieceTepTransactionFailure
  | LoadAvailableDiscountsList
  | LoadAvailableDiscountsListSuccess
  | LoadAvailableDiscountsListFailure
  | LoadStuddedProductDetails
  | LoadStuddedProductDetailsSuccess
  | LoadStuddedProductDetailsFailure
  | SetHoldTransactionMetalRates
  | LoadRefundCashLimit
  | LoadRefundCashLimitSuccess
  | LoadRefundCashLimitFailure;
