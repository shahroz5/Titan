import { Action } from '@ngrx/store';

import {
  RequestList,
  CustomErrors,
  BoutiqueList,
  ItemList,
  ItemSummary,
  Request,
  LoadRequestListPayload,
  LoadBoutiqueListPayload,
  LoadRequestPayload,
  LoadItemListPayload,
  UpdateItemListPayload,
  UpdateItemListStatusPayload,
  LoadRequestListCountPayload,
  LoadIBTHistoryPayload,
  LoadIBTHistoryItemsResponse,
  LoadSelectedHistoryHeaderInfoPayload,
  IBThistoryHeaderPayload,
  LoadIBTHistoryItemsPayload,
  InterBoutiqueTransferRequestTypesEnum,
  HistoryFilterData,
  ImageResponse,
  ImageReqPayload
} from '@poss-web/shared/models';

export enum InterBoutiqueTransferActionTypes {
  LOAD_REQUEST_SENT_LIST = '[Inter-Boutique-Transfer] Load RequestSent List',
  LOAD_REQUEST_SENT_LIST_SUCCESS = '[Inter-Boutique-Transfer] Load RequestSent List Success',
  LOAD_REQUEST_SENT_LIST_FAILURE = '[Inter-Boutique-Transfer] Load RequestSent List Failure',

  LOAD_REQUEST_RECEIVED_LIST = '[Inter-Boutique-Transfer] Load RequestReceived List',
  LOAD_REQUEST_RECEIVED_LIST_SUCCESS = '[Inter-Boutique-Transfer] Load RequestReceived List Success',
  LOAD_REQUEST_RECEIVED_LIST_FAILURE = '[Inter-Boutique-Transfer] Load RequestReceived List Failure',

  LOAD_REQUEST_SENT_LIST_COUNT = '[Inter-Boutique-Transfer] Load RequestSent List Count',
  LOAD_REQUEST_SENT_LIST_COUNT_SUCCESS = '[Inter-Boutique-Transfer] Load RequestSent List Count Success',
  LOAD_REQUEST_SENT_LIST_COUNT_FAILURE = '[Inter-Boutique-Transfer] Load RequestSent List Count Failure',

  LOAD_REQUEST_RECEIVED_LIST_COUNT = '[Inter-Boutique-Transfer] Load RequestReceived List Count',
  LOAD_REQUEST_RECEIVED_LIST_COUNT_SUCCESS = '[Inter-Boutique-Transfer] Load RequestReceived List Count Success',
  LOAD_REQUEST_RECEIVED_LIST_COUNT_FAILURE = '[Inter-Boutique-Transfer] Load RequestReceived List Count Failure',

  LOAD_BOUTIQUE_LIST = '[Inter-Boutique-Transfer] Load Boutique List',
  LOAD_BOUTIQUE_LIST_SUCCESS = '[Inter-Boutique-Transfer] Load Boutique List Success',
  LOAD_BOUTIQUE_LIST_FAILURE = '[Inter-Boutique-Transfer] Load Boutique List Failure',

  LOAD_BOUTIQUE_LIST_COUNT = '[Inter-Boutique-Transfer] Load Boutique List Count',
  LOAD_BOUTIQUE_LIST_COUNT_SUCCESS = '[Inter-Boutique-Transfer] Load Boutique List Count Success',
  LOAD_BOUTIQUE_LIST_COUNT_FAILURE = '[Inter-Boutique-Transfer] Load Boutique List Count Failure',

  CREATE_REQUEST = '[Inter-Boutique-Transfer] Create Request',
  CREATE_REQUEST_SUCCESS = '[Inter-Boutique-Transfer] Create Request Success',
  CREATE_REQUEST_FAILURE = '[Inter-Boutique-Transfer] Create Request Failure',

  LOAD_REQUEST = '[Inter-Boutique-Transfer] Load Request',
  LOAD_REQUEST_SUCCESS = '[Inter-Boutique-Transfer] Load Request Success',
  LOAD_REQUEST_FAILURE = '[Inter-Boutique-Transfer] Load Request Failure',

