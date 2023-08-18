import { Action } from '@ngrx/store';
import {
  AdvancedFilterData,
  BinToBinFileUploadItemsBulkTransferRequest,
  BinToBinTransferChangeSelectionPayload,
  BinToBinTransferConfirmTransferAllItemsRequest,
  BinToBinTransferConfirmTransferItemsRequest,
  BinToBinTransferConfirmTransferResponse,
  BinToBinTransferHistoryItemHeader,
  BinToBinTransferItem,
  BinToBinTransferItemListGroup,
  BinToBinTransferLoadFileUploadItemsRequest,
  BinToBinTransferLoadHistoryItemsPayload,
  BinToBinTransferLoadHistoryItemsResponse,
  BinToBinTransferLoadItemGroupsPayload,
  BinToBinTransferLoadItemListGroupResponse,
  BinToBinTransferLoadItemsPayload,
  BinToBinTransferLoadItemsResponse,
  BinToBinTransferUpdateDestinationBinPayload,
  CustomErrors,
  ImageReqPayload,
  ImageResponse,
  LoadBinToBinTransferHistoryPayload,
  LoadSelectedBinToBinHeaderInfoPayload,
  Lov,
  ProductCategory,
  ProductGroup,
  StoreBin
} from '@poss-web/shared/models';

export enum BinToBinTransferActionTypes {
  ADD_TO_ITEM_LIST = '[ BinToBinTransfer ] Add to item list Items',
  DELETE_FROM_ITEM_LIST = '[ BinToBinTransfer ] Remove from item list',
  UPDATE_LIST_ITEM = '[ BinToBinTransfer ] Update list item',
  CHANGE_SELECTION_OF_ALL_ITEMS = '[ BinToBinTransfer ] Change selection of all the items',
  UPDATE_DESTINATION_BIN_FOR_SELECTED_ITEMS = '[ BinToBinTransfer ] Update destination bin for selected items',
  DELETE_SELECTED_ITEMS = '[ BinToBinTransfer ] Delete the selected items',

  SEARCH_ITEM_GROUPS = '[ BinToBinTransfer ] Search Item Groups',
  SEARCH_ITEM_GROUPS_SUCCESS = '[ BinToBinTransfer ]  Search Item Groups Success',
  SERACH_ITEM_GROUPS_FAILURE = '[ BinToBinTransfer ]  Search Item Groups Failure',

  LOAD_ITEM_GROUP = '[ BinToBinTransfer ] Load Items Group',
  LOAD_ITEM_GROUP_SUCCESS = '[ BinToBinTransfer ]  Load Item Groups Success',
  LOAD_ITEM_GROUP_FAILURE = '[ BinToBinTransfer ]  Load Item Groups Failure',

  LOAD_SOURCE_BINS = '[ BinToBinTransfer ] Load source bin list',
  LOAD_SOURCE_BINS_SUCCESS = '[ BinToBinTransfer ] Load source bin list Success',
  LOAD_SOURCE_BINS_FAILURE = '[ BinToBinTransfer ] Load source bin list Failure',

  LOAD_PRODUCT_GROUPS = '[ BinToBinTransfer ] Load product groups',
  LOAD_PRODUCT_GROUPS_SUCCESS = '[ BinToBinTransfer ] Load product groups Success',
  LOAD_PRODUCT_GROUPS_FAILURE = '[ BinToBinTransfer ] Load product groups Failure',

  LOAD_PRODUCT_CATEGORY = '[ BinToBinTransfer ] Load product category ',
  LOAD_PRODUCT_CATEGORY_SUCCESS = '[ BinToBinTransfer ] Load product category  Success',
  LOAD_PRODUCT_CATEGORY_FAILURE = '[ BinToBinTransfer ] Load product category  Failure',

  LOAD_ITEMS = '[ BinToBinTransfer ] Load Items ',
  LOAD_ITEMS_SUCCESS = '[ BinToBinTransfer] Load Items Success',
  LOAD_ITEMS_FAILURE = '[ BinToBinTransfer ] Load Items Failure',

