import { Moment } from 'moment';
import { Action } from '@ngrx/store';
import {
  CustomErrors,
  GepInitResponse,
  MetalPrice,
  totalBreakUp,
  MetalType,
  ItemType,
  CancelGep,
  GEPProductDetails,
  FileUploadLists,
  TransactionTypeEnum,
  AdvanceHistoryItemsRequestPayload,
  GEPSearchResponse,
  AdvanceBookingSearchPayload,
  RequestPayload,
  HistorySearchParamDetails,
  DiscountListPayload,
  DiscountsList
} from '@poss-web/shared/models';

/**
 * The interface for Action payload
 */

export interface DeletePayload {
  id: any;
  status?: string;
  itemId: any;
  subTxnType: string;
}
export interface PatchItemPayload {
  data: any;
  errorData?: any;
  itemId: string;
  id: string;
  subTxnType: string;
}

export interface HoldPayload {
  data: any;
  id: any;
  status: string;
  subTxnType: string;
}

export interface GepInitPayload {
  data: any;
  subTxnType: string;
}

export interface GepItemPayload {
  data: any;
  subTxnType: string;
  id: string;
  tempId?: string;
  isCustomerUpdate?: boolean;
}

export interface LoadGepPayload {
  subTxnType: string;
  id: string;
  remarks?: string;
}

export interface MetalPayload {
  applicableDate?: Moment;
  locationCode: string;
  materialType?: string;
}

export interface GepPriceRequest {
  itemType: string;
  measuredPurity: any;
  measuredWeight: any;
  metalType: string;
  standardPrice: MetalPrice[];
  isSave?: boolean;
}

export interface LoadOnHoldPayload {
  customerName?: string;
  docNo?: number;
  page?: number;
  size?: number;
  status: string;
  subTxnType: string;

  sort?: string[];
}

export interface LoadCanclPayload {
  customerMobileNo?: number;
  customerName?: string;
  docDate?: Moment;
  fiscalYear?: number;
  refDocNo?: number;
  page?: number;
  size?: number;

  subTxnType?: string;

  sort?: string[];
}

export interface FileUploadPayload {
  customerId: number;

  file?: FormData;
  id: string;
  txnType: TransactionTypeEnum;
}


export enum GepActionsTypes {
  IMAGE_UPLOAD = '[GEP] Image Upload',
  IMAGE_UPLOAD_SUCCESS = '[GEP] Image Upload Success',
  IMAGE_UPLOAD_FAILURE = '[GEP] Image Upload Failure',

  FILE_UPLOAD_LIST = '[GEP] File Upload List',
  FILE_UPLOAD_LIST_SUCCESS = '[GEP] File Upload List Success',
  FILE_UPLOAD_LIST_FAILURE = '[GEP] File Upload List Failure',

  FILE_DOWNLOAD_URL = '[GEP] File Download Url',
  FILE_DOWNLOAD_URL_SUCCESS = '[GEP] File Download Url Success',
  FILE_DOWNLOAD_URL_FAILURE = '[GEP] File Download Url Failure',

  GEP_INIT = '[GEP] GEP ID CREATION',
  GEP_INIT_SUCCESS = '[GEP] GEP ID CREATION Sucess',
  GEP_INIT_FAILURE = '[GEP] GEP ID CREATION Failure',

  POST_GEP_ITEMS = '[GEP] SAVE GEP GRID ITEMS',
  POST_GEP_ITEMS_SUCCESS = '[GEP] SAVE GEP GRID ITEMS Success',
  POST_GEP_ITEMS_FAILURE = '[GEP] SAVE GEP GRID ITEMS Failure',

  GEP_HOLD_CONFIRM = '[GEP] HOLD/CONFIRM GEP',
  GEP_HOLD_CONFIRM_SUCCESS = '[GEP]HOLD/CONFIRM GEPSuccess',
  GEP_HOLD_CONFIRM_FAILURE = '[GEP] HOLD/CONFIRM GEP Failue',