  LOAD_ITEM_LIST = '[Inter-Boutique-Transfer] Load Item List',
  LOAD_ITEM_LIST_SUCCESS = '[Inter-Boutique-Transfer] Load Item List Success',
  LOAD_ITEM_LIST_FAILURE = '[Inter-Boutique-Transfer] Load Item List Failure',

  UPDATE_ITEM_LIST = '[Inter-Boutique-Transfer] Update Item List',
  UPDATE_ITEM_LIST_SUCCESS = '[Inter-Boutique-Transfer] Update Item List Success',
  UPDATE_ITEM_LIST_FAILURE = '[Inter-Boutique-Transfer] Update Item List Failure',

  UPDATE_ITEM_LIST_STATUS = '[Inter-Boutique-Transfer] Update Item List Status',
  UPDATE_ITEM_LIST_STATUS_SUCCESS = '[Inter-Boutique-Transfer] Update Item List Status Success',
  UPDATE_ITEM_LIST_STATUS_FAILURE = '[Inter-Boutique-Transfer] Update Item List Status Failure',

  SEARCH_ITEM = '[Inter-Boutique-Transfer] Search Item',
  SEARCH_ITEM_SUCCESS = '[Inter-Boutique-Transfer] Search Item Success',
  SEARCH_ITEM_FAILURE = '[Inter-Boutique-Transfer] Search Item Failure',

  CLEAR_REQUEST_SENT_LIST = '[Inter-Boutique-Transfer] Clear RequestSent List',
  CLEAR_REQUEST_RECEIVED_LIST = '[Inter-Boutique-Transfer] Clear RequestReceived List',
  CLEAR_ITEM_LIST = '[Inter-Boutique-Transfer] Clear Item List',
  CLEAR_BOUTIQUE_LIST = '[Inter-Boutique-Transfer] Clear Boutique List',
  RESET_BOUTIQUE_LIST_COUNT = '[Inter-Boutique-Transfer] Reset Boutique List Count',
  CLEAR_SEARCH_ITEM_RESPONSE = '[Inter-Boutique-Transfer] Clear Search Item Response',
  RESET_REQUEST_LIST = '[Inter-Boutique-Transfer] Reset Request List',

  LOAD_STUDDED_PRODUCT_GROUPS = '[Inter-Boutique-Transfer]  Load Studded Product Groups ',
  LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS = '[Inter-Boutique-Transfer]  Load Studded Product Groups Success ',
  LOAD_STUDDED_PRODUCT_GROUPS_FAILURE = '[Inter-Boutique-Transfer]  Load Studded Product Groups Failure ',
  //history
  LOAD_IBT_HISTORY = '[ Inter-Boutique-Transfer] Load Inter Boutique Transfer History',
  LOAD_IBT_HISTORY_SUCCESS = '[Inter-Boutique-Transfer ] Load Inter Boutique Transfer History Success',
  LOAD_IBT_HISTORY_FAILURE = '[ Inter-Boutique-Transfer ] Load Inter Boutique Transfer History Failure',

  RESET_LOADED_HISTORY = '[Inter-Boutique-Transfer] Clear Loaded History',

  LOAD_SELECTED_HISTORY = '[Inter-Boutique-Transfer] Load Selected History',
  LOAD_SELECTED_HISTORY_SUCCESS = '[Inter-Boutique-Transfer] Load Selected History Success',
  LOAD_SELECTED_HISTORY_FAILURE = '[Inter-Boutique-Transfer] Load Selected History Failure',

  LOAD_HISTORY_ITEMS = '[ Inter-Boutique-Transfer ] Load History Items ',
  LOAD_HISTORY_ITEMS_SUCCESS = '[ Inter-Boutique-Transfer] Load History Items Success',
  LOAD_HISTORY_ITEMS_FAILURE = '[ Inter-Boutique-Transfer ] Load History Items Failure',

  LOAD_HISTORY_FILTER_DATA = '[ Inter-Boutique-Transfer ] Load History Dates ',

