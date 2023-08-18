import { Action } from '@ngrx/store';
import {
  BinCode,
  ConversionHistory,
  ConversionHistoryAdvancedFilterPayload,
  ConversionHistoryItemsPayload,
  ConversionHistoryItemsSuccessPayload,
  ConversionHistorySuccessPayload,
  ConversionInventoryItem,
  ConversionItem,
  ConversionLoadItemsPayload,
  ConversionRequestItems,
  ConversionRequestResponse,
  ConversionRequests,
  ConversionRequestsResponse,
  ConversionResponse,
  ConversionSplitItemPayload,
  ConversionSplitReqPayload,
  ConvertedTransactionHistoryPayload,
  CustomErrors,
  ImageReqPayload,
  ImageResponse,
  LoadConversionRequestsPayload,
  PriceDetailsResponse,
  PriceRequest,
  PriceRequestPayload,
  ProductPriceDetails,
  RequestSentHistoryPayload
} from '@poss-web/shared/models';

export enum ConversionActionTypes {
  LOAD_SEARCH_VARIENT = '[Conversion] Load Search Varient',
  LOAD_SEARCH_VARIENT_SUCCESS = '[Conversion] Load Search Varient Success',
  LOAD_SEARCH_VARIENT_FAILURE = '[Conversion] Load Search Varient Failure',

  CLEAR_VARIENT_SEARCH_LIST = '[Conversion] Clear Load Search Varient',
  ADD_TO_SELECTED_VARIENT = '[Conversion] Add Selected Varient',
  REMOVE_FROM_SELECTED_VARIENT = '[Conversion] Remove Selected Varient',

  LOAD_CONVERSION_ITEMS = '[Conversion-Details] Load Conversion Items',
  LOAD_CONVERSION_ITEMS_SUCCESS = '[Conversion-Details] Load Conversion Items Success',
  LOAD_CONVERSION_ITEMS_FAILURE = '[Conversion-Details] Load Conversion Items Failure',

  CLEAR_LOADED_CONVERSION_ITEMS = '[Conversion-Details] Clear Load Conversion Items',

  SPLIT_ITEM = '[Conversion] Split Item',
  SPLIT_ITEM_SUCCESS = '[Conversion ] Split Item Success ',
  SPLIT_ITEM_FAILURE = '[COnversion] Split Item Failure',

  SEND_CONVERSION_REQUEST = '[Conversion] Send Conversion Request',
  SEND_CONVERSION_REQUEST_SUCCESS = '[Conversion] Send Conversion Request Success',
  SEND_CONVERSION_REQUEST_FAILURE = '[Conversion] Send Conversion Request Failure',

  LOAD_REQUESTS_COUNT = '[Conversion] Load Requests Count',
  LOAD_REQUESTS_COUNT_SUCCESS = '[Conversion] Load Requests Count Success',
  LOAD_REQUESTS_COUNT_FAILURE = '[Conversion] Load Requests Count Failure',

  LOAD_CONVERSION_REQUESTS = '[Conversion]  Load Conversion Requests',
  LOAD_CONVERSION_REQUESTS_SUCCESS = '[Conversion]  Load Conversion Requests Success',
  LOAD_CONVERSION_REQUESTS_FAILURE = '[Conversion]  Load Conversion Requests Failure',

  SEARCH_CONVERSION_REQUESTS = '[Conversion] Search Conversion Requests',
  SEARCH_CONVERSION_REQUESTS_SUCCESS = '[Conversion] Search Conversion Requests Success',
  SEARCH_CONVERSION_REQUESTS_FAILURE = '[Conversion] Search Conversion Requests Failure',

  SEARCH_CLEAR = '[Conversion] search-clear',