  GEP_TOTAL_VALUE = '[GEP] TOTAL VALUE BREAKUP FOR GEP ITEM',
  GEP_TOTAL_VALUE_SUCCESS = '[GEP]TOTAL VALUE BREAKUP FOR GEP ITEMSuccess',
  GEP_TOTAL_VALUE_FAILURE = '[GEP]TOTAL VALUE BREAKUP FOR GEP ITEM FAILURE',

  GEP_METAL_PRICE = '[GEP] METAL PRICE',
  GEP_METAL_PRICE_SUCCESS = '[GEP] METAL PRICE Success',
  GEP_METAL_PRICE_FAILURE = '[GEP] METAL PRICE Failure',

  LOAD_ITEM = '[GEP] Load ITEM TYPE',
  LOAD_ITEM_SUCCESS = '[GEP] Load ITEM TYPESuccess',
  LOAD_ITEM_FAILURE = '[GEP] Load ITEMTYPE  Failure',

  LOAD_METAL = '[GEP] Load Metal TYPE',
  LOAD_METAL_SUCCESS = '[GEP] Load Metal TYPESuccess',
  LOAD_METAL_FAILURE = '[GEP] Load Metal TYPE Failure',

  UPDATE_RSO = '[GEP] UPDATE Gep Header level ',
  UPDATE_RSO_SUCCESS = '[GEP] UPDATE Gep Header level Success',
  UPDATE_RSO_FAILURE = '[GEP] UPDATE Gep Header level Failure',

  UPDATE_GEP_ITEM = '[GEP]  UPDATE Gep grid item',
  UPDATE_GEP_ITEM_SUCCESS = '[GEP]  UPDATE Gep grid item Sucess',
  UPDATE_GEP_ITEM_FAILURE = '[GEP]   UPDATE Gep grid item Failure',

  GET_GEP_ITEM = '[GEP]  load gep detail',
  GET_GEP_ITEM_SUCCESS = '[GEP]  load gep detail Sucess',
  GET_GEP_ITEM_FAILURE = '[GEP]load gep detail Failure',

  DELETE = '[GEP] DELETE GRID ITEM',
  DELETE_SUCCESS = '[GEP]DELETE  GRID ITEM Success',
  DELETE_FAILURE = '[GEP]DELETE  GRID ITEM Failure',

  UPDATE_SUMMARY = '[GEP] SUMMARY',

  RESET_GEP = '[GEP] RESET GEP',

  CLEAR_SEARCH_LIST = '[GEP] Clear Search List',
  LOAD_ON_HOLD = '[GEP] LOAD ON Hold LIST',
  LOAD_ON_HOLD_SUCCESS = '[GEP]LOAD ON Hold LIST Success',
  LOAD_ON_HOLD_FAILURE = '[GEP]LOAD ON Hold LIST Failure',

  DELETE_GEP = '[GEP] DELETE GEP',
  DELETE_GEP_SUCCESS = '[GEP]DELTE GEP Success',
  DELETE_GEP_FAILURE = '[GEP]DELTE GEP Failure',

  COUNT_ON_HOLD = '[GEP]COUNT_ON_HOLD',
  COUNT_ON_HOLD_SUCCESS = '[GEP]COUNT_ON_HOLD Success',
  COUNT_ON_HOLD_FAILURE = '[GEP]COUNT_ON_HOLD Failure',

  SAVE_CANCEL_GEP = '[GEP]SAVE_CANCEL_GEP',
  SAVE_CANCEL_GEP_SUCCESS = '[GEP]SAVE_CANCEL_GEP Success',
  SAVE_CANCEL_GEP_FAILURE = '[GEP]SAVE_CANCEL_GEP Failure',

  LOAD_CANCEL_GEP = '[GEP]LOAD_CANCEL_GEP LIST',
  LOAD_CANCEL_GEP_SUCCESS = '[GEP]LOAD_CANCEL_GEP LIST Success',
  LOAD_CANCEL_GEP_FAILURE = '[GEP]LOAD_CANCEL_GEP LIST Failure',