  RADIO_HISTORY_TYPE = '[ Inter-Boutique-Transfer ] Radio History Type',

  RESET_HISTORY_FILTER_DATA = '[ Inter-Boutique-Transfer ] Reset History Filter Data',

  // Image

  LOAD_THUMBNAIL_IMAGE_URL = '[ Inter-Boutique-Transfer ] Load Thumbnail Image Url',
  LOAD_THUMBNAIL_IMAGE_URL_SUCCESS = '[ Inter-Boutique-Transfer ] Load Thumbnail Image Url Success',
  LOAD_THUMBNAIL_IMAGE_URL_FAILURE = '[ Inter-Boutique-Transfer ] Load Thumbnail Image Url Failure',

  LOAD_IMAGE_URL = '[ Inter-Boutique-Transfer ] Load Image Url',
  LOAD_IMAGE_URL_SUCCESS = '[ Inter-Boutique-Transfer ] Load Image Url Success',
  LOAD_IMAGE_URL_FAILURE = '[ Inter-Boutique-Transfer ] Load Image Url Failure',
}

export class LoadRequestSentList implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST;
  constructor(public payload: LoadRequestListPayload) {}
}

export class LoadRequestSentListSuccess implements Action {
  readonly type =
    InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST_SUCCESS;
  constructor(public payload: RequestList[]) {}
}

export class LoadRequestSentListFailure implements Action {
  readonly type =
    InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRequestReceivedList implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST;
  constructor(public payload: LoadRequestListPayload) {}
}

export class LoadRequestReceivedListSuccess implements Action {
  readonly type =
    InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST_SUCCESS;
  constructor(public payload: RequestList[]) {}
}

export class LoadRequestReceivedListFailure implements Action {
  readonly type =
    InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRequestSentListCount implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST_COUNT;
  constructor(public payload: LoadRequestListCountPayload) {}
}

export class LoadRequestSentListCountSuccess implements Action {
  readonly type =
    InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST_COUNT_SUCCESS;
  constructor(public payload: number) {}
}

export class LoadRequestSentListCountFailure implements Action {
  readonly type =
    InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRequestReceivedListCount implements Action {
  readonly type =
    InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST_COUNT;
  constructor(public payload: LoadRequestListCountPayload) {}
}

export class LoadRequestReceivedListCountSuccess implements Action {
  readonly type =
    InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST_COUNT_SUCCESS;
  constructor(public payload: number) {}
}

export class LoadRequestReceivedListCountFailure implements Action {
  readonly type =
    InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadBoutiqueList implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST;
  constructor(public payload: LoadBoutiqueListPayload) {}
}

export class LoadBoutiqueListSuccess implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST_SUCCESS;
  constructor(public payload: BoutiqueList[]) {}
}

export class LoadBoutiqueListFailure implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadBoutiqueListCount implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST_COUNT;
  constructor(public payload: LoadBoutiqueListPayload) {}
}

export class LoadBoutiqueListCountSuccess implements Action {
  readonly type =
    InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST_COUNT_SUCCESS;
  constructor(public payload: number) {}
}

export class LoadBoutiqueListCountFailure implements Action {
  readonly type =
    InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class CreateRequest implements Action {
  readonly type = InterBoutiqueTransferActionTypes.CREATE_REQUEST;
  constructor(public payload: Request) {}
}

export class CreateRequestSuccess implements Action {
  readonly type = InterBoutiqueTransferActionTypes.CREATE_REQUEST_SUCCESS;
  constructor(public payload: RequestList) {}
}

export class CreateRequestFailure implements Action {
  readonly type = InterBoutiqueTransferActionTypes.CREATE_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRequest implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_REQUEST;
  constructor(public payload: LoadRequestPayload) {}
}

export class LoadRequestSuccess implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_REQUEST_SUCCESS;
  constructor(public payload: RequestList) {}
}

export class LoadRequestFailure implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadItemList implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_ITEM_LIST;
  constructor(public payload: LoadItemListPayload) {}
}

