import { AdvanceBookingState } from './advance-booking.state';
import {
  AdvanceBookingActions,
  AdvanceBookingActionTypes
} from './advance-booking.actions';
import {
  ABAdapter,
  ABRequestStatusListAdapter
} from './advance-booking.entity';

export const advanceBookingFeatureKey = 'advanceBooking';

export const initialState: AdvanceBookingState = {
  hasError: null,
  requestStausDropDownValues: {
    status: 'APPROVED',
    type: 'CANCEL_ADVANCE_BOOKING'
  },
  isLoading: false,
  searchProductList: [],
  status: null,
  searchProductListCount: -1,
  ABRequestStatusList: ABRequestStatusListAdapter.getInitialState(),
  ABRequestStatusListCount: 0,
  productDetailsCount: -1,
  orderNumber: { order: 0, status: null },

  RSODetails: [],
  validateProductAndPriceDetails: null,
  searhABResponse: ABAdapter.getInitialState(),
  taxDetails: null,
  createCashMemoResponse: null,
  viewCashMemoResponse: null,
  partialUpdateCashMemoResponse: null,
  updateCashMemoResponse: null,
  deleteCashMemoResponse: false,
  deleteItemFromCashMemoResponse: null,
  selectedData: null,
  searchValues: { function: null, doNo: null, fiscalYear: null, phNo: null },
  selectedLotNumber: null,
  freezeAdvanceBookingResponse: null,
  minABvalue: 0,
  frozenABOrderAmount: 0,

  frozenABOrder: false,
  bestRateABOrder: false,
  searhABResponseCount: 0,
  uploadFileResponse: false,
  uploadFileListResponse: [],
  downloadFileUrl: null,
  searchABDetails: {
    isABSearchDone: false,
    searchABResponseCount: -1
  },
  isMetalRateValidated: null
};