  LOAD_GEP_ITEM = '[GEP] LOAD_GEP_ITEM grid',
  LOAD_GEP_ITEM_SUCCESS = '[GEP] LOAD_GEP_ITEM grid Success',
  LOAD_GEP_ITEM_PRICE_SUCCESS = '[GEP] LOAD_GEP_ITEM grid PRICE Success',
  LOAD_GEP_ITEM_FAILURE = '[GEP]  LOAD_GEP_ITEM grid FAILURE',

  SAVE_PRODUCT_ID = '[GEP] Save product',
  UPDATE_PRODUCT = '[GEP] update product',
  UPDATE_Purity = '[GEP] update purity',
  UPDATE_WEIGHT = '[GEP] update Weight',
  UPDATE_PREMELTING = '[GEP] update Premelting',
  DELETE_TEMPID = '[GEP] Delete Temporary Id',

  UPDATE_PRICE = '[GEP]Update Price',
  UPDATE_PRICE_SUCCESS = '[GEP]Update Price Success',
  UPDATE_PRICE_FAILURE = '[GEP]Update Price Failure',

  SAVE_RSO = '[GEP] Cancel Rso name',
  SAVE_REASON = '[GEP] Cancel Rso reason',

  SET_HISTORY_SEARCH_PARAM_DETAILS = '[GEP REQUEST] Set GEP Search Param Details',

  LOAD_GEP_HISTORY = '[GEP REQUEST] Load GEP History',
  LOAD_GEP_HISTORY_SUCCESS = '[GEP REQUEST] Load GEP History Success',
  LOAD_GEP_HISTORY_FAILURE = '[GEP REQUEST] Load GEP History Failure',

  SEARCH_GEP = '[GEP REQUEST] Search GEP',
  SEARCH_GEP_SUCCESS = '[GEP REQUEST] Search GEP Success',
  SEARCH_GEP_FAILURE = '[GEP REQUEST] Search GEP Failure',

  VIEW_GEP = '[GEP] View GEP',
  VIEW_GEP_SUCCESS = '[GEP] View GEP Success',
  VIEW_GEP_FAILURE = '[GEP] View GEP Failure',

  LOAD_AVAILABLE_DISCOUNTS_LIST = '[GEP] LOAD AVAILABLE DISCOUNTS LIST',
  LOAD_AVAILABLE_DISCOUNTS_LIST_SUCCESS = '[GEP] LOAD AVAILABLE DISCOUNTS LIST SUCCESS',
  LOAD_AVAILABLE_DISCOUNTS_LIST_FAILURE = '[GEP] LOAD AVAILABLE DISCOUNTS LIST FAILURE'

}

export class ResetGep implements Action {
  readonly type = GepActionsTypes.RESET_GEP;

}
export class GepInit implements Action {
  readonly type = GepActionsTypes.GEP_INIT;

  constructor(readonly payload: GepInitPayload) {}
}