export class LoadItemListSuccess implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_ITEM_LIST_SUCCESS;
  constructor(public payload: ItemList[]) {}
}

export class LoadItemListFailure implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_ITEM_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateItemList implements Action {
  readonly type = InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST;
  constructor(public payload: UpdateItemListPayload) {}
}

export class UpdateItemListSuccess implements Action {
  readonly type = InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST_SUCCESS;
  constructor(public payload: ItemList) {}
}

export class UpdateItemListFailure implements Action {
  readonly type = InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateItemListStatus implements Action {
  readonly type = InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST_STATUS;
  constructor(public payload: UpdateItemListStatusPayload) {}
}

export class UpdateItemListStatusSuccess implements Action {
  readonly type =
    InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST_STATUS_SUCCESS;
  constructor(public payload: RequestList) {}
}

export class UpdateItemListStatusFailure implements Action {
  readonly type =
    InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchItem implements Action {
  readonly type = InterBoutiqueTransferActionTypes.SEARCH_ITEM;
  constructor(public payload: string) {}
}

export class SearchItemSuccess implements Action {
  readonly type = InterBoutiqueTransferActionTypes.SEARCH_ITEM_SUCCESS;
  constructor(public payload: ItemSummary) {}
}

export class SearchItemFailure implements Action {
  readonly type = InterBoutiqueTransferActionTypes.SEARCH_ITEM_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ClearRequestSentList implements Action {
  readonly type = InterBoutiqueTransferActionTypes.CLEAR_REQUEST_SENT_LIST;
}

export class ClearRequestReceivedList implements Action {
  readonly type = InterBoutiqueTransferActionTypes.CLEAR_REQUEST_RECEIVED_LIST;
}

export class ClearItemList implements Action {
  readonly type = InterBoutiqueTransferActionTypes.CLEAR_ITEM_LIST;
}

export class ClearBoutiqueList implements Action {
  readonly type = InterBoutiqueTransferActionTypes.CLEAR_BOUTIQUE_LIST;
}

export class ResetBoutiqueListCount implements Action {
  readonly type = InterBoutiqueTransferActionTypes.RESET_BOUTIQUE_LIST_COUNT;
}

export class ClearSearchItemResponse implements Action {
  readonly type = InterBoutiqueTransferActionTypes.CLEAR_SEARCH_ITEM_RESPONSE;
}

export class ResetRequestList implements Action {
  readonly type = InterBoutiqueTransferActionTypes.RESET_REQUEST_LIST;
}
export class LoadStuddedProductGroups implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_STUDDED_PRODUCT_GROUPS;
}
export class LoadStuddedProductGroupsSuccess implements Action {
  readonly type =
    InterBoutiqueTransferActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadStuddedProductGroupsFailure implements Action {
  readonly type =
    InterBoutiqueTransferActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadIBTHistory implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_IBT_HISTORY;
  constructor(public payload: LoadIBTHistoryPayload) {
    console.log('aa', payload);
  }
}
export class LoadIBTHistorySuccess implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_IBT_HISTORY_SUCCESS;
  constructor(public payload: LoadIBTHistoryItemsResponse) {}
}
export class LoadIBTHistoryFailure implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_IBT_HISTORY_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetLoadedHistory implements Action {
  readonly type = InterBoutiqueTransferActionTypes.RESET_LOADED_HISTORY;
}

export class LoadSelectedHistory implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_SELECTED_HISTORY;
  constructor(public payload: LoadSelectedHistoryHeaderInfoPayload) {}
}
export class LoadSelectedHistorySuccess implements Action {
  readonly type =
    InterBoutiqueTransferActionTypes.LOAD_SELECTED_HISTORY_SUCCESS;
  constructor(public payload: IBThistoryHeaderPayload) {}
}
export class LoadSelectedHistoryFailure implements Action {
  readonly type =
    InterBoutiqueTransferActionTypes.LOAD_SELECTED_HISTORY_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadHistoryItems implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_HISTORY_ITEMS;
  constructor(public payload: LoadIBTHistoryItemsPayload) {}
}

export class LoadHistoryItemsSuccess implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_HISTORY_ITEMS_SUCCESS;
  constructor(public payload: ItemList[]) {}
}