  //Image for Search Variant
  LOAD_SEARCH_VARIANT_THUMBNAIL_IMAGE_URL = '[ Conversion ] Load Search Variant Thumbnail Image Url',
  LOAD_SEARCH_VARIANT_THUMBNAIL_IMAGE_URL_SUCCESS = '[ Conversion ] Load Search Variant Thumbnail Image Url Success',
  LOAD_SEARCH_VARIANT_THUMBNAIL_IMAGE_URL_FAILURE = '[ Conversion ] Load Search Variant Thumbnail Image Url Failure',

  LOAD_SEARCH_VARIANT_IMAGE_URL = '[ Conversion ] Load Search Variant Image Url',
  LOAD_SEARCH_VARIANT_IMAGE_URL_SUCCESS = '[ Conversion ] Load Search Variant Image Url Success',
  LOAD_SEARCH_VARIANT_IMAGE_URL_FAILURE = '[ Conversion ] Load Search Variant Image Url Failure',

  LOAD_SELECTED_REQUEST = '[Conversion-Details] Load Selected Requests',
  LOAD_SELECTED_REQUEST_SUCCESS = '[Conversion-Details] Load Selected Requests Success',
  LOAD_SELECTED_REQUEST_FAILURE = '[Conversion-Details] Load Selected Requests Failure',

  LOAD_SELECTED_REQUEST_DATA = '[Conversion-Details] Load Selected Requests Data',
  LOAD_SELECTED_REQUEST_DATA_SUCCESS = '[Conversion-Details] Load Selected Requests Data Success',
  LOAD_SELECTED_REQUEST_DATA_FAILURE = '[Conversion-Details] Load Selected Requests Data Failure',

  LOAD_RSO_DETAILS = '[Conversion] Load RSO Details',
  LOAD_RSO_DETAILS_SUCCESS = '[Conversion] Load RSO Details Success',
  LOAD_RSO_DETAILS_FAILURE = '[Conversion] Load RSO Details Failure',

  CONFIRM_CONVERSION = '[Conversion] Confirm conversion after Approval',
  CONFIRM_CONVERSION_SUCCESS = '[Conversion] Confirm conversion after Approval Success',
  CONFIRM_CONVERSION_FAILURE = '[Conversion] Confirm conversion after Approval Failure',

  LOAD_BINCODES = '[Conversion] Load Bin Codes',
  LOAD_BINCODES_SUCCESS = '[Conversion] Load Bin Codes Sucess',
  LOAD_BINCODES_FAILURE = '[Conversion] Load Bin Codes Failure',

  LOAD_STUDDED_PRODUCT_GROUPS = '[Conversion]  Load Studded Product Groups ',
  LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS = '[Conversion]  Load Studded Product Groups Success ',
  LOAD_STUDDED_PRODUCT_GROUPS_FAILURE = '[Conversion]  Load Studded Product Groups Failure ',

  RESET_ERROR = '[Conversion] Reset Error',
  RESET_SELECTED_REQUEST_DATA = '[Conversion]  Reset Selected Requests Data ',

  //Image for Request Sent
  LOAD_REQUEST_THUMBNAIL_IMAGE_URL = '[ Conversion ] Load Request Thumbnail Image Url',
  LOAD_REQUEST_THUMBNAIL_IMAGE_URL_SUCCESS = '[ Conversion ] Load Request Thumbnail Image Url Success',
  LOAD_REQUEST_THUMBNAIL_IMAGE_URL_FAILURE = '[ Conversion ] Load Request Thumbnail Image Url Failure',

  LOAD_REQUEST_IMAGE_URL = '[ Conversion ] Load Request Image Url',
  LOAD_REQUEST_IMAGE_URL_SUCCESS = '[ Conversion ] Load Request Image Url Success',
  LOAD_REQUEST_IMAGE_URL_FAILURE = '[ Conversion ] Load Request Image Url Failure',

  LOAD_REQUEST_SENT_HISTORY = '[ Conversion-History ] Load  Request Sent History',
  LOAD_REQUEST_SENT_HISTORY_SUCCESS = '[ Conversion-Hisotry ] Load  Request Sent History Success',
  LOAD_REQUEST_SENT_HISTORY_FAILURE = '[ Conversion-Hisotry ] Load  Request Sent History Failure',