  LOAD_DEFECT_TYPE = '[ BinToBinTransfer ] Load Defect Type',
  LOAD_DEFECT_TYPE_SUCCESS = '[ BinToBinTransfer] Load Defect Type Success',
  LOAD_DEFECT_TYPE_FAILURE = '[ BinToBinTransfer ] Load Defect Type Failure',

  LOAD_DEFECT_CODE = '[ BinToBinTransfer ] Load Defect Code',
  LOAD_DEFECT_CODE_SUCCESS = '[ BinToBinTransfer] Load Defect Code Success',
  LOAD_DEFECT_CODE_FAILURE = '[ BinToBinTransfer ] Load Defect Code Failure',

  LOAD_FILE_UPLOAD_ITEMS = '[ BinToBinTransfer ] Load File Upload Items ',
  LOAD_FILE_UPLOAD_ITEMS_SUCCESS = '[ BinToBinTransfer] Load File Upload Items Success',
  LOAD_FILE_UPLOAD_ITEMS_FAILURE = '[ BinToBinTransfer ] Load File Upload Items Failure',

  LOAD_FILE_UPLOAD_ID = '[ BinToBinTransfer ] Load File Upload Id',
  LOAD_FILE_UPLOAD_ID_SUCCESS = '[ BinToBinTransfer] Load File Upload Id Success',
  LOAD_FILE_UPLOAD_ID_FAILURE = '[ BinToBinTransfer ] Load File Upload Id Failure',

  SEARCH_ITEMS = '[ BinToBinTransfer ] Search Items ',
  SEARCH_ITEMS_SUCCESS = '[ BinToBinTransfer] Search Items Success',
  SEARCH_ITEMS_FAILURE = '[ BinToBinTransfer ] Search Items Failure',

  CONFIRM_TRANSFER_ALL_ITEMS = '[ BinToBinTransfer ] Confirm transfer all Items ',
  CONFIRM_TRANSFER_ALL_ITEMS_SUCCESS = '[ BinToBinTransfer] Confirm transfer all Success',
  CONFIRM_TRANSFER_ALL_ITEMS_FAILURE = '[ BinToBinTransfer ] Confirm transfer all Failure',

  CONFIRM_TRANSFER_ITEMS = '[ BinToBinTransfer ] Confirm transfer Items ',
  CONFIRM_TRANSFER_ITEMS_SUCCESS = '[ BinToBinTransfer] Confirm transfer Success',
  CONFIRM_TRANSFER_ITEMS_FAILURE = '[ BinToBinTransfer ] Confirm transfer Failure',

  CONFIRM_FILE_UPLOAD_ITEMS_BULK_TRANSFER = '[ BinToBinTransfer ] Confirm File Upload Items Bulk Transfer',
  CONFIRM_FILE_UPLOAD_ITEMS_BULK_TRANSFER_SUCCESS = '[ BinToBinTransfer] Confirm File Upload Items Bulk Transfer Success',
  CONFIRM_FILE_UPLOAD_ITEMS_BULK_TRANSFER_FAILURE = '[ BinToBinTransfer ] Confirm File Upload Items Bulk Transfer Failure',

  LOAD_BINS = '[ BinToBinTransfer ] Load all bins ',
  LOAD_BINS_SUCCESS = '[ BinToBinTransfer ] Load all bins Success ',
  LOAD_BINS_FAILURE = '[ BinToBinTransfer ]  Load all bins Failure ',

  LOAD_PRODUCT_GROUP_OPTIONS = '[ BinToBinTransfer ]   Load Product Group options ',
  LOAD_PRODUCT_GROUP_OPTIONS_SUCCESS = '[ BinToBinTransfer ]   Load Product Group options Success ',
  LOAD_PRODUCT_GROUP_OPTIONS_FAILURE = '[ BinToBinTransfer ]   Load Product Group  options Failure ',