export class LoadHistoryItemsFailure implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_HISTORY_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadHistoryFilterData implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_HISTORY_FILTER_DATA;
  constructor(public payload: HistoryFilterData) {}
}
export class RadioHistoryType implements Action {
  readonly type = InterBoutiqueTransferActionTypes.RADIO_HISTORY_TYPE;
  constructor(public payload: InterBoutiqueTransferRequestTypesEnum) {}
}
export class ResetHstoryFilter implements Action {
  readonly type = InterBoutiqueTransferActionTypes.RESET_HISTORY_FILTER_DATA;
  constructor(public payload: number) {}
}

// Image
export class LoadThumbnailImageUrl implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_THUMBNAIL_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadThumbnailImageUrlSuccess implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS;
  constructor(public payload:  ImageResponse) {}
}
export class LoadThumbnailImageUrlFailure implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE;
  constructor(public payload:  ImageResponse) {}
}

export class LoadImageUrl implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadImageUrlSuccess implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_IMAGE_URL_SUCCESS;
  constructor(public payload:  ImageResponse) {}
}
export class LoadImageUrlFailure implements Action {
  readonly type = InterBoutiqueTransferActionTypes.LOAD_IMAGE_URL_FAILURE;
  constructor(public payload:  ImageResponse) {}
}

export type InterBoutiqueTransferActions =
  | LoadRequestSentList
  | LoadRequestSentListSuccess
  | LoadRequestSentListFailure
  | LoadRequestReceivedList
  | LoadRequestReceivedListSuccess
  | LoadRequestReceivedListFailure
  | LoadRequestSentListCount
  | LoadRequestSentListCountSuccess
  | LoadRequestSentListCountFailure
  | LoadRequestReceivedListCount
  | LoadRequestReceivedListCountSuccess
  | LoadRequestReceivedListCountFailure
  | LoadBoutiqueList
  | LoadBoutiqueListSuccess
  | LoadBoutiqueListFailure
  | LoadBoutiqueListCount
  | LoadBoutiqueListCountSuccess
  | LoadBoutiqueListCountFailure
  | CreateRequest
  | CreateRequestSuccess
  | CreateRequestFailure
  | LoadRequest
  | LoadRequestSuccess
  | LoadRequestFailure
  | LoadItemList
  | LoadItemListSuccess
  | LoadItemListFailure
  | UpdateItemList
  | UpdateItemListSuccess
  | UpdateItemListFailure
  | UpdateItemListStatus
  | UpdateItemListStatusSuccess
  | UpdateItemListStatusFailure
  | SearchItem
  | SearchItemSuccess
  | SearchItemFailure
  | ClearRequestSentList
  | ClearRequestReceivedList
  | ClearItemList
  | ClearBoutiqueList
  | ResetBoutiqueListCount
  | ClearSearchItemResponse
  | ResetRequestList
  | LoadStuddedProductGroups
  | LoadStuddedProductGroupsSuccess
  | LoadStuddedProductGroupsFailure
  | LoadIBTHistory
  | LoadIBTHistoryFailure
  | LoadIBTHistorySuccess
  | ResetLoadedHistory
  | LoadSelectedHistory
  | LoadSelectedHistorySuccess
  | LoadSelectedHistoryFailure
  | LoadHistoryItems
  | LoadHistoryItemsSuccess
  | LoadHistoryItemsFailure
  | LoadHistoryFilterData
  | RadioHistoryType
  | ResetHstoryFilter
  | LoadImageUrl
  | LoadImageUrlSuccess
  | LoadImageUrlFailure
  | LoadThumbnailImageUrl
  | LoadThumbnailImageUrlSuccess
  | LoadThumbnailImageUrlFailure;
