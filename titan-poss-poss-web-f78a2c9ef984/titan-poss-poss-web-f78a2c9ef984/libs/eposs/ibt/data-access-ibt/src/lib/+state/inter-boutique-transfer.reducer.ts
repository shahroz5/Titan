import {
  InterBoutiqueTransferActions,
  InterBoutiqueTransferActionTypes
} from './inter-boutique-transfer.actions';
import { InterBoutiqueTransferState } from './inter-boutique-transfer.state';
import {
  requestListAdapter,
  itemListAdapter,
  boutiqueListAdapter,
  IBTHistoryAdaptor
} from './inter-boutique-transfer.entity';
import {
  RequestList,
  ItemList,
} from '@poss-web/shared/models';
import { createFeatureSelector } from '@ngrx/store';
import * as moment from 'moment';

export const ibtFeatureKey = 'interBoutiqueTransfer';

export const selectInterBoutiqueTransferState = createFeatureSelector<
  InterBoutiqueTransferState
>(ibtFeatureKey);

export const initialState: InterBoutiqueTransferState = {
  requestSentList: requestListAdapter.getInitialState(),
  requestReceivedList: requestListAdapter.getInitialState(),
  requestSentListCount: 0,
  requestReceivedListCount: 0,
  boutiqueList: boutiqueListAdapter.getInitialState(),
  boutiqueListCount: -1,
  createRequestResponse: {} as RequestList,
  request: {} as RequestList,
  itemList: itemListAdapter.getInitialState(),
  updateItemListResponse: {} as ItemList,
  updateItemListStatusResponse: {} as RequestList,
  searchItemResponse: {
    searchResult: null,
    isSearchSuccess: false
  },
  hasError: null,
  isLoading: false,

  IBThistory: IBTHistoryAdaptor.getInitialState(),
  isLoadingHistory: false,
  ibtHistoryCount: 0,

  isLoadingSelectedHistory: false,
  hasSelectedHistory: false,
  selectedHistory: null,
  items: IBTHistoryAdaptor.getInitialState(),
  advancedFilter: {
    startDate: null,
    endDate: null,
    reqFiscalYear: null,
    locationCode: null,
    statuses: [],
    dateType: null
  },
  historyType: null,
  studdedProductGroups: [],
  isLoadingImage: false
};