  LOAD_CONVERTED_TRANSACTION_HISTORY = '[ Conversion-History ] Load  Converted Transaction History',
  LOAD_CONVERTED_TRANSACTION_HISTORY_SUCCESS = '[ Conversion-Hisotry ] Load  Converted Transaction History History Success',
  LOAD_CONVERTED_TRANSACTION_HISTORY_FAILURE = '[ Conversion-Hisotry ] Load  Converted Transaction History  Failure',

  LOAD_SELECTED_REQUEST_HISTORY = '[Conversion-History] Load Selected Requests History',
  LOAD_SELECTED_REQUEST_HISTORY_SUCCESS = '[Conversion-History] Load Selected Requests History Success',
  LOAD_SELECTED_REQUEST_HISTORY_FAILURE = '[Conversion-History] Load Selected Requests History Failure',

  LOAD_CONVERSION_HISTORY_ITEMS = '[Conversion-History] Load Conversion History Items',
  LOAD_CONVERSION_HISTORY_ITEMS_SUCCESS = '[Conversion-History] Load Conversion History Items Success',
  LOAD_CONVERSION_HISTORY_ITEMS_FAILURE = '[Conversion-Hisotry] Load Conversion History Items Failure',

  STORE_REQUEST_TYPE = '[ Conversion-History ] Store History Type',
  STORE_ADVANCED_FILTER = '[ Conversion-History ] Store Advanced Filter Data',
  RESET_CONVERSION_HISTORY = '[ Conversion-History ] Reset Conversion History',
  RESET_ADVANCE_FILTER = '[ Conversion-History ] Reset Advance Filter',

  // Image For History
  LOAD_HISTORY_THUMBNAIL_IMAGE_URL = '[ Conversion-History ] Load History Thumbnail Image Url',
  LOAD_HISTORY_THUMBNAIL_IMAGE_URL_SUCCESS = '[ Conversion-History ] Load History Thumbnail Image Url Success',
  LOAD_HISTORY_THUMBNAIL_IMAGE_URL_FAILURE = '[ Conversion-History ] Load History Thumbnail Image Url Failure',

  LOAD_HISTORY_IMAGE_URL = '[ Conversion-History ] Load History Image Url',
  LOAD_HISTORY_IMAGE_URL_SUCCESS = '[ Conversion-History ] Load History Image Url Success',
  LOAD_HISTORY_IMAGE_URL_FAILURE = '[ Conversion-History ] Load History Image Url Failure',

  LOAD_STANDARD_METAL_PRICE_DETAILS = '[Conversion] Load Standard Metal Price Details',
  LOAD_STANDARD_METAL_PRICE_DETAILS_SUCCESS = '[Conversion] Load Standard Metal Price Details Success',
  LOAD_STANDARD_METAL_PRICE_DETAILS_FAILURE = '[Conversion] Load Standard Metal Price Details Failure',

  LOAD_PRICE_DETAILS = '[Conversion] Load Price Details',
  LOAD_PRICE_DETAILS_SUCCESS = '[Conversion] Load Price Details Success',
  LOAD_PRICE_DETAILS_FAILURE = '[Conversion] Load Price Details Failure',
}

export class LoadSearchVarient implements Action {
  readonly type = ConversionActionTypes.LOAD_SEARCH_VARIENT;
  constructor(public payload: string) {}
}
export class LoadSearchVarientSuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_SEARCH_VARIENT_SUCCESS;
  constructor(public payload: ConversionInventoryItem[]) {}
}
export class LoadSearchVarientFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_SEARCH_VARIENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ClearVarientSearchList implements Action {
  readonly type = ConversionActionTypes.CLEAR_VARIENT_SEARCH_LIST;
}

