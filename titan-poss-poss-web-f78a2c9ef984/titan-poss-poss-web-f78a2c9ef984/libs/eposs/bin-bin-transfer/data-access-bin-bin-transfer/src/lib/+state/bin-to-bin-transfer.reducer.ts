import {
  BinToBinTransferActions,
  BinToBinTransferActionTypes
} from './bin-to-bin-transfer-actions';
import { BinToBinTransferState } from './bin-to-bin-transfer.state';
import {
  itemAdapter,
  itemListGroupAdapter,
  binToBinTransferHistoryAdaptor
} from './bin-to-bin-transfer.entity';
import { Update } from '@ngrx/entity';
import { BinToBinTransferItem } from '@poss-web/shared/models';
import * as moment from 'moment';
import { Action } from 'rxjs/internal/scheduler/Action';
import { count } from 'rxjs/operators';

export const initialState: BinToBinTransferState = {
  searchedItemList: itemAdapter.getInitialState(),
  isSearchingItems: false,
  hasSearchedItems: null,
  itemList: itemAdapter.getInitialState(),
  isLoadingItems: false,
  isLoadingItemsSuccess: null,
  itemsTotalCount: 0,
  confirmTransferResponse: null,
  sourceBins: itemListGroupAdapter.getInitialState(),
  sourceBinsTotalCount: 0,
  productGroups: itemListGroupAdapter.getInitialState(),
  productGroupsTotalCount: 0,
  productCategory: itemListGroupAdapter.getInitialState(),
  productCategoryTotalCount: 0,
  searchedItemListGroups: itemListGroupAdapter.getInitialState(),
  searchedItemListGroupsTotalCount: 0,
  selectedItemListGroup: null,
  isLoadingSelectedItemListGroupSuccess: null,
  isLoadingItemListGroup: false,
  bins: [],
  isLoadingBins: false,
  productGroupOptions: [],
  isLoadingProductGroupOptions: false,
  productCategoryOptions: [],
  isLoadingProductCategoryOptions: false,
  soruceBinOptions: [],
  isLoadingSoruceBinOptionsOptions: false,
  error: null,

  binToBinHistory: binToBinTransferHistoryAdaptor.getInitialState(),
  isLoadingHistory: false,
  binToBinHistoryCount: 0,
  isLoadingSelectedHistory: false,
  hasSelectedHistory: false,
  selectedHistory: null,
  items: binToBinTransferHistoryAdaptor.getInitialState(),
  advancedFilter: {
    startDate: null,
    endDate: null,
    fiscalYear: null
  },
  studdedProductGroups: [],
  itemsTotalValue: 0,
  itemsTotalQuantity: 0,
  isLoadingImage: false,
  binToBinAllowedtotalValue: 0,
  binToBinAllowedtotalQuantity: 0,
  binToBinAllowedtotalItems: 0,
  notInStock: [],
  invalidItems: []
};

