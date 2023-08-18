import { createFeatureSelector } from '@ngrx/store';
import * as moment from 'moment';
import { ConversionActions, ConversionActionTypes } from './conversion.actions';
import {
  conversionRequestAdaptor,
  conversionRequestHistoryAdaptor,
  itemAdapter
} from './conversion.entity';
import { ConversionState } from './conversion.state';

export const conversionFeatureKey = 'conversion';
export const selectConversionState = createFeatureSelector<ConversionState>(
  conversionFeatureKey
);

export const initialState: ConversionState = {
  searchedItemsList: [],
  isSearchingItems: false,
  hasSearchedItems: null,

  selectedVarient: itemAdapter.getInitialState(),
  hasselectedVarient: false,

  conversionItems: null,
  isLoadingConversionItems: false,
  hasConversionItems: null,

  ItemSplitResponse: null,
  isSplitting: null,
  isSplitted: null,

  conversionRequestResponse: null,
  isSendingRequest: false,
  hasRequestResponse: null,

  conversionRequests: conversionRequestAdaptor.getInitialState(),
  isLoadingRequests: false,

  conversionRequestsCount: 0,
  isLoadingCount: false,

  searchedConversionRequests: conversionRequestAdaptor.getInitialState(),
  isSearchingRequests: false,
  hasSearchedConversionRequests: null,

  selectedRequest: null,
  isLoadingSelectedRequest: false,

  selectedRequestData: [],
  isLoadingSelectedRequestData: false,

  rsoDetails: [],
  isLoadingRsoDetails: false,
  hasRsoDetails: false,

  binCodes: [],
  isLoading: false,
  hasBinCodes: false,
  studdedProductGroups: [],
  error: null,
  conversionHistory: conversionRequestHistoryAdaptor.getInitialState(),
  isLoadingRequestSentHistory: null,
  totalElements: null,
  isLoadingHistory: false,
  selectedRequestHistory: null,
  conversionHistoryItems: null,
  historyItemsCount: 0,
  requestType: 'requestSent',
  advancedFilter: {
    requestFromDate: moment().startOf('day').valueOf(),
    requestToDate: moment().endOf('day').valueOf(),
    docNo: null,
    fiscalYear: null,
    statuses: []
  },
  isLoadingImage: false,
  standardMetalPriceDetails: null,
  priceDetails: []
};
export function ConversionReducer(
  state: ConversionState = initialState,
  action: ConversionActions
): ConversionState {
  switch (action.type) {
    case ConversionActionTypes.LOAD_SEARCH_VARIENT:
      return {
        ...state,
        isSearchingItems: true,
        hasSearchedItems: null,
        conversionItems: null,
        error: null
      };
    case ConversionActionTypes.LOAD_SEARCH_VARIENT_SUCCESS:
      return {
        ...state,
        searchedItemsList: action.payload,
        isSearchingItems: false,
        hasSearchedItems: true
      };
    case ConversionActionTypes.LOAD_SEARCH_VARIENT_FAILURE:
      return {
        ...state,
        isSearchingItems: false,
        hasSearchedItems: false,
        error: action.payload
      };
    case ConversionActionTypes.CLEAR_VARIENT_SEARCH_LIST:
      return {
        ...state,
        hasSearchedItems: false,
        searchedItemsList: []
      };
    case ConversionActionTypes.ADD_TO_SELECTED_VARIENT:
      return {
        ...state,
        selectedVarient: itemAdapter.addOne(
          action.payload,
          state.selectedVarient
        ),
        hasselectedVarient: true
      };
    case ConversionActionTypes.REMOVE_FROM_SELECTED_VARIENT:
      return {
        ...state,
        selectedVarient: itemAdapter.removeAll(state.selectedVarient),
        hasselectedVarient: false
      };
    case ConversionActionTypes.LOAD_CONVERSION_ITEMS:
      return {
        ...state,
        isLoadingConversionItems: true,
        conversionItems: null,
        error: null
      };
    case ConversionActionTypes.LOAD_CONVERSION_ITEMS_SUCCESS:
      return {
        ...state,
        isLoadingConversionItems: false,
        hasConversionItems: true,
        conversionItems: action.payload
      };
    case ConversionActionTypes.LOAD_CONVERSION_ITEMS_FAILURE:
      return {
        ...state,
        isLoadingConversionItems: false,
        hasConversionItems: false,
        error: action.payload
      };
    case ConversionActionTypes.CLEAR_LOADED_CONVERSION_ITEMS:
      return {
        ...state,
        hasConversionItems: false,
        conversionRequests: conversionRequestAdaptor.getInitialState(),
        priceDetails: []
      };
    case ConversionActionTypes.SPLIT_ITEM:
    case ConversionActionTypes.CONFIRM_CONVERSION:
      return {
        ...state,
        ItemSplitResponse: null,
        isSplitting: true,
        isSplitted: null,
        error: null
      };
    case ConversionActionTypes.SPLIT_ITEM_SUCCESS:
    case ConversionActionTypes.CONFIRM_CONVERSION_SUCCESS:
      return {
        ...state,
        ItemSplitResponse: action.payload,
        isSplitting: false,
        isSplitted: true
      };
    case ConversionActionTypes.SPLIT_ITEM_FAILURE:
    case ConversionActionTypes.CONFIRM_CONVERSION_FAILURE:
      return {
        ...state,
        isSplitting: false,
        isSplitted: false,
        error: action.payload
      };
    case ConversionActionTypes.SEND_CONVERSION_REQUEST:
      return {
        ...state,
        error: null,
        isSendingRequest: true
      };
    case ConversionActionTypes.SEND_CONVERSION_REQUEST_SUCCESS:
      return {
        ...state,
        isSendingRequest: false,
        conversionRequestResponse: action.payload,
        hasRequestResponse: true
      };
    case ConversionActionTypes.SEND_CONVERSION_REQUEST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isSendingRequest: false,
        hasRequestResponse: false
      };
  }
  switch (action.type) {
    case ConversionActionTypes.LOAD_REQUESTS_COUNT:
      return {
        ...state,
        isLoadingCount: true,
        error: null
      };
    case ConversionActionTypes.LOAD_REQUESTS_COUNT_SUCCESS:
      return {
        ...state,
        conversionRequestsCount: action.payload,
        isLoadingCount: false
      };
    case ConversionActionTypes.LOAD_REQUESTS_COUNT_FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case ConversionActionTypes.LOAD_CONVERSION_REQUESTS:
      return {
        ...state,
        isLoadingRequests: true,
        error: null
      };
    case ConversionActionTypes.LOAD_CONVERSION_REQUESTS_SUCCESS:
      return {
        ...state,
        isLoadingRequests: false,
        conversionRequests: conversionRequestAdaptor.addMany(
          action.payload.conversionRequestsList,
          state.conversionRequests
        ),
        conversionRequestsCount: action.payload.count
      };
    case ConversionActionTypes.LOAD_CONVERSION_REQUESTS_FAILURE:
      return {
        ...state,
        isLoadingRequests: false,
        error: action.payload
      };
    case ConversionActionTypes.SEARCH_CONVERSION_REQUESTS:
      return {
        ...state,
        isSearchingRequests: true,
        error: null
      };
    case ConversionActionTypes.SEARCH_CONVERSION_REQUESTS_SUCCESS:
      return {
        ...state,
        isSearchingRequests: false,
        hasSearchedConversionRequests: true,
        searchedConversionRequests: conversionRequestAdaptor.setAll(
          action.payload,
          state.searchedConversionRequests
        )
      };
    case ConversionActionTypes.SEARCH_CONVERSION_REQUESTS_FAILURE:
      return {
        ...state,
        isSearchingRequests: false,
        hasSearchedConversionRequests: false,
        error: action.payload
      };
    case ConversionActionTypes.SEARCH_CLEAR:
      return {
        ...state,
        isSearchingRequests: false,
        hasSearchedConversionRequests: true,
        isLoadingRequests: false,
        searchedConversionRequests: conversionRequestAdaptor.removeAll(
          state.searchedConversionRequests
        ),
        conversionRequests: conversionRequestAdaptor.removeAll(
          state.conversionRequests
        )
      };
    case ConversionActionTypes.LOAD_SELECTED_REQUEST:
      return {
        ...state,
        isLoadingSelectedRequest: true,
        selectedRequest: null,
        error: null
      };
    case ConversionActionTypes.LOAD_SELECTED_REQUEST_SUCCESS:
      return {
        ...state,
        selectedRequest: action.payload,
        isLoadingSelectedRequest: false
      };
    case ConversionActionTypes.LOAD_SELECTED_REQUEST_FAILURE:
      return {
        ...state,
        isLoadingSelectedRequest: false,
        error: action.payload
      };
    case ConversionActionTypes.LOAD_SELECTED_REQUEST_DATA:
      return {
        ...state,
        isLoadingSelectedRequestData: true,
        selectedRequestData: [],
        error: null
      };
    case ConversionActionTypes.LOAD_SELECTED_REQUEST_DATA_SUCCESS:
      return {
        ...state,
        isLoadingSelectedRequestData: false,
        selectedRequestData: action.payload
      };
    case ConversionActionTypes.LOAD_SELECTED_REQUEST_DATA_FAILURE:
      return {
        ...state,
        isLoadingSelectedRequestData: false,
        error: action.payload
      };
  }
  switch (action.type) {
    case ConversionActionTypes.LOAD_RSO_DETAILS:
      return {
        ...state,
        rsoDetails: [],
        isLoadingRsoDetails: true,
        error: null
      };
    case ConversionActionTypes.LOAD_RSO_DETAILS_SUCCESS:
      return {
        ...state,
        rsoDetails: action.payload,
        isLoadingRsoDetails: false,
        hasRsoDetails: true
      };
    case ConversionActionTypes.LOAD_RSO_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingRsoDetails: false
      };

    case ConversionActionTypes.LOAD_BINCODES:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case ConversionActionTypes.LOAD_BINCODES_SUCCESS:
      return {
        ...state,
        binCodes: action.payload,
        isLoading: false,
        hasBinCodes: true
      };
    case ConversionActionTypes.LOAD_BINCODES_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case ConversionActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        studdedProductGroups: action.payload
      };

    case ConversionActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE:
      return {
        ...state,
        error: action.payload
      };

    case ConversionActionTypes.LOAD_REQUEST_SENT_HISTORY:
    case ConversionActionTypes.LOAD_CONVERSION_HISTORY_ITEMS:
    case ConversionActionTypes.LOAD_CONVERTED_TRANSACTION_HISTORY:
      return {
        ...state,
        isLoadingHistory: true,
        error: null
      };
    case ConversionActionTypes.LOAD_SELECTED_REQUEST_HISTORY:
      return {
        ...state,
        isLoadingHistory: true,
        selectedRequestHistory: null,
        error: null
      };
    case ConversionActionTypes.LOAD_REQUEST_SENT_HISTORY_SUCCESS:
    case ConversionActionTypes.LOAD_CONVERTED_TRANSACTION_HISTORY_SUCCESS:
      return {
        ...state,
        isLoadingHistory: false,
        conversionHistory: conversionRequestHistoryAdaptor.addMany(
          action.payload.requestSentHistory,
          state.conversionHistory
        ),
        totalElements: action.payload.count
      };
    case ConversionActionTypes.LOAD_REQUEST_SENT_HISTORY_FAILURE:
    case ConversionActionTypes.LOAD_CONVERTED_TRANSACTION_HISTORY_FAILURE:
    case ConversionActionTypes.LOAD_SELECTED_REQUEST_HISTORY_FAILURE:
    case ConversionActionTypes.LOAD_CONVERSION_HISTORY_ITEMS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoadingHistory: false
      };
    case ConversionActionTypes.LOAD_SELECTED_REQUEST_HISTORY_SUCCESS:
      return {
        ...state,
        isLoadingHistory: false,
        selectedRequestHistory: action.payload
      };
    case ConversionActionTypes.LOAD_CONVERSION_HISTORY_ITEMS_SUCCESS:
      return {
        ...state,
        isLoadingHistory: false,
        conversionHistoryItems: action.payload.items,
        historyItemsCount: action.payload.count
      };
    case ConversionActionTypes.RESET_ERROR:
      return {
        ...state,
        error: null
      };
    case ConversionActionTypes.RESET_SELECTED_REQUEST_DATA:
      return {
        ...state,
        selectedRequestData: []
      };
    case ConversionActionTypes.STORE_REQUEST_TYPE:
      return {
        ...state,
        requestType: action.payload
      };
    case ConversionActionTypes.STORE_ADVANCED_FILTER:
      return {
        ...state,
        advancedFilter: action.payload
      };
    case ConversionActionTypes.RESET_ADVANCE_FILTER:
      return {
        ...state,
        advancedFilter: {
          requestFromDate: moment().startOf('day').valueOf(),
          requestToDate: moment().endOf('day').valueOf(),
          fiscalYear: null,
          statuses: [],
          docNo: null
        }
      };
    case ConversionActionTypes.RESET_CONVERSION_HISTORY:
      return {
        ...state,
        conversionHistory: conversionRequestHistoryAdaptor.removeAll(
          state.conversionHistory
        ),
        totalElements: 0,
        conversionHistoryItems: null,
        historyItemsCount: 0
      };

    // Image For Search By variant
    case ConversionActionTypes.LOAD_SEARCH_VARIANT_THUMBNAIL_IMAGE_URL:
      if(action.payload?.isChildItems){
        return {
          ...state,
          error: null,
          conversionItems:
            {
              ...state.conversionItems,
              childItems: state.conversionItems.childItems.map(item => (
                item?.itemCode === action.payload?.itemCode
                  ? {
                    ...item,
                    isLoadingThumbnailImage: true
                  }
                  : item
              ))
            }
        };
      }
      else{
        return {
          ...state,
          error: null,
          searchedItemsList: state.searchedItemsList.map(item => (
            item.id === action.payload.id
              ? {
                ...item,
                isLoadingThumbnailImage: true
              }
              : item
          )),
          selectedVarient: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: true
              }
            },
            state.selectedVarient
          )
        };
      }
    case ConversionActionTypes.LOAD_SEARCH_VARIANT_THUMBNAIL_IMAGE_URL_SUCCESS:
      if(action.payload?.isChildItems){
        return {
          ...state,
          conversionItems:
            {
              ...state.conversionItems,
              childItems: state.conversionItems.childItems.map(item => (
                item?.itemCode === action.payload?.itemCode
                  ? {
                    ...item,
                    thumbnailImageURL: action.payload.thumbnailImageUrl,
                    isLoadingThumbnailImage: false
                  }
                  : item
              ))
            }
        };
      }else{
        return {
          ...state,
          searchedItemsList: state.searchedItemsList.map(item => (
            item.id === action.payload.id
              ? {
                ...item,
                thumbnailImageURL: action.payload.thumbnailImageUrl,
                isLoadingThumbnailImage: false
              }
              : item
          )),
          selectedVarient: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                thumbnailImageURL: action.payload.thumbnailImageUrl,
                isLoadingThumbnailImage: false
              }
            },
            state.selectedVarient
          )
        };
      }
    case ConversionActionTypes.LOAD_SEARCH_VARIANT_THUMBNAIL_IMAGE_URL_FAILURE:
      if(action.payload?.isChildItems){
        return {
          ...state,
          conversionItems:
            {
              ...state.conversionItems,
              childItems: state.conversionItems.childItems.map(item => (
                item?.itemCode === action.payload?.itemCode
                  ? {
                    ...item,
                    isLoadingThumbnailImage: false
                  }
                  : item
              ))
            }
        };
      }else{
        return {
          ...state,
          searchedItemsList: state.searchedItemsList.map(item => (
            item.id === action.payload.id
              ? {
                ...item,
                isLoadingThumbnailImage: false
              }
              : item
          )),
          selectedVarient: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingThumbnailImage: false
              }
            },
            state.selectedVarient
          )
        };
      }

    case ConversionActionTypes.LOAD_SEARCH_VARIANT_IMAGE_URL:
      if(action.payload?.isSearchedItem){
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          searchedItemsList: state.searchedItemsList.map(item => (
            item.id === action.payload.id
              ? {
                ...item,
                isLoadingImage: true
              }
              : item
          )),
        };
      }else if(action.payload?.isChildItems){
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          conversionItems:
            {
              ...state.conversionItems,
              childItems: state.conversionItems.childItems.map(item => (
                item?.itemCode === action.payload?.itemCode
                  ? {
                    ...item,
                    isLoadingImage: true
                  }
                  : item
              ))
            }
        };
      }else{
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          selectedVarient: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                isLoadingImage: true
              }
            },
            state.selectedVarient
          )
        };
      }
    case ConversionActionTypes.LOAD_SEARCH_VARIANT_IMAGE_URL_SUCCESS:
    case ConversionActionTypes.LOAD_SEARCH_VARIANT_IMAGE_URL_FAILURE:
      if(action.payload?.isSearchedItem){
        return {
          ...state,
          isLoadingImage: false,
          searchedItemsList: state.searchedItemsList.map(item => (
            item.id === action.payload.id
              ? {
                ...item,
                imageURL: action.payload.imageUrl,
                isLoadingImage: false
              }
              : item
          ))
        };
      }else if(action.payload?.isChildItems){
        return {
          ...state,
          isLoadingImage: false,
          conversionItems:
            {
              ...state.conversionItems,
              childItems: state.conversionItems.childItems.map(item => (
                item?.itemCode === action.payload?.itemCode
                  ? {
                    ...item,
                    imageURL: action.payload.imageUrl,
                    isLoadingImage: false
                  }
                  : item
              ))
            }
        };
      }else{
        return {
          ...state,
          isLoadingImage: false,
          selectedVarient: itemAdapter.updateOne(
            {
              id: action.payload.id,
              changes: {
                imageURL: action.payload.imageUrl,
                isLoadingImage: false
              }
            },
            state.selectedVarient
          )
        };
      }

    // Image For Request Sent
    case ConversionActionTypes.LOAD_REQUEST_THUMBNAIL_IMAGE_URL:
      if(action.payload?.isChildItems){
        return {
          ...state,
          error: null,
          selectedRequest: {
            ...state.selectedRequest,
            otherDetails: state.selectedRequest?.otherDetails.map(item => (
              item?.inventoryId === action.payload.id
                ? {
                  ...item,
                  isLoadingThumbnailImage: true
                }
                : item
            ))
          }
        };
      }else{
        return {
          ...state,
          error: null,
          selectedRequestData: state.selectedRequestData.map(item => (
            item.inventoryId === action.payload.id
              ? {
                ...item,
                isLoadingThumbnailImage: true
              }
              : item
          ))
        };
      }
    case ConversionActionTypes.LOAD_REQUEST_THUMBNAIL_IMAGE_URL_SUCCESS:
      if(action.payload?.isChildItems){
        return {
          ...state,
          selectedRequest: {
            ...state.selectedRequest,
            otherDetails: state.selectedRequest?.otherDetails.map(item => (
              item?.inventoryId === action.payload.id
                ? {
                  ...item,
                  thumbnailImageURL: action.payload.thumbnailImageUrl,
                  isLoadingThumbnailImage: false
                }
                : item
            ))
          }
        };
      }else{
        return {
          ...state,
          selectedRequestData: state.selectedRequestData.map(item => (
            item?.inventoryId === action.payload.id
              ? {
                ...item,
                thumbnailImageURL: action.payload.thumbnailImageUrl,
                isLoadingThumbnailImage: false
              }
              : item
          ))
        };
      }
    case ConversionActionTypes.LOAD_REQUEST_THUMBNAIL_IMAGE_URL_FAILURE:
      if(action.payload?.isChildItems){
        return {
          ...state,
          selectedRequest: {
            ...state.selectedRequest,
            otherDetails: state.selectedRequest?.otherDetails.map(item => (
              item?.inventoryId === action.payload.id
                ? {
                  ...item,
                  isLoadingThumbnailImage: false
                }
                : item
            ))
          }
        };
      }else{
        return {
          ...state,
          selectedRequestData: state.selectedRequestData.map(item => (
            item?.inventoryId === action.payload.id
              ? {
                ...item,
                isLoadingThumbnailImage: false
              }
              : item
          ))
        };
      }

    case ConversionActionTypes.LOAD_REQUEST_IMAGE_URL:
      if(action.payload?.isChildItems){
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          selectedRequest: {
            ...state.selectedRequest,
            otherDetails: state.selectedRequest?.otherDetails.map(item => (
              item?.inventoryId === action.payload.id
                ? {
                  ...item,
                  isLoadingImage: true
                }
                : item
            ))
          }
        };
      }else{
        return {
          ...state,
          error: null,
          isLoadingImage: true,
          selectedRequestData: state.selectedRequestData.map(item => (
            item.inventoryId === action.payload.id
              ? {
                ...item,
                isLoadingImage: true
              }
              : item
          ))
        };
      }
    case ConversionActionTypes.LOAD_REQUEST_IMAGE_URL_SUCCESS:
    case ConversionActionTypes.LOAD_REQUEST_IMAGE_URL_FAILURE:
      if(action.payload?.isChildItems){
        return {
          ...state,
          isLoadingImage: false,
          selectedRequest: {
            ...state.selectedRequest,
            otherDetails: state.selectedRequest?.otherDetails.map(item => (
              item?.inventoryId === action.payload.id
                ? {
                  ...item,
                  imageURL: action.payload.imageUrl,
                  isLoadingImage: false
                }
                : item
            ))
          }
        };
      }else{
        return {
          ...state,
          isLoadingImage: false,
          selectedRequestData: state.selectedRequestData.map(item => (
            item.inventoryId === action.payload.id
              ? {
                ...item,
                imageURL: action.payload.imageUrl,
                isLoadingImage: false
              }
              : item
          ))
        };
      }

    // Image For History
    case ConversionActionTypes.LOAD_HISTORY_THUMBNAIL_IMAGE_URL:
      return {
        ...state,
        error: null,
        conversionHistoryItems: state.conversionHistoryItems.map(item => (
          item.id === action.payload.id
            ? {
              ...item,
              isLoadingThumbnailImage: true
            }
            : item
        ))
      };
    case ConversionActionTypes.LOAD_HISTORY_THUMBNAIL_IMAGE_URL_SUCCESS:
      return {
        ...state,
        conversionHistoryItems: state.conversionHistoryItems.map(item => (
          item.id === action.payload.id
            ? {
              ...item,
              thumbnailImageURL: action.payload.thumbnailImageUrl,
              isLoadingThumbnailImage: false
            }
            : item
        ))
      };

    case ConversionActionTypes.LOAD_HISTORY_THUMBNAIL_IMAGE_URL_FAILURE:
      return {
        ...state,
        conversionHistoryItems: state.conversionHistoryItems.map(item => (
          item.id === action.payload.id
            ? {
              ...item,
              isLoadingThumbnailImage: false
            }
            : item
        ))
      };

    case ConversionActionTypes.LOAD_HISTORY_IMAGE_URL:
      return {
        ...state,
        error: null,
        isLoadingImage: true,
        conversionHistoryItems: state.conversionHistoryItems.map(item => (
          item.id === action.payload.id
            ? {
              ...item,
              isLoadingImage: true
            }
            : item
        ))
      };
    case ConversionActionTypes.LOAD_HISTORY_IMAGE_URL_SUCCESS:
    case ConversionActionTypes.LOAD_HISTORY_IMAGE_URL_FAILURE:
      return {
        ...state,
        isLoadingImage: false,
        conversionHistoryItems: state.conversionHistoryItems.map(item => (
          item.id === action.payload.id
            ? {
              ...item,
              imageURL: action.payload.imageUrl,
              isLoadingImage: false
            }
            : item
        ))
      };
    case ConversionActionTypes.LOAD_STANDARD_METAL_PRICE_DETAILS:
      return {
        ...state,
        isLoading: true
      };
    case ConversionActionTypes.LOAD_STANDARD_METAL_PRICE_DETAILS_SUCCESS:
      return {
        ...state,
        standardMetalPriceDetails: action.payload,
        isLoading: false
      };
    case ConversionActionTypes.LOAD_STANDARD_METAL_PRICE_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case ConversionActionTypes.LOAD_PRICE_DETAILS:
      return {
        ...state,
        isLoading: true,
        error: null,
        priceDetails: null,
      };
    case ConversionActionTypes.LOAD_PRICE_DETAILS_SUCCESS:
      return {
        ...state,
        priceDetails: action.payload,
        error: null,
        isLoading: false
      };
    case ConversionActionTypes.LOAD_PRICE_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
  }
  return state;
}