export class AddToItemList implements Action {
  readonly type = ConversionActionTypes.ADD_TO_SELECTED_VARIENT;
  constructor(public payload: ConversionInventoryItem) {}
}
export class RemoveFromItemList implements Action {
  readonly type = ConversionActionTypes.REMOVE_FROM_SELECTED_VARIENT;
}

export class LoadConversionItems implements Action {
  readonly type = ConversionActionTypes.LOAD_CONVERSION_ITEMS;
  constructor(public payload: ConversionLoadItemsPayload) {}
}
export class LoadConversionItemsSuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_CONVERSION_ITEMS_SUCCESS;
  constructor(public payload: ConversionItem) {}
}
export class LoadConversionItemsFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_CONVERSION_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ClearLoadedConversionItem implements Action {
  readonly type = ConversionActionTypes.CLEAR_LOADED_CONVERSION_ITEMS;
}

export class SplitItems implements Action {
  readonly type = ConversionActionTypes.SPLIT_ITEM;
  constructor(public payload: ConversionSplitItemPayload) {}
}
export class SplitItemsSuccess implements Action {
  readonly type = ConversionActionTypes.SPLIT_ITEM_SUCCESS;
  constructor(public payload: ConversionResponse) {}
}
export class SplitItemsFailure implements Action {
  readonly type = ConversionActionTypes.SPLIT_ITEM_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SendConversionRequest implements Action {
  readonly type = ConversionActionTypes.SEND_CONVERSION_REQUEST;
  constructor(public payload: ConversionSplitReqPayload) {}
}
export class SendConversionRequestSuccess implements Action {
  readonly type = ConversionActionTypes.SEND_CONVERSION_REQUEST_SUCCESS;
  constructor(public payload: ConversionRequestResponse) {}
}
export class SendConversionRequestFailure implements Action {
  readonly type = ConversionActionTypes.SEND_CONVERSION_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadRequestsCount implements Action {
  readonly type = ConversionActionTypes.LOAD_REQUESTS_COUNT;
}
export class LoadRequestsCountSuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_REQUESTS_COUNT_SUCCESS;
  constructor(public payload: number) {}
}
export class LoadRequestsCountFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_REQUESTS_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadConversionRequests implements Action {
  readonly type = ConversionActionTypes.LOAD_CONVERSION_REQUESTS;
  constructor(public payload: LoadConversionRequestsPayload) {}
}
export class LoadConversionRequestsSuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_CONVERSION_REQUESTS_SUCCESS;
  constructor(public payload: ConversionRequestsResponse) {}
}
export class LoadConversionRequestsFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_CONVERSION_REQUESTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchConversionRequests implements Action {
  readonly type = ConversionActionTypes.SEARCH_CONVERSION_REQUESTS;
  constructor(public payload: number) {}
}
export class SearchConversionRequestsSuccess implements Action {
  readonly type = ConversionActionTypes.SEARCH_CONVERSION_REQUESTS_SUCCESS;
  constructor(public payload: ConversionRequests[]) {}
}
export class SearchConversionRequestsFailure implements Action {
  readonly type = ConversionActionTypes.SEARCH_CONVERSION_REQUESTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ClearSearchRequests implements Action {
  readonly type = ConversionActionTypes.SEARCH_CLEAR;
}
export class LoadSelectedRequest implements Action {
  readonly type = ConversionActionTypes.LOAD_SELECTED_REQUEST;
  constructor(public payload: number) {}
}
export class LoadSelectedRequestSuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_SELECTED_REQUEST_SUCCESS;
  constructor(public payload: ConversionRequests) {}
}
export class LoadSelectedRequestFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_SELECTED_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSelectedRequestData implements Action {
  readonly type = ConversionActionTypes.LOAD_SELECTED_REQUEST_DATA;
  constructor(public payload: number) {}
}
export class LoadSelectedRequestDataSuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_SELECTED_REQUEST_DATA_SUCCESS;
  constructor(public payload: ConversionRequestItems[]) {}
}
export class LoadSelectedRequestDataFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_SELECTED_REQUEST_DATA_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRsoDetails implements Action {
  readonly type = ConversionActionTypes.LOAD_RSO_DETAILS;
}
export class LoadRsoDetailsSuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_RSO_DETAILS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadRsoDetailsFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_RSO_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ConfirmConversion implements Action {
  readonly type = ConversionActionTypes.CONFIRM_CONVERSION;
  constructor(public payload: ConversionSplitItemPayload) {}
}
export class ConfirmConversionSuccess implements Action {
  readonly type = ConversionActionTypes.CONFIRM_CONVERSION_SUCCESS;
  constructor(public payload: ConversionResponse) {}
}
export class ConfirmConversionFailure implements Action {
  readonly type = ConversionActionTypes.CONFIRM_CONVERSION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadBinCodes implements Action {
  readonly type = ConversionActionTypes.LOAD_BINCODES;
  constructor(public payload: string) {}
}
export class LoadBinCodesSuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_BINCODES_SUCCESS;
  constructor(public payload: BinCode[]) {}
}
export class LoadBinCodesFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_BINCODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadStuddedProductGroups implements Action {
  readonly type = ConversionActionTypes.LOAD_STUDDED_PRODUCT_GROUPS;
}
export class LoadStuddedProductGroupsSuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadStuddedProductGroupsFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetError implements Action {
  readonly type = ConversionActionTypes.RESET_ERROR;
}
export class ResetSelectedRequestData implements Action {
  readonly type = ConversionActionTypes.RESET_SELECTED_REQUEST_DATA;
}
export class LoadRequestSentHistory implements Action {
  readonly type = ConversionActionTypes.LOAD_REQUEST_SENT_HISTORY;
  constructor(public payload: RequestSentHistoryPayload) {}
}
export class LoadRequestSentHistorySuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_REQUEST_SENT_HISTORY_SUCCESS;
  constructor(public payload: ConversionHistorySuccessPayload) {}
}
export class LoadRequestSentHistoryFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_REQUEST_SENT_HISTORY_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadConvertedTransactionHistory implements Action {
  readonly type = ConversionActionTypes.LOAD_CONVERTED_TRANSACTION_HISTORY;
  constructor(public payload: ConvertedTransactionHistoryPayload) {}
}
export class LoadConvertedTransactionHistorySuccess implements Action {
  readonly type =
    ConversionActionTypes.LOAD_CONVERTED_TRANSACTION_HISTORY_SUCCESS;
  constructor(public payload: ConversionHistorySuccessPayload) {}
}
export class LoadConvertedTransactionHistoryFailure implements Action {
  readonly type =
    ConversionActionTypes.LOAD_CONVERTED_TRANSACTION_HISTORY_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadSelectedRequestHistory implements Action {
  readonly type = ConversionActionTypes.LOAD_SELECTED_REQUEST_HISTORY;
  constructor(public payload: { reqDocNo: number; requestType: string }) {}
}
export class LoadSelectedRequestHistorySuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_SELECTED_REQUEST_HISTORY_SUCCESS;
  constructor(public payload: ConversionHistory) {}
}
export class LoadSelectedRequestHistoryFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_SELECTED_REQUEST_HISTORY_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadConversionHistoryItems implements Action {
  readonly type = ConversionActionTypes.LOAD_CONVERSION_HISTORY_ITEMS;
  constructor(public payload: ConversionHistoryItemsPayload) {}
}
export class LoadConversionHistoryItemsSuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_CONVERSION_HISTORY_ITEMS_SUCCESS;
  constructor(public payload: ConversionHistoryItemsSuccessPayload) {}
}
export class LoadConversionHistoryItemsFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_CONVERSION_HISTORY_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class StoreRequestType implements Action {
  readonly type = ConversionActionTypes.STORE_REQUEST_TYPE;
  constructor(public payload: string) {}
}
export class StoreAdvancedFilterData implements Action {
  readonly type = ConversionActionTypes.STORE_ADVANCED_FILTER;
  constructor(public payload: ConversionHistoryAdvancedFilterPayload) {}
}
export class ResetConversionHistory implements Action {
  readonly type = ConversionActionTypes.RESET_CONVERSION_HISTORY;
}
export class ResetAdvanceFilter implements Action {
  readonly type = ConversionActionTypes.RESET_ADVANCE_FILTER;
}