export function interBoutiqueTransferReducer(
  state: InterBoutiqueTransferState = initialState,
  action: InterBoutiqueTransferActions
): InterBoutiqueTransferState {
  switch (action.type) {
    case InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST:
    case InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST:
    case InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST_COUNT:
    case InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST_COUNT:
    case InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST:
    case InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST_COUNT:
    case InterBoutiqueTransferActionTypes.CREATE_REQUEST:
    case InterBoutiqueTransferActionTypes.LOAD_REQUEST:
    case InterBoutiqueTransferActionTypes.LOAD_ITEM_LIST:
    case InterBoutiqueTransferActionTypes.LOAD_HISTORY_ITEMS:
    case InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST:
    case InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST_STATUS:
    case InterBoutiqueTransferActionTypes.SEARCH_ITEM:
      return { ...state, isLoading: true, hasError: null };

    case InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST_FAILURE:
    case InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST_FAILURE:
    case InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST_COUNT_FAILURE:
    case InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST_COUNT_FAILURE:
    case InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST_FAILURE:
    case InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST_COUNT_FAILURE:
    case InterBoutiqueTransferActionTypes.CREATE_REQUEST_FAILURE:
    case InterBoutiqueTransferActionTypes.LOAD_REQUEST_FAILURE:
    case InterBoutiqueTransferActionTypes.LOAD_ITEM_LIST_FAILURE:
    case InterBoutiqueTransferActionTypes.LOAD_HISTORY_ITEMS_FAILURE:
    case InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST_FAILURE:
    case InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST_STATUS_FAILURE:
    case InterBoutiqueTransferActionTypes.SEARCH_ITEM_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };
  }
  switch (action.type) {
    case InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST_SUCCESS:
      return {
        ...state,
        requestSentList: requestListAdapter.addMany(
          action.payload,
          state.requestSentList
        ),
        isLoading: false,
        hasError: null
      };

    case InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST_SUCCESS:
      return {
        ...state,
        requestReceivedList: requestListAdapter.addMany(
          action.payload,
          state.requestReceivedList
        ),
        isLoading: false,
        hasError: null
      };

    case InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST_COUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        requestSentListCount: action.payload
      };

    case InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST_COUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        requestReceivedListCount: action.payload
      };

    case InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST_SUCCESS:
      return {
        ...state,
        boutiqueList: boutiqueListAdapter.addMany(
          action.payload,
          state.boutiqueList
        ),
        isLoading: false,
        hasError: null
      };

    case InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST_COUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        boutiqueListCount: action.payload
      };

    case InterBoutiqueTransferActionTypes.CREATE_REQUEST_SUCCESS:
      return {
        ...state,
        createRequestResponse: action.payload,
        isLoading: false,
        hasError: null
      };

    case InterBoutiqueTransferActionTypes.LOAD_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        request: action.payload
      };

    case InterBoutiqueTransferActionTypes.LOAD_ITEM_LIST_SUCCESS:
    case InterBoutiqueTransferActionTypes.LOAD_HISTORY_ITEMS_SUCCESS:
      return {
        ...state,
        itemList: itemListAdapter.setAll(action.payload, state.itemList),
        isLoading: false,
        hasError: null
      };

    case InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST_SUCCESS:
      return {
        ...state,
        updateItemListResponse: action.payload,
        isLoading: false,
        hasError: null
      };

    case InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST_STATUS_SUCCESS:
      return {
        ...state,
        updateItemListStatusResponse: action.payload,
        requestReceivedList: requestListAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              status: action.payload.status
            }
          },
          state.requestReceivedList
        ),
        isLoading: false,
        hasError: null
      };

    case InterBoutiqueTransferActionTypes.SEARCH_ITEM_SUCCESS:
      return {
        ...state,
        searchItemResponse: {
          searchResult: action.payload,
          isSearchSuccess: true
        },
        isLoading: false,
        hasError: null
      };

    case InterBoutiqueTransferActionTypes.CLEAR_REQUEST_SENT_LIST:
      return {
        ...state,
        requestSentList: requestListAdapter.removeAll(state.requestSentList),
        isLoading: false
      };

    case InterBoutiqueTransferActionTypes.CLEAR_REQUEST_RECEIVED_LIST:
      return {
        ...state,
        requestReceivedList: requestListAdapter.removeAll(
          state.requestReceivedList
        ),
        isLoading: false
      };

    case InterBoutiqueTransferActionTypes.CLEAR_ITEM_LIST:
      return {
        ...state,
        itemList: itemListAdapter.removeAll(state.itemList)
      };

    case InterBoutiqueTransferActionTypes.CLEAR_BOUTIQUE_LIST:
      return {
        ...state,
        boutiqueList: boutiqueListAdapter.removeAll(state.boutiqueList),
        boutiqueListCount: -1
      };

    case InterBoutiqueTransferActionTypes.RESET_BOUTIQUE_LIST_COUNT:
      return {
        ...state,
        boutiqueListCount: -1
      };

    case InterBoutiqueTransferActionTypes.CLEAR_SEARCH_ITEM_RESPONSE:
      return {
        ...state,
        searchItemResponse: {
          searchResult: null,
          isSearchSuccess: false
        }
      };
  }
  switch (action.type) {
    case InterBoutiqueTransferActionTypes.RESET_REQUEST_LIST:
      return {
        ...state,
        requestSentList: requestListAdapter.removeAll(state.requestSentList),
        requestReceivedList: requestListAdapter.removeAll(
          state.requestReceivedList
        ),
        requestSentListCount: 0,
        requestReceivedListCount: 0,
        boutiqueList: boutiqueListAdapter.removeAll(state.boutiqueList),
        boutiqueListCount: -1,
        createRequestResponse: null,
        itemList: itemListAdapter.removeAll(state.itemList),
        request: null,
        updateItemListResponse: null,
        updateItemListStatusResponse: null,
        searchItemResponse: {
          searchResult: null,
          isSearchSuccess: false
        },
        hasError: null,
        isLoading: false
      };
    case InterBoutiqueTransferActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        studdedProductGroups: action.payload
      };

    case InterBoutiqueTransferActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE:
      return {
        ...state,
        hasError: action.payload
      };
    case InterBoutiqueTransferActionTypes.LOAD_IBT_HISTORY:
      return {
        ...state,
        isLoadingHistory: true,
        hasError: null
      };
    case InterBoutiqueTransferActionTypes.LOAD_IBT_HISTORY_SUCCESS:
      return {
        ...state,
        IBThistory: IBTHistoryAdaptor.addMany(
          action.payload.items,
          state.IBThistory
        ),
        ibtHistoryCount: action.payload.count,
        isLoadingHistory: false
      };
    case InterBoutiqueTransferActionTypes.LOAD_IBT_HISTORY_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoadingHistory: false
      };
    case InterBoutiqueTransferActionTypes.RESET_LOADED_HISTORY:
      return {
        ...state,
        IBThistory: IBTHistoryAdaptor.removeAll(state.IBThistory),
        ibtHistoryCount: 0
      };

    case InterBoutiqueTransferActionTypes.LOAD_SELECTED_HISTORY:
      return {
        ...state,
        isLoadingSelectedHistory: true,
        items: IBTHistoryAdaptor.removeAll(state.items),
        isLoading: false,
        selectedHistory: null,
        hasError: null,
        hasSelectedHistory: false
      };
    case InterBoutiqueTransferActionTypes.LOAD_SELECTED_HISTORY_SUCCESS:
      return {
        ...state,
        selectedHistory: action.payload,
        isLoadingSelectedHistory: false,
        hasSelectedHistory: true
      };
    case InterBoutiqueTransferActionTypes.LOAD_SELECTED_HISTORY_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoadingSelectedHistory: false,
        hasSelectedHistory: false
      };
    case InterBoutiqueTransferActionTypes.LOAD_HISTORY_FILTER_DATA:
      return {
        ...state,
        advancedFilter: action.payload
      };

    case InterBoutiqueTransferActionTypes.RADIO_HISTORY_TYPE:
      return {
        ...state,
        historyType: action.payload
      };
    case InterBoutiqueTransferActionTypes.RESET_HISTORY_FILTER_DATA:
      return {
        ...state,
        advancedFilter: {
          startDate: moment(action.payload).startOf('day').valueOf(),
          endDate: moment(action.payload).endOf('day').valueOf(),
          reqFiscalYear: null,
          locationCode: null,
          statuses: [],
          dateType: null
        }
      };
  
    // Image
    case InterBoutiqueTransferActionTypes.LOAD_THUMBNAIL_IMAGE_URL:
      return {
        ...state,
        hasError: null,
        itemList: itemListAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              isLoadingThumbnailImage: true
            }
          },
          state.itemList
        )
      };
    case InterBoutiqueTransferActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS:
      return {
        ...state,
        itemList: itemListAdapter.updateOne(
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

    case InterBoutiqueTransferActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE:
      return {
        ...state,
        itemList: itemListAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              isLoadingThumbnailImage: false
            }
          },
          state.itemList
        )
      };

    case InterBoutiqueTransferActionTypes.LOAD_IMAGE_URL:
      return {
        ...state,
        hasError: null,
        isLoadingImage: true,
        itemList: itemListAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              isLoadingImage: true
            }
          },
          state.itemList
        )
      };
    case InterBoutiqueTransferActionTypes.LOAD_IMAGE_URL_SUCCESS:
    case InterBoutiqueTransferActionTypes.LOAD_IMAGE_URL_FAILURE:
      return {
        ...state,
        isLoadingImage: false,
        itemList: itemListAdapter.updateOne(
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
  return state;
}