  LOAD_PRODUCT_CATEGORY_OPTIONS = '[ BinToBinTransfer ]   Load Product Category options ',
  LOAD_PRODUCT_CATEGORY_OPTIONS_SUCCESS = '[ BinToBinTransfer ]   Load Product Category options Success ',
  LOAD_PRODUCT_CATEGORY_OPTIONS_FAILURE = '[ BinToBinTransfer ]   Load Product Category options Failure ',

  LOAD_SOURCE_BIN_OPTIONS = '[ BinToBinTransfer ]   Load Source Bin options ',
  LOAD_SOURCE_BIN_OPTIONS_SUCCESS = '[ BinToBinTransfer ]   Load Source Bin options Success ',
  LOAD_SOURCE_BIN_OPTIONS_FAILURE = '[ BinToBinTransfer ]   Load Source Bin options Failure ',

  LOAD_STUDDED_PRODUCT_GROUPS = '[BinToBinTransfer]  Load Studded Product Groups ',
  LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS = '[BinToBinTransfer]  Load Studded Product Groups Success ',
  LOAD_STUDDED_PRODUCT_GROUPS_FAILURE = '[BinToBinTransfer]  Load Studded Product Groups Failure ',

  CLEAR_CONFIRM_TRANSFER_RESPONSE = '[ BinToBinTransfer ] Clear Confirm transfer Response',
  CLEAR_SEARCHED_ITEMS = '[ BinToBinTransfer ] Clear Searched Items',
  CLEAR_ITEMS = '[ BinToBinTransfer ] Clear Items',
  CLEAR_ITEMS_GROUPS = '[ BinToBinTransfer ] Clear Items Groups',
  CLEAR_SELECTED_ITEM_GROUP = '[ BinToBinTransfer ] Clear Selected Item Group',

  LOAD_BIN_TO_BIN_HISTORY = '[ BinToBinTransfer ] Load History',
  LOAD_BIN_TO_BIN_HISTORY_SUCCESS = '[ BinToBinTransfer ] Load History Success',
  LOAD_BIN_TO_BIN_HISTORY_FAILURE = '[ BinToBinTransfer ] Load History Failure',

  RESET_LOADED_HISTORY = '[BinToBinTransfer] Clear Loaded History',

  // LOAD_BIN_TO_BIN_HISTORY_COUNT = '[BinToBinTransfer] Load History Count',
  // LOAD_BIN_TO_BIN_HISTORY_COUNT_SUCCESS = '[BinToBinTransfer] Load History Count Success ',
  // LOAD_BIN_TO_BIN_HISTORY_COUNT_FAILURE = '[BinToBinTransfer] Load History Count Failure',

  LOAD_SELECTED_HISTORY = '[BinToBinTransfer Details] Load Selected History',
  LOAD_SELECTED_HISTORY_SUCCESS = '[BinToBinTransfer Details] Load Selected History Success',
  LOAD_SELECTED_HISTORY_FAILURE = '[BinToBinTransfer Details] Load Selected History Failure',

  LOAD_HISTORY_ITEMS = '[ BinToBinTransfer ] Load History Items ',
  LOAD_HISTORY_ITEMS_SUCCESS = '[ BinToBinTransfer] Load History Items Success',
  LOAD_HISTORY_ITEMS_FAILURE = '[ BinToBinTransfer ] Load History Items Failure',

  LOAD_HISTORY_FILTER_DATA = '[ BinToBinTransfer ] Load History Dates ',
  RESET_HISTORY_FILTER_DATA = '[ Inter-Boutique-Transfer ] Reset History Filter Data',

  // Image

  LOAD_THUMBNAIL_IMAGE_URL = '[ BinToBinTransfer ] Load Thumbnail Image Url',
  LOAD_THUMBNAIL_IMAGE_URL_SUCCESS = '[ BinToBinTransfer ] Load Thumbnail Image Url Success',
  LOAD_THUMBNAIL_IMAGE_URL_FAILURE = '[ BinToBinTransfer ] Load Thumbnail Image Url Failure',