// Image for Search by Varinat
export class LoadSearchVariantThumbnailImageUrl implements Action {
  readonly type = ConversionActionTypes.LOAD_SEARCH_VARIANT_THUMBNAIL_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadSearchVariantThumbnailImageUrlSuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_SEARCH_VARIANT_THUMBNAIL_IMAGE_URL_SUCCESS;
  constructor(public payload:  ImageResponse) {}
}
export class LoadSearchVariantThumbnailImageUrlFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_SEARCH_VARIANT_THUMBNAIL_IMAGE_URL_FAILURE;
  constructor(public payload:  ImageResponse) {}
}

export class LoadSearchVariantImageUrl implements Action {
  readonly type = ConversionActionTypes.LOAD_SEARCH_VARIANT_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadSearchVariantImageUrlSuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_SEARCH_VARIANT_IMAGE_URL_SUCCESS;
  constructor(public payload:  ImageResponse) {}
}
export class LoadSearchVariantImageUrlFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_SEARCH_VARIANT_IMAGE_URL_FAILURE;
  constructor(public payload:  ImageResponse) {}
}

// Image for Request Sent
export class LoadRequestThumbnailImageUrl implements Action {
  readonly type = ConversionActionTypes.LOAD_REQUEST_THUMBNAIL_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadRequestThumbnailImageUrlSuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_REQUEST_THUMBNAIL_IMAGE_URL_SUCCESS;
  constructor(public payload:  ImageResponse) {}
}
export class LoadRequestThumbnailImageUrlFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_REQUEST_THUMBNAIL_IMAGE_URL_FAILURE;
  constructor(public payload:  ImageResponse) {}
}