export class GepInitSuccess implements Action {
  readonly type = GepActionsTypes.GEP_INIT_SUCCESS;
  constructor(readonly payload: GepInitResponse) {}
}
export class GepInitFailure implements Action {
  readonly type = GepActionsTypes.GEP_INIT_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class PostGepItems implements Action {
  readonly type = GepActionsTypes.POST_GEP_ITEMS;

  constructor(readonly payload: GepItemPayload) {}
}

export class PostGepItemsSuccess implements Action {
  readonly type = GepActionsTypes.POST_GEP_ITEMS_SUCCESS;
  constructor(readonly payload: { id: string; res: GEPProductDetails }) {}
}
export class PostGepItemsFailure implements Action {
  readonly type = GepActionsTypes.POST_GEP_ITEMS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class PostRSO implements Action {
  readonly type = GepActionsTypes.UPDATE_RSO;

  constructor(readonly payload: GepItemPayload) {}
}

export class PostRSOSuccess implements Action {
  readonly type = GepActionsTypes.UPDATE_RSO_SUCCESS;
  constructor(readonly payload: {data : any, isCustomerUpdate: boolean}) {}
}
export class PostRSOFailure implements Action {
  readonly type = GepActionsTypes.UPDATE_RSO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class GepMetalRate implements Action {
  readonly type = GepActionsTypes.GEP_METAL_PRICE;

  constructor(readonly payload?: string) {}
}

export class GepMetalRateSuccess implements Action {
  readonly type = GepActionsTypes.GEP_METAL_PRICE_SUCCESS;
  constructor(readonly payload: MetalPrice[]) {}
}
export class GepMetalRateFailure implements Action {
  readonly type = GepActionsTypes.GEP_METAL_PRICE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class TotalValueBreakUp implements Action {
  readonly type = GepActionsTypes.GEP_TOTAL_VALUE;

  constructor(readonly payload: GepPriceRequest) {}
}

export class TotalValueBreakUpSuccess implements Action {
  readonly type = GepActionsTypes.GEP_TOTAL_VALUE_SUCCESS;
  constructor(
    readonly payload: { data: GepPriceRequest; totalBreakUp: totalBreakUp }
  ) {}
}
export class TotalValueBreakupFailure implements Action {
  readonly type = GepActionsTypes.GEP_TOTAL_VALUE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadMetal implements Action {
  readonly type = GepActionsTypes.LOAD_METAL;
  constructor(public payload: string) {}
}

export class LoadMetalSuccess implements Action {
  readonly type = GepActionsTypes.LOAD_METAL_SUCCESS;
  constructor(public payload: MetalType[]) {}
}

export class LoadMetalFailure implements Action {
  readonly type = GepActionsTypes.LOAD_METAL_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class Delete implements Action {
  readonly type = GepActionsTypes.DELETE;
  constructor(public payload: DeletePayload) {}
}

export class DeleteSuccess implements Action {
  readonly type = GepActionsTypes.DELETE_SUCCESS;
  constructor(public payload: any) {}
}

export class DeleteFailure implements Action {
  readonly type = GepActionsTypes.DELETE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateSummaryBar implements Action {
  readonly type = GepActionsTypes.UPDATE_SUMMARY;
  constructor(public payload: any) {}
}
export class HoldConfirm implements Action {
  readonly type = GepActionsTypes.GEP_HOLD_CONFIRM;
  constructor(public payload: HoldPayload) {}
}

export class HoldConfirmSuccess implements Action {
  readonly type = GepActionsTypes.GEP_HOLD_CONFIRM_SUCCESS;
  constructor(public payload: any) {}
}

export class HoldConfirmFailure implements Action {
  readonly type = GepActionsTypes.GEP_HOLD_CONFIRM_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadITEM implements Action {
  readonly type = GepActionsTypes.LOAD_ITEM;
  constructor(public payload: string) {}
}

export class LoadITEMSuccess implements Action {
  readonly type = GepActionsTypes.LOAD_ITEM_SUCCESS;
  constructor(public payload: ItemType[]) {}
}

export class LoadITEMFailure implements Action {
  readonly type = GepActionsTypes.LOAD_ITEM_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateITEM implements Action {
  readonly type = GepActionsTypes.UPDATE_GEP_ITEM;
  constructor(public payload: PatchItemPayload) {}
}

export class UpdateITEMSuccess implements Action {
  readonly type = GepActionsTypes.UPDATE_GEP_ITEM_SUCCESS;
  constructor(public payload: GEPProductDetails) {}
}

export class UpdateITEMFailure implements Action {
  readonly type = GepActionsTypes.UPDATE_GEP_ITEM_FAILURE;
  constructor(public payload: { error: CustomErrors; data: any }) {}
}

export class GetGepITEM implements Action {
  readonly type = GepActionsTypes.GET_GEP_ITEM;
  constructor(public payload: LoadGepPayload) {}
}

export class GetGepITEMSuccess implements Action {
  readonly type = GepActionsTypes.GET_GEP_ITEM_SUCCESS;
  constructor(public payload: any) {}
}

export class GetGepITEMFailure implements Action {
  readonly type = GepActionsTypes.GET_GEP_ITEM_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadOnHold implements Action {
  readonly type = GepActionsTypes.LOAD_ON_HOLD;
  constructor(public payload: LoadOnHoldPayload) {}
}

export class LoadOnHoldSuccess implements Action {
  readonly type = GepActionsTypes.LOAD_ON_HOLD_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadOnHoldFailure implements Action {
  readonly type = GepActionsTypes.LOAD_ON_HOLD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class DeleteGepITEM implements Action {
  readonly type = GepActionsTypes.DELETE_GEP;
  constructor(public payload: LoadGepPayload) {}
}

export class DeleteITEMSuccess implements Action {
  readonly type = GepActionsTypes.DELETE_GEP_SUCCESS;
  constructor(public payload: any) {}
}

export class DeleteITEMFailure implements Action {
  readonly type = GepActionsTypes.DELETE_GEP_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCountOnHoLd implements Action {
  readonly type = GepActionsTypes.COUNT_ON_HOLD;
  constructor(public payload: LoadOnHoldPayload) {}
}

export class LoadCountOnHoLdSuccess implements Action {
  readonly type = GepActionsTypes.COUNT_ON_HOLD_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadCountOnHoLdFailure implements Action {
  readonly type = GepActionsTypes.COUNT_ON_HOLD_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadCancelGep implements Action {
  readonly type = GepActionsTypes.LOAD_CANCEL_GEP;
  constructor(public payload: LoadCanclPayload) {}
}

export class LoadCancelGepSuccess implements Action {
  readonly type = GepActionsTypes.LOAD_CANCEL_GEP_SUCCESS;
  constructor(public payload: CancelGep) {}
}

export class LoadCancelGepFailure implements Action {
  readonly type = GepActionsTypes.LOAD_CANCEL_GEP_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadGepItem implements Action {
  readonly type = GepActionsTypes.LOAD_GEP_ITEM;
  constructor(public payload: DeletePayload) {}
}

export class LoadGepItemSuccess implements Action {
  readonly type = GepActionsTypes.LOAD_GEP_ITEM_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadGepItemPriceSuccess implements Action {
  readonly type = GepActionsTypes.LOAD_GEP_ITEM_PRICE_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadGepItemFailure implements Action {
  readonly type = GepActionsTypes.LOAD_GEP_ITEM_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveCanceleGep implements Action {
  readonly type = GepActionsTypes.SAVE_CANCEL_GEP;
  constructor(public payload: GepInitPayload) {}
}

export class SaveCanceleGepSuccess implements Action {
  readonly type = GepActionsTypes.SAVE_CANCEL_GEP_SUCCESS;
  constructor(public payload: any) {}
}

export class SaveCanceleGepFailure implements Action {
  readonly type = GepActionsTypes.SAVE_CANCEL_GEP_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ImageUpload implements Action {
  readonly type = GepActionsTypes.IMAGE_UPLOAD;
  constructor(public payload: FileUploadPayload) {}
}

export class ImageUploadSuccess implements Action {
  readonly type = GepActionsTypes.IMAGE_UPLOAD_SUCCESS;
  constructor(public payload: any) {}
}

export class ImageUploadFailure implements Action {
  readonly type = GepActionsTypes.IMAGE_UPLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdatePrice implements Action {
  readonly type = GepActionsTypes.UPDATE_PRICE;
  constructor(public payload: LoadGepPayload) {}
}

export class UpdatePriceSuccess implements Action {
  readonly type = GepActionsTypes.UPDATE_PRICE_SUCCESS;
  constructor(public payload: any) {}
}

export class UpdatePriceFailure implements Action {
  readonly type = GepActionsTypes.UPDATE_PRICE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveProduct implements Action {
  readonly type = GepActionsTypes.SAVE_PRODUCT_ID;
  constructor(
    public payload: {
      weight: number;
      purity: number;
      metalType: string;
      itemType?: string;
    }
  ) {}
}

export class UpdateProduct implements Action {
  readonly type = GepActionsTypes.UPDATE_PRODUCT;
  constructor(public payload: { metal: string; item: string; id: string }) {}
}

export class UpdatePremelting implements Action {
  readonly type = GepActionsTypes.UPDATE_PREMELTING;
  constructor(
    public payload: {
      preMelting: any;
      id: string;
    }
  ) {}
}

export class DeleteTempId implements Action {
  readonly type = GepActionsTypes.DELETE_TEMPID;
  constructor(public payload: string) {}
}

export class UpdatePurity implements Action {
  readonly type = GepActionsTypes.UPDATE_Purity;
  constructor(
    public payload: {
      purity: number;
      id: string;
    }
  ) {}
}

export class SaveRso implements Action {
  readonly type = GepActionsTypes.SAVE_RSO;
  constructor(public payload: any) {}
}

export class SaveReason implements Action {
  readonly type = GepActionsTypes.SAVE_REASON;
  constructor(public payload: any) {}
}

export class UpdateWeight implements Action {
  readonly type = GepActionsTypes.UPDATE_WEIGHT;
  constructor(
    public payload: {
      weight: any;
      id: string;
    }
  ) {}
}

export class FileUploadList implements Action {
  readonly type = GepActionsTypes.FILE_UPLOAD_LIST;
  constructor(public payload: FileUploadPayload) {}
}

export class FileUploadListSuccess implements Action {
  readonly type = GepActionsTypes.FILE_UPLOAD_LIST_SUCCESS;
  constructor(public payload: FileUploadLists[]) {}
}

export class FileUploadListFailure implements Action {
  readonly type = GepActionsTypes.FILE_UPLOAD_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FileDownloadUrl implements Action {
  readonly type = GepActionsTypes.FILE_DOWNLOAD_URL;
  constructor(public payload: { id: string; locationCode: string }) {}
}

export class FileDownloadUrlSuccess implements Action {
  readonly type = GepActionsTypes.FILE_DOWNLOAD_URL_SUCCESS;
  constructor(public payload: string) {}
}

export class FileDownloadUrlFailure implements Action {
  readonly type = GepActionsTypes.FILE_DOWNLOAD_URL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ClearSearchList implements Action {
  readonly type = GepActionsTypes.CLEAR_SEARCH_LIST;
}

export class LoadGEPHistory implements Action {
  readonly type = GepActionsTypes.LOAD_GEP_HISTORY;
  constructor(
    readonly payload: AdvanceHistoryItemsRequestPayload,
    readonly searchField: string,
    readonly searchType: string,
    readonly status: string,
    readonly page?: number,
    readonly size?: number,
    readonly txnType?: string,
    readonly subTxnType?: string
  ) {}
}

export class LoadGEPHistorySuccess implements Action {
  readonly type = GepActionsTypes.LOAD_GEP_HISTORY_SUCCESS;
  constructor(readonly payload: GEPSearchResponse) {}
}

export class LoadGEPHistoryFailure implements Action {
  readonly type = GepActionsTypes.LOAD_GEP_HISTORY_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ViewGEP implements Action {
  readonly type = GepActionsTypes.VIEW_GEP;
  constructor(readonly payload: string, readonly subTxnType: string) {}
}

export class ViewGEPSuccess implements Action {
  readonly type = GepActionsTypes.VIEW_GEP_SUCCESS;
  constructor(readonly payload: any) {}
}

export class ViewGEPFailure implements Action {
  readonly type = GepActionsTypes.VIEW_GEP_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class SearchGEP implements Action {
  readonly type = GepActionsTypes.SEARCH_GEP;
  constructor(
    readonly payload?: AdvanceBookingSearchPayload,
    readonly notConfirmedpayload?: RequestPayload
  ) {}
}

export class SearchGEPSuccess implements Action {
  readonly type = GepActionsTypes.SEARCH_GEP_SUCCESS;
  constructor(readonly payload: GEPSearchResponse) {}
}

export class SearchGEPFailure implements Action {
  readonly type = GepActionsTypes.SEARCH_GEP_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class SetHistoryGEPSearchParamDetails implements Action {
  readonly type = GepActionsTypes.SET_HISTORY_SEARCH_PARAM_DETAILS;
  constructor(readonly payload: HistorySearchParamDetails) {}
}



export class LoadAvailableDiscountsList implements Action {
  readonly type = GepActionsTypes.LOAD_AVAILABLE_DISCOUNTS_LIST;
  constructor(readonly payload: DiscountListPayload) {}
}

export class LoadAvailableDiscountsListSuccess implements Action {
  readonly type = GepActionsTypes.LOAD_AVAILABLE_DISCOUNTS_LIST_SUCCESS;
  constructor(readonly payload: DiscountsList[]) {}
}

export class LoadAvailableDiscountsListFailure implements Action {
  readonly type = GepActionsTypes.LOAD_AVAILABLE_DISCOUNTS_LIST_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export type GepActions =
  | GepInit
  | GepInitSuccess
  | GepInitFailure
  | PostGepItems
  | PostGepItemsSuccess
  | PostGepItemsFailure
  | GepMetalRate
  | GepMetalRateSuccess
  | GepMetalRateFailure
  | TotalValueBreakUp
  | TotalValueBreakUpSuccess
  | TotalValueBreakupFailure
  | LoadMetal
  | LoadMetalSuccess
  | LoadMetalFailure
  | LoadITEM
  | LoadITEMSuccess
  | LoadITEMFailure
  | UpdateSummaryBar
  | HoldConfirm
  | HoldConfirmSuccess
  | HoldConfirmFailure
  | Delete
  | DeleteSuccess
  | DeleteFailure
  | PostRSO
  | PostRSOSuccess
  | PostRSOFailure
  | UpdateITEM
  | UpdateITEMSuccess
  | UpdateITEMFailure
  | GetGepITEM
  | GetGepITEMSuccess
  | GetGepITEMFailure
  | ResetGep
  | SaveCanceleGep
  | SaveCanceleGepFailure
  | SaveCanceleGepSuccess
  | LoadCancelGep
  | LoadCancelGepSuccess
  | LoadCancelGepFailure
  | LoadCountOnHoLd
  | LoadCountOnHoLdSuccess
  | LoadCountOnHoLdFailure
  | LoadOnHold
  | LoadOnHoldSuccess
  | LoadOnHoldFailure
  | DeleteGepITEM
  | DeleteITEMSuccess
  | DeleteITEMFailure
  | LoadGepItem
  | LoadGepItemSuccess
  | LoadGepItemFailure
  | ImageUpload
  | ImageUploadSuccess
  | ImageUploadFailure
  | SaveProduct
  | UpdateProduct
  | UpdatePremelting
  | DeleteTempId
  | UpdatePrice
  | UpdatePriceSuccess
  | UpdatePriceFailure
  | UpdateWeight
  | UpdatePurity
  | LoadGepItemPriceSuccess
  | SaveRso
  | SaveReason
  | FileUploadList
  | FileUploadListSuccess
  | FileUploadListFailure
  | FileDownloadUrl
  | FileDownloadUrlSuccess
  | FileDownloadUrlFailure
  | LoadGEPHistory
  | LoadGEPHistorySuccess
  | LoadGEPHistoryFailure
  | SearchGEPSuccess
  | SearchGEPFailure
  | SearchGEP
  | SetHistoryGEPSearchParamDetails
  | ClearSearchList
  | ViewGEP
  | ViewGEPSuccess
  | ViewGEPFailure
  | LoadAvailableDiscountsList
  | LoadAvailableDiscountsListSuccess
  | LoadAvailableDiscountsListFailure;