  LOAD_IMAGE_URL = '[ BinToBinTransfer ] Load Image Url',
  LOAD_IMAGE_URL_SUCCESS = '[ BinToBinTransfer ] Load Image Url Success',
  LOAD_IMAGE_URL_FAILURE = '[ BinToBinTransfer ] Load Image Url Failure'
}
export class AddToItemList implements Action {
  readonly type = BinToBinTransferActionTypes.ADD_TO_ITEM_LIST;
  constructor(public payload: BinToBinTransferItem[]) {}
}

export class UpdateItemList implements Action {
  readonly type = BinToBinTransferActionTypes.UPDATE_LIST_ITEM;
  constructor(public payload: BinToBinTransferItem) {}
}

export class DeleteFromItemList implements Action {
  readonly type = BinToBinTransferActionTypes.DELETE_FROM_ITEM_LIST;
  constructor(public payload: string) {}
}

export class ChangeSelectionOfAllItems implements Action {
  readonly type = BinToBinTransferActionTypes.CHANGE_SELECTION_OF_ALL_ITEMS;
  constructor(public payload: BinToBinTransferChangeSelectionPayload) {}
}

export class UpdateDestinationBinForSelectedItems implements Action {
  readonly type =
    BinToBinTransferActionTypes.UPDATE_DESTINATION_BIN_FOR_SELECTED_ITEMS;
  constructor(public payload: BinToBinTransferUpdateDestinationBinPayload) {}
}

export class DeleteSelectedItems implements Action {
  readonly type = BinToBinTransferActionTypes.DELETE_SELECTED_ITEMS;
  constructor(public payload: string[]) {}
}
export class LoadSourceBins implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_SOURCE_BINS;
  constructor(public payload: BinToBinTransferLoadItemGroupsPayload) {}
}

export class LoadSourceBinsSuccess implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_SOURCE_BINS_SUCCESS;
  constructor(public payload: BinToBinTransferLoadItemListGroupResponse) {}
}

export class LoadSourceBinsFailure implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_SOURCE_BINS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadProductsGroups implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_PRODUCT_GROUPS;
  constructor(public payload: BinToBinTransferLoadItemGroupsPayload) {}
}

export class LoadProductsGroupsSuccess implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: BinToBinTransferLoadItemListGroupResponse) {}
}

export class LoadProductsGroupsFailure implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadProductsCategory implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY;
  constructor(public payload: BinToBinTransferLoadItemGroupsPayload) {}
}

export class LoadProductsCategorySuccess implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY_SUCCESS;
  constructor(public payload: BinToBinTransferLoadItemListGroupResponse) {}
}

export class LoadProductsCategoryFailure implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchItemGroups implements Action {
  readonly type = BinToBinTransferActionTypes.SEARCH_ITEM_GROUPS;
  constructor(public payload: BinToBinTransferLoadItemGroupsPayload) {}
}

export class SearchItemGroupsSuccess implements Action {
  readonly type = BinToBinTransferActionTypes.SEARCH_ITEM_GROUPS_SUCCESS;
  constructor(public payload: BinToBinTransferLoadItemListGroupResponse) {}
}

export class SearchItemGroupsFailure implements Action {
  readonly type = BinToBinTransferActionTypes.SERACH_ITEM_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadItemGroup implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_ITEM_GROUP;
  constructor(public payload: BinToBinTransferLoadItemGroupsPayload) {}
}

export class LoadItemGroupSuccess implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_ITEM_GROUP_SUCCESS;
  constructor(public payload: BinToBinTransferItemListGroup) {}
}

export class LoadItemGroupFailure implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_ITEM_GROUP_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadItems implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_ITEMS;
  constructor(public payload: BinToBinTransferLoadItemsPayload) {}
}

export class LoadItemsSuccess implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_ITEMS_SUCCESS;
  constructor(public payload: BinToBinTransferLoadItemsResponse) {}
}

export class LoadItemsFailure implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadDefectType implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_DEFECT_TYPE;
  constructor(public payload?: string) {}
}

export class LoadDefectTypeSuccess implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_DEFECT_TYPE_SUCCESS;
  constructor(public payload: Lov[]) {}
}