export class LoadRequestImageUrl implements Action {
  readonly type = ConversionActionTypes.LOAD_REQUEST_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadRequestImageUrlSuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_REQUEST_IMAGE_URL_SUCCESS;
  constructor(public payload:  ImageResponse) {}
}
export class LoadRequestImageUrlFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_REQUEST_IMAGE_URL_FAILURE;
  constructor(public payload:  ImageResponse) {}
}

// Image For History
export class LoadHistoryThumbnailImageUrl implements Action {
  readonly type = ConversionActionTypes.LOAD_HISTORY_THUMBNAIL_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadHistoryThumbnailImageUrlSuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_HISTORY_THUMBNAIL_IMAGE_URL_SUCCESS;
  constructor(public payload:  ImageResponse) {}
}
export class LoadHistoryThumbnailImageUrlFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_HISTORY_THUMBNAIL_IMAGE_URL_FAILURE;
  constructor(public payload:  ImageResponse) {}
}

export class LoadHistoryImageUrl implements Action {
  readonly type = ConversionActionTypes.LOAD_HISTORY_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadHistoryImageUrlSuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_HISTORY_IMAGE_URL_SUCCESS;
  constructor(public payload:  ImageResponse) {}
}
export class LoadHistoryImageUrlFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_HISTORY_IMAGE_URL_FAILURE;
  constructor(public payload:  ImageResponse) {}
}

export class LoadStandardMetalPriceDetails implements Action {
  readonly type = ConversionActionTypes.LOAD_STANDARD_METAL_PRICE_DETAILS;
}
export class LoadStandardMetalPriceDetailsSuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_STANDARD_METAL_PRICE_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadStandardMetalPriceDetailsFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_STANDARD_METAL_PRICE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPriceDetails implements Action {
  readonly type = ConversionActionTypes.LOAD_PRICE_DETAILS;
  constructor(public payload: PriceRequestPayload) {}
}
export class LoadPriceDetailsSuccess implements Action {
  readonly type = ConversionActionTypes.LOAD_PRICE_DETAILS_SUCCESS;
  constructor(public payload: ProductPriceDetails[]) {}
}
export class LoadPriceDetailsFailure implements Action {
  readonly type = ConversionActionTypes.LOAD_PRICE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}