export function advanceBookingReducer(
  state: AdvanceBookingState = initialState,
  action: AdvanceBookingActions
): AdvanceBookingState {
  switch (action.type) {
    case AdvanceBookingActionTypes.CREATE_CASH_MEMO:
    case AdvanceBookingActionTypes.VIEW_CASH_MEMO:
    case AdvanceBookingActionTypes.LOAD_REQUESTS:
    case AdvanceBookingActionTypes.FREEZE_ADVANCE_BOOKING:
    case AdvanceBookingActionTypes.PARTIAL_UPDATE_CASH_MEMO:
    case AdvanceBookingActionTypes.UPDATE_CASH_MEMO:
    case AdvanceBookingActionTypes.LOAD_WORKFLOW_DETAILS:

    case AdvanceBookingActionTypes.DELETE_CASH_MEMO:
    case AdvanceBookingActionTypes.UPDATE_PRICE_DETAILS:
      return { ...state, isLoading: true, hasError: null };

    case AdvanceBookingActionTypes.FILE_UPLOAD:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        uploadFileResponse: false
      };

    case AdvanceBookingActionTypes.FILE_UPLOAD_LIST:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        uploadFileListResponse: []
      };

    case AdvanceBookingActionTypes.FILE_DOWNLOAD_URL:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        downloadFileUrl: null
      };

    case AdvanceBookingActionTypes.CREATE_CASH_MEMO_FAILURE:
    case AdvanceBookingActionTypes.LOAD_REQUESTS_FAILURE:
    case AdvanceBookingActionTypes.VIEW_CASH_MEMO_FAILURE:
    case AdvanceBookingActionTypes.SEARCH_AB_FAILURE:
    case AdvanceBookingActionTypes.LOAD_WORKFLOW_DETAILS_FAILURE:
    case AdvanceBookingActionTypes.FREEZE_ADVANCE_BOOKING_FAILURE:
    case AdvanceBookingActionTypes.UPDATE_CASH_MEMO_FAILURE:
    case AdvanceBookingActionTypes.DELETE_CASH_MEMO_FAILURE:
    case AdvanceBookingActionTypes.UPDATE_PRICE_DETAILS_FAILURE:
    case AdvanceBookingActionTypes.FILE_UPLOAD_FAILURE:
    case AdvanceBookingActionTypes.FILE_UPLOAD_LIST_FAILURE:
    case AdvanceBookingActionTypes.FILE_DOWNLOAD_URL_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case AdvanceBookingActionTypes.SEARCH_AB:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        searhABResponse: ABAdapter.getInitialState(),
        searhABResponseCount: 0,
        searchABDetails: {
          isABSearchDone: false,
          searchABResponseCount: -1
        }
      };

    case AdvanceBookingActionTypes.LOAD_WORKFLOW_DETAILS_SUCCESS:
    case AdvanceBookingActionTypes.LOAD_SELECTED:
      return {
        ...state,
        selectedData: action.payload,
        hasError: null,
        isLoading: false
      };

    case AdvanceBookingActionTypes.CREATE_CASH_MEMO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        createCashMemoResponse: action.payload
      };
    case AdvanceBookingActionTypes.SEARCH_AB_SUCCESS:
      return {
        ...state,
        isLoading: false,
        searhABResponse: ABAdapter.addMany(
          action.payload.ABList,
          state.searhABResponse
        ),
        searhABResponseCount: action.payload.totalElements,
        searchABDetails: {
          isABSearchDone: true,
          searchABResponseCount: action.payload.totalElements
        }
      };

    case AdvanceBookingActionTypes.SET_DROPDOWN_VALUE:
      return {
        ...state,
        requestStausDropDownValues: action.payload
      };

    case AdvanceBookingActionTypes.SET_ORDER_NUMBER:
      return {
        ...state,
        orderNumber: { order: action.payload, status: action.status }
      };

    case AdvanceBookingActionTypes.SET_SEARCH_VALUES:
      return {
        ...state,
        searchValues: action.payload
      };

    case AdvanceBookingActionTypes.VIEW_CASH_MEMO_SUCCESS:
    case AdvanceBookingActionTypes.UPDATE_PRICE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        viewCashMemoResponse: action.payload,
        minABvalue: action.payload.minValue,
        frozenABOrder: action.payload.isFrozenRate,
        frozenABOrderAmount: action.payload.isFrozenAmount,
        bestRateABOrder: action.payload.isBestRate,
        status: action.payload.status
      };
    case AdvanceBookingActionTypes.FREEZE_ADVANCE_BOOKING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        freezeAdvanceBookingResponse: action.payload,
        minABvalue: action.payload.minValue,
        frozenABOrder: action.payload.isFrozenRate,
        frozenABOrderAmount: action.payload.isFrozenAmount,
        bestRateABOrder: action.payload.isBestRate,
        status: action.payload.status
      };

    case AdvanceBookingActionTypes.PARTIAL_UPDATE_CASH_MEMO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        partialUpdateCashMemoResponse: action.payload,
        minABvalue: action.payload.minValue,
        frozenABOrderAmount: action.payload.isFrozenAmount,
        frozenABOrder: action.payload.isFrozenRate,
        bestRateABOrder: action.payload.isBestRate,
        status: action.payload.status
      };

    case AdvanceBookingActionTypes.PARTIAL_UPDATE_CASH_MEMO_FAILURE: {
      return {
        ...state,
        hasError: action.payload.error,
        partialUpdateCashMemoResponse: {
          ...action.payload.oldData,
          hasError: true
        },
        isLoading: false
      };
    }

    case AdvanceBookingActionTypes.UPDATE_CASH_MEMO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        updateCashMemoResponse: action.payload
      };

    case AdvanceBookingActionTypes.DELETE_CASH_MEMO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        deleteCashMemoResponse: action.payload,
        minABvalue: 0,
        frozenABOrder: false,
        frozenABOrderAmount: 0,
        bestRateABOrder: false
      };

    case AdvanceBookingActionTypes.LOAD_SELECTED_LOTNUMBER_DETAILS:
      return {
        ...state,
        selectedLotNumber: action.payload
      };

    case AdvanceBookingActionTypes.RESET_SEARCH_VALUES: {
      return {
        ...state,
        hasError: null,

        isLoading: false,
        searhABResponse: ABAdapter.removeAll(state.searhABResponse),
        searhABResponseCount: 0
      };
    }

    case AdvanceBookingActionTypes.RESET_VALUES:
      return {
        ...state,
        hasError: null,

        isLoading: false,
        searchProductList: [],
        searchProductListCount: -1,
        ABRequestStatusList: ABRequestStatusListAdapter.removeAll(
          state.ABRequestStatusList
        ),
        orderNumber: { order: 0, status: null },
        ABRequestStatusListCount: 0,
        productDetailsCount: -1,
        RSODetails: [],
        validateProductAndPriceDetails: null,
        taxDetails: null,
        createCashMemoResponse: null,
        viewCashMemoResponse: null,
        partialUpdateCashMemoResponse: null,
        searhABResponse: ABAdapter.removeAll(state.searhABResponse),
        searhABResponseCount: 0,
        freezeAdvanceBookingResponse: null,
        minABvalue: 0,
        status: null,
        frozenABOrderAmount: 0,

        frozenABOrder: false,
        bestRateABOrder: false,
        updateCashMemoResponse: null,
        deleteCashMemoResponse: false,
        deleteItemFromCashMemoResponse: null,

        selectedLotNumber: null,
        uploadFileResponse: false,
        uploadFileListResponse: [],
        downloadFileUrl: null,
        searchABDetails: {
          isABSearchDone: false,
          searchABResponseCount: -1
        }
      };

    case AdvanceBookingActionTypes.RESET_LOTNUMBER_VALUES:
      return {
        ...state,
        selectedLotNumber: null
      };

    case AdvanceBookingActionTypes.RESET_PRODUCT_VALUES:
      return {
        ...state,
        hasError: null,
        isLoading: false,
        searchProductList: [],
        searchProductListCount: -1,
        productDetailsCount: -1,
        validateProductAndPriceDetails: null,
        taxDetails: null,
        deleteItemFromCashMemoResponse: null,

        selectedLotNumber: null
      };

    case AdvanceBookingActionTypes.CLEAR_SEARCH_PRODUCT_LIST:
      return {
        ...state,
        searchProductList: null,
        searchProductListCount: 0,
        isLoading: false
      };

    case AdvanceBookingActionTypes.LOAD_REQUESTS_SUCCESS:
      return {
        ...state,
        isLoading: false,

        ABRequestStatusList: ABRequestStatusListAdapter.addMany(
          action.payload.results,
          state.ABRequestStatusList
        ),
        ABRequestStatusListCount: action.payload.totalElements,
        hasError: null
      };

    case AdvanceBookingActionTypes.CLEAR_PRODUCT_DETAILS:
      return {
        ...state
      };

    case AdvanceBookingActionTypes.CLEAR_PRODUCT_RELATED_DETAILS:
      return {
        ...state,
        hasError: null,
        isLoading: false,
        searchProductList: [],
        searchProductListCount: -1,
        productDetailsCount: -1,
        validateProductAndPriceDetails: null,
        taxDetails: null,
        deleteItemFromCashMemoResponse: null,

        selectedLotNumber: null
      };

    case AdvanceBookingActionTypes.CLEAR_SEARCH_LIST:
      return {
        ...state,
        ABRequestStatusList: ABRequestStatusListAdapter.removeAll(
          state.ABRequestStatusList
        ),
        ABRequestStatusListCount: 0
      };

    case AdvanceBookingActionTypes.FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        uploadFileResponse: action.payload,
        hasError: null,
        isLoading: false
      };

    case AdvanceBookingActionTypes.FILE_UPLOAD_LIST_SUCCESS:
      return {
        ...state,
        uploadFileListResponse: action.payload,
        hasError: null,
        isLoading: false
      };

    case AdvanceBookingActionTypes.FILE_DOWNLOAD_URL_SUCCESS:
      return {
        ...state,
        downloadFileUrl: action.payload,
        hasError: null,
        isLoading: false
      };
      
    case AdvanceBookingActionTypes.VALIDATE_METAL_RATE:
      return {
        ...state,
        isLoading: true,
        isMetalRateValidated: null
      };

    case AdvanceBookingActionTypes.VALIDATE_METAL_RATE_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case AdvanceBookingActionTypes.VALIDATE_METAL_RATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isMetalRateValidated: true
      };

    case AdvanceBookingActionTypes.RESET_SEARCH_AB_DETAILS:
      return {
        ...state,
        searchABDetails: {
          isABSearchDone: false,
          searchABResponseCount: -1
        }
      };

    default:
      return state;
  }
}