export class LoadDefectTypeFailure implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_DEFECT_TYPE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadDefectCode implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_DEFECT_CODE;
  constructor(public payload?: string) {}
}

export class LoadDefectCodeSuccess implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_DEFECT_CODE_SUCCESS;
  constructor(public payload: Lov[]) {}
}

export class LoadDefectCodeFailure implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_DEFECT_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}


export class LoadFileUploadItems implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_FILE_UPLOAD_ITEMS;
  constructor(public payload: BinToBinTransferLoadFileUploadItemsRequest) {}
}

export class LoadFileUploadItemsSuccess implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_FILE_UPLOAD_ITEMS_SUCCESS;
  constructor(public payload: BinToBinTransferLoadItemsResponse) {}
}

export class LoadFileUploadItemsFailure implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_FILE_UPLOAD_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadFileUploadId implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_FILE_UPLOAD_ID;
  constructor(public payload: FormData) {}
}

export class LoadFileUploadIdSuccess implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_FILE_UPLOAD_ID_SUCCESS;
  constructor(public payload: number) {}
}

export class LoadFileUploadIdFailure implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_FILE_UPLOAD_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchItems implements Action {
  readonly type = BinToBinTransferActionTypes.SEARCH_ITEMS;
  constructor(public payload: BinToBinTransferLoadItemsPayload) {}
}

export class SearchItemsSuccess implements Action {
  readonly type = BinToBinTransferActionTypes.SEARCH_ITEMS_SUCCESS;
  constructor(public payload: BinToBinTransferLoadItemsResponse) {}
}

export class SearchItemsFailure implements Action {
  readonly type = BinToBinTransferActionTypes.SEARCH_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ConfirmTransferAllItems implements Action {
  readonly type = BinToBinTransferActionTypes.CONFIRM_TRANSFER_ALL_ITEMS;
  constructor(public payload: BinToBinTransferConfirmTransferAllItemsRequest) {}
}

export class ConfirmTransferAllItemsSuccess implements Action {
  readonly type =
    BinToBinTransferActionTypes.CONFIRM_TRANSFER_ALL_ITEMS_SUCCESS;
  constructor(public payload: BinToBinTransferConfirmTransferResponse) {}
}

export class ConfirmTransferAllItemsFailure implements Action {
  readonly type =
    BinToBinTransferActionTypes.CONFIRM_TRANSFER_ALL_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ConfirmTransferItems implements Action {
  readonly type = BinToBinTransferActionTypes.CONFIRM_TRANSFER_ITEMS;
  constructor(public payload: BinToBinTransferConfirmTransferItemsRequest) {}
}

export class ConfirmTransferItemsSuccess implements Action {
  readonly type = BinToBinTransferActionTypes.CONFIRM_TRANSFER_ITEMS_SUCCESS;
  constructor(
    public payload: {
      confirmTransferResponse: BinToBinTransferConfirmTransferResponse;
      itemId: string[];
      remove: boolean;
    }
  ) {}
}

export class ConfirmTransferItemsFailure implements Action {
  readonly type = BinToBinTransferActionTypes.CONFIRM_TRANSFER_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ConfirmFileUploadItemsBulkTransfer implements Action {
  readonly type = BinToBinTransferActionTypes.CONFIRM_FILE_UPLOAD_ITEMS_BULK_TRANSFER;
  constructor(public payload: BinToBinFileUploadItemsBulkTransferRequest) {}
}

export class ConfirmFileUploadItemsBulkTransferSuccess implements Action {
  readonly type = BinToBinTransferActionTypes.CONFIRM_FILE_UPLOAD_ITEMS_BULK_TRANSFER_SUCCESS;
  constructor(
    public payload: {
      confirmTransferResponse: BinToBinTransferConfirmTransferResponse;
    }
  ) {}
}

export class ConfirmFileUploadItemsBulkTransferFailure implements Action {
  readonly type = BinToBinTransferActionTypes.CONFIRM_FILE_UPLOAD_ITEMS_BULK_TRANSFER_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ClearConfirmTransferResponse implements Action {
  readonly type = BinToBinTransferActionTypes.CLEAR_CONFIRM_TRANSFER_RESPONSE;
}

export class ClearSearchedItems implements Action {
  readonly type = BinToBinTransferActionTypes.CLEAR_SEARCHED_ITEMS;
}

export class ClearItems implements Action {
  readonly type = BinToBinTransferActionTypes.CLEAR_ITEMS;
}

export class ClearItemsGroups implements Action {
  readonly type = BinToBinTransferActionTypes.CLEAR_ITEMS_GROUPS;
}

export class ClearSelectedItemGroup implements Action {
  readonly type = BinToBinTransferActionTypes.CLEAR_SELECTED_ITEM_GROUP;
}

export class LoadBins implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_BINS;
}

export class LoadBinsSuccess implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_BINS_SUCCESS;
  constructor(public payload: StoreBin[]) {}
}
export class LoadBinsFailure implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_BINS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadProductGroupOptions implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_PRODUCT_GROUP_OPTIONS;
}
export class LoadProductGroupOptionsSuccess implements Action {
  readonly type =
    BinToBinTransferActionTypes.LOAD_PRODUCT_GROUP_OPTIONS_SUCCESS;
  constructor(public payload: ProductGroup[]) {}
}
export class LoadProductGroupOptionsFailure implements Action {
  readonly type =
    BinToBinTransferActionTypes.LOAD_PRODUCT_GROUP_OPTIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadProductCategoryOptions implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY_OPTIONS;
}
export class LoadProductCategoryOptionsSuccess implements Action {
  readonly type =
    BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY_OPTIONS_SUCCESS;
  constructor(public payload: ProductCategory[]) {}
}
export class LoadProductCategoryOptionsFailure implements Action {
  readonly type =
    BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY_OPTIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSourceBinOptions implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_SOURCE_BIN_OPTIONS;
}
export class LoadSourceBinOptionsSuccess implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_SOURCE_BIN_OPTIONS_SUCCESS;
  constructor(public payload: string[]) {}
}