export type ConversionActions =
  | LoadSearchVarient
  | LoadSearchVarientSuccess
  | LoadSearchVarientFailure
  | ClearVarientSearchList
  | AddToItemList
  | RemoveFromItemList
  | LoadConversionItems
  | LoadConversionItemsSuccess
  | LoadConversionItemsFailure
  | ClearLoadedConversionItem
  | SplitItems
  | SplitItemsSuccess
  | SplitItemsFailure
  | SendConversionRequest
  | SendConversionRequestSuccess
  | SendConversionRequestFailure
  | LoadRequestsCount
  | LoadRequestsCountSuccess
  | LoadRequestsCountFailure
  | LoadConversionRequests
  | LoadConversionRequestsSuccess
  | LoadConversionRequestsFailure
  | SearchConversionRequests
  | SearchConversionRequestsSuccess
  | SearchConversionRequestsFailure
  | ClearSearchRequests
  | LoadSelectedRequest
  | LoadSelectedRequestSuccess
  | LoadSelectedRequestFailure
  | LoadSelectedRequestData
  | LoadSelectedRequestDataSuccess
  | LoadSelectedRequestDataFailure
  | LoadRsoDetails
  | LoadRsoDetailsSuccess
  | LoadRsoDetailsFailure
  | ConfirmConversion
  | ConfirmConversionSuccess
  | ConfirmConversionFailure
  | LoadBinCodes
  | LoadBinCodesSuccess
  | LoadBinCodesFailure
  | LoadStuddedProductGroups
  | LoadStuddedProductGroupsSuccess
  | LoadStuddedProductGroupsFailure
  | ResetError
  | ResetSelectedRequestData
  | LoadRequestSentHistory
  | LoadRequestSentHistorySuccess
  | LoadRequestSentHistoryFailure
  | LoadSelectedRequestHistory
  | LoadSelectedRequestHistorySuccess
  | LoadSelectedRequestHistoryFailure
  | LoadConversionHistoryItems
  | LoadConversionHistoryItemsSuccess
  | LoadConversionHistoryItemsFailure
  | StoreRequestType
  | StoreAdvancedFilterData
  | LoadConvertedTransactionHistory
  | ResetConversionHistory
  | ResetAdvanceFilter
  | LoadConvertedTransactionHistorySuccess
  | LoadConvertedTransactionHistoryFailure
  | LoadSearchVariantImageUrl
  | LoadSearchVariantImageUrlSuccess
  | LoadSearchVariantImageUrlFailure
  | LoadSearchVariantThumbnailImageUrl
  | LoadSearchVariantThumbnailImageUrlSuccess
  | LoadSearchVariantThumbnailImageUrlFailure
  | LoadRequestImageUrl
  | LoadRequestImageUrlSuccess
  | LoadRequestImageUrlFailure
  | LoadRequestThumbnailImageUrl
  | LoadRequestThumbnailImageUrlSuccess
  | LoadRequestThumbnailImageUrlFailure
  | LoadHistoryImageUrl
  | LoadHistoryImageUrlSuccess
  | LoadHistoryImageUrlFailure
  | LoadHistoryThumbnailImageUrl
  | LoadHistoryThumbnailImageUrlSuccess
  | LoadHistoryThumbnailImageUrlFailure
  | LoadStandardMetalPriceDetails
  | LoadStandardMetalPriceDetailsSuccess
  | LoadStandardMetalPriceDetailsFailure
  | LoadPriceDetails
  | LoadPriceDetailsSuccess
  | LoadPriceDetailsFailure;