export function BinToBinTransferReducer(
  state: BinToBinTransferState = initialState,
  action: BinToBinTransferActions
): BinToBinTransferState {
  switch (action.type) {
    case BinToBinTransferActionTypes.LOAD_SOURCE_BINS:
    case BinToBinTransferActionTypes.LOAD_PRODUCT_GROUPS:
    case BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY:
    case BinToBinTransferActionTypes.LOAD_DEFECT_TYPE:
    case BinToBinTransferActionTypes.LOAD_DEFECT_CODE:
      return {
        ...state,
        isLoadingItemListGroup: true,
        error: null
      };

    case BinToBinTransferActionTypes.LOAD_SOURCE_BINS_SUCCESS:
      return {
        ...state,
        sourceBins: itemListGroupAdapter.addMany(
          action.payload.itemListGroups,
          state.sourceBins
        ),
        sourceBinsTotalCount: action.payload.count,
        isLoadingItemListGroup: false
      };

    case BinToBinTransferActionTypes.LOAD_SOURCE_BINS_FAILURE:
    case BinToBinTransferActionTypes.LOAD_PRODUCT_GROUPS_FAILURE:
    case BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY_FAILURE:
    case BinToBinTransferActionTypes.LOAD_ITEM_GROUP_FAILURE:
    case BinToBinTransferActionTypes.SERACH_ITEM_GROUPS_FAILURE:
    case BinToBinTransferActionTypes.LOAD_DEFECT_TYPE_FAILURE:
    case BinToBinTransferActionTypes.LOAD_DEFECT_CODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingItemListGroup: false
      };

    case BinToBinTransferActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        productGroups: itemListGroupAdapter.addMany(
          action.payload.itemListGroups,
          state.productGroups
        ),
        productGroupsTotalCount: action.payload.count,
        isLoadingItemListGroup: false
      };

    case BinToBinTransferActionTypes.LOAD_DEFECT_CODE_SUCCESS:
      return {
        ...state,
        defectCodeList: action.payload,
        isLoadingItemListGroup: false
      };
    case BinToBinTransferActionTypes.LOAD_DEFECT_TYPE_SUCCESS:
      return {
        ...state,
        defectTypeList: action.payload,
        isLoadingItemListGroup: false
      };
    case BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY_SUCCESS:
      return {
        ...state,
        productCategory: itemListGroupAdapter.addMany(
          action.payload.itemListGroups,
          state.productCategory
        ),
        productCategoryTotalCount: action.payload.count,
        isLoadingItemListGroup: false
      };

    case BinToBinTransferActionTypes.LOAD_ITEM_GROUP:
      return {
        ...state,
        isLoadingItemListGroup: true,
        error: null,
        selectedItemListGroup: null,
        isLoadingSelectedItemListGroupSuccess: null
      };

    case BinToBinTransferActionTypes.LOAD_ITEM_GROUP_SUCCESS:
      let isLoaded = false;
      if (action.payload) {
        isLoaded = true;
      }
      return {
        ...state,
        selectedItemListGroup: action.payload,
        isLoadingSelectedItemListGroupSuccess: isLoaded,
        isLoadingItemListGroup: false
      };

    case BinToBinTransferActionTypes.SEARCH_ITEM_GROUPS:
      return {
        ...state,
        isLoadingItemListGroup: true,
        error: null,
        searchedItemListGroups: itemListGroupAdapter.removeAll(
          state.searchedItemListGroups
        ),
        searchedItemListGroupsTotalCount: 0
      };

    case BinToBinTransferActionTypes.SEARCH_ITEM_GROUPS_SUCCESS:
      return {
        ...state,
        searchedItemListGroups: itemListGroupAdapter.setAll(
          action.payload.itemListGroups,
          state.searchedItemListGroups
        ),
        searchedItemListGroupsTotalCount: action.payload.count,
        isLoadingItemListGroup: false
      };

    case BinToBinTransferActionTypes.SEARCH_ITEMS:
      return {
        ...state,
        hasSearchedItems: null,
        isSearchingItems: true,
        searchedItemList: itemAdapter.removeAll(state.searchedItemList),
        error: null
      };

    case BinToBinTransferActionTypes.SEARCH_ITEMS_SUCCESS: {
      return {
        ...state,
        searchedItemList: itemAdapter.setAll(
          action.payload.items,
          state.searchedItemList
        ),
        hasSearchedItems: true,
        isSearchingItems: false
      };
    }

    case BinToBinTransferActionTypes.SEARCH_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        hasSearchedItems: false,
        isSearchingItems: false
      };

    case BinToBinTransferActionTypes.LOAD_ITEMS:
    case BinToBinTransferActionTypes.LOAD_FILE_UPLOAD_ITEMS:
    case BinToBinTransferActionTypes.LOAD_FILE_UPLOAD_ID:
    case BinToBinTransferActionTypes.LOAD_HISTORY_ITEMS:
      return {
        ...state,
        isLoadingItems: true,
        isLoadingItemsSuccess: null,
        itemList: itemAdapter.removeAll(state.itemList),
        error: null
      };

    case BinToBinTransferActionTypes.LOAD_ITEMS_SUCCESS:
    case BinToBinTransferActionTypes.LOAD_HISTORY_ITEMS_SUCCESS: {
      return {
        ...state,
        itemList: itemAdapter.setAll(action.payload.items, state.itemList),
        itemsTotalCount: action.payload.count,
        isLoadingItemsSuccess: true,
        isLoadingItems: false,
        itemsTotalQuantity: action.payload.totalQuantity,
        itemsTotalValue: action.payload.totalValue,
        binToBinAllowedtotalQuantity: action.payload.binToBinAllowedtotalQuantity,
        binToBinAllowedtotalValue: action.payload.binToBinAllowedtotalValue,
        binToBinAllowedtotalItems: action.payload.binToBinAllowedtotalItems
      };
    }

    case BinToBinTransferActionTypes.LOAD_ITEMS_FAILURE:
    case BinToBinTransferActionTypes.LOAD_FILE_UPLOAD_ITEMS_FAILURE:
    case BinToBinTransferActionTypes.LOAD_FILE_UPLOAD_ID_FAILURE:
    case BinToBinTransferActionTypes.LOAD_HISTORY_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingItems: false,
        isLoadingItemsSuccess: false
      };
    case BinToBinTransferActionTypes.LOAD_FILE_UPLOAD_ITEMS_SUCCESS:
      return {
        ...state,
        itemList: itemAdapter.addMany(action.payload.items, state.itemList),
        notInStock: action.payload.notInStock,
        invalidItems: action.payload.invalidItems,
        itemsTotalCount: action.payload.count,
        isLoadingItems: false
      };
    case BinToBinTransferActionTypes.LOAD_FILE_UPLOAD_ID_SUCCESS:
      return {
        ...state,
        fileId: action.payload,
        isLoadingItems: false
      };
    case BinToBinTransferActionTypes.ADD_TO_ITEM_LIST:
      return {
        ...state,
        itemList: itemAdapter.addMany(action.payload, state.itemList)
      };

    case BinToBinTransferActionTypes.UPDATE_LIST_ITEM:
      return {
        ...state,
        itemList: itemAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              isSelected: action.payload.isSelected,
              transferQuantity: action.payload.transferQuantity,
              defectCodeDesc: action.payload.defectCodeDesc,
              defectTypeDesc: action.payload.defectTypeDesc,
              destinationBinCode: action.payload.destinationBinCode,
              destinationBinGroupCode: action.payload.destinationBinGroupCode
            }
          },
          state.itemList
        )
      };

    case BinToBinTransferActionTypes.DELETE_FROM_ITEM_LIST:
      return {
        ...state,
        itemList: itemAdapter.removeOne(action.payload, state.itemList)
      };

    case BinToBinTransferActionTypes.CHANGE_SELECTION_OF_ALL_ITEMS:
      return {
        ...state,
        itemList: itemAdapter.updateMany(
          action.payload.idList.map(
            (id): Update<BinToBinTransferItem> => ({
              id: id,
              changes: {
                isDisabled: action.payload.disable,
                isSelected: action.payload.select,
                ...(action.payload.resetBin
                  ? { destinationBinCode: null, destinationBinGroupCode: null }
                  : {})
              }
            })
          ),
          state.itemList
        )
      };

    case BinToBinTransferActionTypes.UPDATE_DESTINATION_BIN_FOR_SELECTED_ITEMS:
      return {
        ...state,
        itemList: itemAdapter.updateMany(
          action.payload.idList.map(
            (id): Update<BinToBinTransferItem> => ({
              id: id,
              changes: {
                destinationBinCode: action.payload.destinationBinCode,
                destinationBinGroupCode: action.payload.destinationBinGroupCode
              }
            })
          ),
          state.itemList
        )
      };

    case BinToBinTransferActionTypes.DELETE_SELECTED_ITEMS:
      return {
        ...state,
        itemList: itemAdapter.removeMany(action.payload, state.itemList)
      };
    case BinToBinTransferActionTypes.CONFIRM_TRANSFER_ITEMS:
    case BinToBinTransferActionTypes.CONFIRM_FILE_UPLOAD_ITEMS_BULK_TRANSFER:
    case BinToBinTransferActionTypes.CONFIRM_TRANSFER_ALL_ITEMS:
      return {
        ...state,
        confirmTransferResponse: null,
        error: null
      };
    case BinToBinTransferActionTypes.CONFIRM_FILE_UPLOAD_ITEMS_BULK_TRANSFER_SUCCESS:
      return {
        ...state,
        confirmTransferResponse: action.payload.confirmTransferResponse,
        itemList: itemAdapter.removeAll(state.itemList)
      };
    case BinToBinTransferActionTypes.CONFIRM_TRANSFER_ITEMS_SUCCESS:
      return {
        ...state,
        confirmTransferResponse: action.payload.confirmTransferResponse,
        itemList: itemAdapter.removeMany(
          action.payload.remove ? action.payload.itemId : [],
          state.itemList
        ),
        itemsTotalCount: itemAdapter.removeMany(
          action.payload.remove ? action.payload.itemId : [],
          state.itemList
        ).ids.length
      };

    case BinToBinTransferActionTypes.CONFIRM_TRANSFER_ITEMS_FAILURE:
    case BinToBinTransferActionTypes.CONFIRM_FILE_UPLOAD_ITEMS_BULK_TRANSFER_FAILURE:
    case BinToBinTransferActionTypes.CONFIRM_TRANSFER_ALL_ITEMS_FAILURE:
    case BinToBinTransferActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE:
      return {
        ...state,
        error: action.payload
      };

    case BinToBinTransferActionTypes.CONFIRM_TRANSFER_ALL_ITEMS_SUCCESS:
      return {
        ...state,
        confirmTransferResponse: action.payload
      };

    case BinToBinTransferActionTypes.CLEAR_CONFIRM_TRANSFER_RESPONSE:
      return {
        ...state,
        confirmTransferResponse: null
      };
    case BinToBinTransferActionTypes.CLEAR_SEARCHED_ITEMS:
      return {
        ...state,
        searchedItemList: itemAdapter.removeAll(state.searchedItemList),
        hasSearchedItems: false
      };

    case BinToBinTransferActionTypes.CLEAR_ITEMS:
      return {
        ...state,
        itemList: itemAdapter.removeAll(state.itemList),
        invalidItems: [],
        notInStock: []
      };

    case BinToBinTransferActionTypes.CLEAR_ITEMS_GROUPS:
      return {
        ...state,
        productGroups: itemListGroupAdapter.removeAll(state.productGroups),
        sourceBins: itemListGroupAdapter.removeAll(state.sourceBins),
        productCategory: itemListGroupAdapter.removeAll(state.productCategory),
        searchedItemListGroups: itemListGroupAdapter.removeAll(
          state.searchedItemListGroups
        )
      };

    case BinToBinTransferActionTypes.CLEAR_SELECTED_ITEM_GROUP:
      return {
        ...state,
        selectedItemListGroup: null
      };
  }

  switch (action.type) {
    case BinToBinTransferActionTypes.LOAD_BINS:
      return {
        ...state,
        isLoadingBins: true,
        bins: [],
        error: null
      };

    case BinToBinTransferActionTypes.LOAD_BINS_SUCCESS:
      return {
        ...state,
        bins: action.payload,
        isLoadingBins: false
      };

    case BinToBinTransferActionTypes.LOAD_BINS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingBins: false
      };

    case BinToBinTransferActionTypes.LOAD_PRODUCT_GROUP_OPTIONS:
      return {
        ...state,
        isLoadingProductGroupOptions: true,
        error: null
      };

    case BinToBinTransferActionTypes.LOAD_PRODUCT_GROUP_OPTIONS_SUCCESS:
      return {
        ...state,
        productGroupOptions: action.payload,
        isLoadingProductGroupOptions: false
      };

    case BinToBinTransferActionTypes.LOAD_PRODUCT_GROUP_OPTIONS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingProductGroupOptions: false
      };

    case BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY_OPTIONS:
      return {
        ...state,
        isLoadingProductCategoryOptions: true,
        error: null
      };

    case BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY_OPTIONS_SUCCESS:
      return {
        ...state,
        productCategoryOptions: action.payload,
        isLoadingProductCategoryOptions: false
      };

    case BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY_OPTIONS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingProductCategoryOptions: false
      };

    case BinToBinTransferActionTypes.LOAD_SOURCE_BIN_OPTIONS:
      return {
        ...state,
        isLoadingSoruceBinOptionsOptions: true,
        error: null
      };

    case BinToBinTransferActionTypes.LOAD_SOURCE_BIN_OPTIONS_SUCCESS:
      return {
        ...state,
        soruceBinOptions: action.payload,
        isLoadingSoruceBinOptionsOptions: false
      };

    case BinToBinTransferActionTypes.LOAD_SOURCE_BIN_OPTIONS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingSoruceBinOptionsOptions: false
      };

    case BinToBinTransferActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        studdedProductGroups: action.payload
      };

    case BinToBinTransferActionTypes.LOAD_BIN_TO_BIN_HISTORY:
      return {
        ...state,
        isLoadingHistory: true,
        error: null
      };
    case BinToBinTransferActionTypes.LOAD_BIN_TO_BIN_HISTORY_SUCCESS:
      return {
        ...state,
        binToBinHistory: binToBinTransferHistoryAdaptor.addMany(
          action.payload.items,
          state.binToBinHistory
        ),
        binToBinHistoryCount: action.payload.count,
        isLoadingHistory: false
      };
    case BinToBinTransferActionTypes.LOAD_BIN_TO_BIN_HISTORY_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingHistory: false
      };
    case BinToBinTransferActionTypes.RESET_LOADED_HISTORY:
      return {
        ...state,
        binToBinHistory: binToBinTransferHistoryAdaptor.removeAll(
          state.binToBinHistory
        ),
        binToBinHistoryCount: 0
      };

    case BinToBinTransferActionTypes.LOAD_SELECTED_HISTORY:
      return {
        ...state,
        isLoadingSelectedHistory: true,
        items: binToBinTransferHistoryAdaptor.removeAll(state.items),
        itemsTotalCount: 0,
        isLoadingItems: false,
        isLoadingItemsSuccess: null,
        selectedHistory: null,
        error: null,
        hasSelectedHistory: false
      };
    case BinToBinTransferActionTypes.LOAD_SELECTED_HISTORY_SUCCESS:
      return {
        ...state,
        selectedHistory: action.payload,
        isLoadingSelectedHistory: false,
        hasSelectedHistory: true
      };
    case BinToBinTransferActionTypes.LOAD_SELECTED_HISTORY_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingSelectedHistory: false,
        hasSelectedHistory: false
      };
    case BinToBinTransferActionTypes.LOAD_HISTORY_FILTER_DATA:
      return {
        ...state,
        advancedFilter: action.payload
      };
    case BinToBinTransferActionTypes.RESET_HISTORY_FILTER_DATA:
      return {
        ...state,
        advancedFilter: {
          startDate: moment(action.payload).startOf('day').valueOf(),
          endDate: moment(action.payload).endOf('day').valueOf(),
          fiscalYear: null
        }
      };
    // Image
    case BinToBinTransferActionTypes.LOAD_THUMBNAIL_IMAGE_URL:
      return {
        ...state,
        error: null,
        searchedItemList: itemAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              isLoadingThumbnailImage: true
            }
          },
          state.searchedItemList
        ),
        itemList: itemAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              isLoadingThumbnailImage: true
            }
          },
          state.itemList
        )
      };

    case BinToBinTransferActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS:
      return {
        ...state,
        searchedItemList: itemAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              thumbnailImageURL: action.payload.thumbnailImageUrl,
              isLoadingThumbnailImage: false
            }
          },
          state.searchedItemList
        ),
        itemList: itemAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              thumbnailImageURL: action.payload.thumbnailImageUrl,
              isLoadingThumbnailImage: false
            }
          },
          state.itemList
        )
      };

    case BinToBinTransferActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE:
      return {
        ...state,
        searchedItemList: itemAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              isLoadingThumbnailImage: false
            }
          },
          state.searchedItemList
        ),
        itemList: itemAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              isLoadingThumbnailImage: false
            }
          },
          state.itemList
        )
      };

    case BinToBinTransferActionTypes.LOAD_IMAGE_URL:
      if (action.payload?.isSearchedItem) {
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          searchedItemList: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingImage: true
              }
            },
            state.searchedItemList
          )
        };
      } else {
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          itemList: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingImage: true
              }
            },
            state.itemList
          )
        };
      }
    case BinToBinTransferActionTypes.LOAD_IMAGE_URL_SUCCESS:
    case BinToBinTransferActionTypes.LOAD_IMAGE_URL_FAILURE:
      if (action.payload?.isSearchedItem) {
        return {
          ...state,
          isLoadingImage: false,
          searchedItemList: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                imageURL: action.payload.imageUrl,
                isLoadingImage: false
              }
            },
            state.searchedItemList
          )
        };
      } else {
        return {
          ...state,
          isLoadingImage: false,
          itemList: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                imageURL: action.payload.imageUrl,
                isLoadingImage: false
              }
            },
            state.itemList
          )
        };
      }

    default:
      return state;
  }
}