export class LoadStuddedProductGroups implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_STUDDED_PRODUCT_GROUPS;
}
export class LoadStuddedProductGroupsSuccess implements Action {
  readonly type =
    BinToBinTransferActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadStuddedProductGroupsFailure implements Action {
  readonly type =
    BinToBinTransferActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadSourceBinOptionsFailure implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_SOURCE_BIN_OPTIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadBinToBinHistory implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_BIN_TO_BIN_HISTORY;
  constructor(public payload: LoadBinToBinTransferHistoryPayload) {}
}
export class LoadBinToBinHistorySuccess implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_BIN_TO_BIN_HISTORY_SUCCESS;
  constructor(public payload: BinToBinTransferLoadHistoryItemsResponse) {}
}
export class LoadBinToBinHistoryFailure implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_BIN_TO_BIN_HISTORY_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetLoadedHistory implements Action {
  readonly type = BinToBinTransferActionTypes.RESET_LOADED_HISTORY;
}

export class LoadSelectedHistory implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_SELECTED_HISTORY;
  constructor(public payload: LoadSelectedBinToBinHeaderInfoPayload) {}
}
export class LoadSelectedHistorySuccess implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_SELECTED_HISTORY_SUCCESS;
  constructor(public payload: BinToBinTransferHistoryItemHeader) {}
}
export class LoadSelectedHistoryFailure implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_SELECTED_HISTORY_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadHistoryItems implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_HISTORY_ITEMS;
  constructor(public payload: BinToBinTransferLoadHistoryItemsPayload) {}
}

export class LoadHistoryItemsSuccess implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_HISTORY_ITEMS_SUCCESS;
  constructor(public payload: BinToBinTransferLoadItemsResponse) {}
}

export class LoadHistoryItemsFailure implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_HISTORY_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadHistoryFilterData implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_HISTORY_FILTER_DATA;
  constructor(public payload: AdvancedFilterData) {}
}
export class ResetHstoryFilter implements Action {
  readonly type = BinToBinTransferActionTypes.RESET_HISTORY_FILTER_DATA;
  constructor(public payload: number) {}
}

// Image
export class LoadThumbnailImageUrl implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_THUMBNAIL_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadThumbnailImageUrlSuccess implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS;
  constructor(public payload: ImageResponse) {}
}
export class LoadThumbnailImageUrlFailure implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE;
  constructor(public payload: ImageResponse) {}
}

export class LoadImageUrl implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadImageUrlSuccess implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_IMAGE_URL_SUCCESS;
  constructor(public payload: ImageResponse) {}
}
export class LoadImageUrlFailure implements Action {
  readonly type = BinToBinTransferActionTypes.LOAD_IMAGE_URL_FAILURE;
  constructor(public payload: ImageResponse) {}
}

export type BinToBinTransferActions =
  | AddToItemList
  | UpdateItemList
  | DeleteFromItemList
  | ChangeSelectionOfAllItems
  | UpdateDestinationBinForSelectedItems
  | DeleteSelectedItems
  | SearchItems
  | SearchItemsSuccess
  | SearchItemsFailure
  | LoadItems
  | LoadItemsSuccess
  | LoadItemsFailure
  | LoadFileUploadItems
  | LoadFileUploadItemsSuccess
  | LoadFileUploadItemsFailure
  | LoadFileUploadId
  | LoadFileUploadIdSuccess
  | LoadFileUploadIdFailure
  | ConfirmTransferAllItems
  | ConfirmTransferAllItemsSuccess
  | ConfirmTransferAllItemsFailure
  | ConfirmTransferItems
  | ConfirmTransferItemsSuccess
  | ConfirmTransferItemsFailure
  | ClearConfirmTransferResponse
  | LoadItemGroup
  | LoadItemGroupFailure
  | SearchItemGroups
  | SearchItemGroupsSuccess
  | SearchItemGroupsFailure
  | LoadItemGroupSuccess
  | LoadSourceBins
  | LoadSourceBinsSuccess
  | LoadSourceBinsFailure
  | LoadProductsGroups
  | LoadProductsGroupsSuccess
  | LoadProductsGroupsFailure
  | LoadProductsCategory
  | LoadProductsCategorySuccess
  | LoadProductsCategoryFailure
  | ClearSearchedItems
  | ClearItems
  | ClearItemsGroups
  | ClearSelectedItemGroup
  | LoadBins
  | LoadBinsSuccess
  | LoadBinsFailure
  | LoadProductGroupOptions
  | LoadProductGroupOptionsSuccess
  | LoadProductGroupOptionsFailure
  | LoadProductCategoryOptions
  | LoadProductCategoryOptionsSuccess
  | LoadProductCategoryOptionsFailure
  | LoadStuddedProductGroups
  | LoadStuddedProductGroupsSuccess
  | LoadStuddedProductGroupsFailure
  | LoadSourceBinOptions
  | LoadSourceBinOptionsSuccess
  | LoadSourceBinOptionsFailure
  | LoadBinToBinHistory
  | LoadBinToBinHistorySuccess
  | LoadBinToBinHistoryFailure
  | ResetLoadedHistory
  | LoadSelectedHistory
  | LoadSelectedHistorySuccess
  | LoadSelectedHistoryFailure
  | LoadHistoryItems
  | LoadHistoryItemsSuccess
  | LoadHistoryItemsFailure
  | LoadHistoryFilterData
  | ResetHstoryFilter
  | LoadImageUrl
  | LoadImageUrlSuccess
  | LoadImageUrlFailure
  | LoadDefectCode
  | LoadDefectCodeSuccess
  | LoadDefectCodeFailure
  | LoadDefectType
  | LoadDefectTypeFailure
  | LoadDefectTypeSuccess
  | LoadThumbnailImageUrl
  | LoadThumbnailImageUrlSuccess
  | LoadThumbnailImageUrlFailure
  | ConfirmFileUploadItemsBulkTransfer
  | ConfirmFileUploadItemsBulkTransferSuccess
  | ConfirmFileUploadItemsBulkTransferFailure;
