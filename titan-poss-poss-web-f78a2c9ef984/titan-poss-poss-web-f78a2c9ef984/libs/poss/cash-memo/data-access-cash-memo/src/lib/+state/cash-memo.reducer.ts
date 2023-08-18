import { CashMemoState } from './cash-memo.state';
import { CashMemoActions, CashMemoActionTypes } from './cash-memo.actions';
import { itemDetailsAdapter } from './cash-memo.entity';

export const cashMemoFeatureKey = 'cashMemo';

export const initialState: CashMemoState = {
  hasError: null,
  isLoading: false,
  createCashMemoResponse: null,
  viewCashMemoResponse: null,
  partialUpdateCashMemoResponse: null,
  isIGST: null,
  updateCashMemoResponse: null,
  updatePriceDetailsResponse: null,
  deleteCashMemoResponse: false,
  invokeOrderDetailsResponse: null,
  isABInvoked: false,
  cashMemoHistory: [],
  cashMemoHistoryTotalElements: null,
  isHistoryDetailsLoading: null,
  productDetails: itemDetailsAdapter.getInitialState(),
  historySearchParameter: null,
  setFocus: 0,
  materialPrices: [],
  uploadFileResponse: false,
  uploadFileListResponse: [],
  downloadFileUrl: null,
  tcsDetails: null,
  isMetalRateValidated: null
};

export function cashMemoReducer(
  state: CashMemoState = initialState,
  action: CashMemoActions
): CashMemoState {
  switch (action.type) {
    case CashMemoActionTypes.CREATE_CASH_MEMO:
    case CashMemoActionTypes.VIEW_CASH_MEMO:
    case CashMemoActionTypes.UPDATE_CASH_MEMO:
    case CashMemoActionTypes.DELETE_CASH_MEMO:
    case CashMemoActionTypes.UPDATE_PRICE_DETAILS:
    case CashMemoActionTypes.INVOKE_ORDER_DETAILS:
    case CashMemoActionTypes.LOAD_ITEM_FROM_CASH_MEMO_HISTORY:
    case CashMemoActionTypes.GET_MATERIAL_PRICES:
      return { ...state, isLoading: true, hasError: null };

    case CashMemoActionTypes.FILE_UPLOAD:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        uploadFileResponse: false
      };

    case CashMemoActionTypes.FILE_UPLOAD_LIST:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        uploadFileListResponse: []
      };

    case CashMemoActionTypes.FILE_DOWNLOAD_URL:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        downloadFileUrl: null
      };

    case CashMemoActionTypes.CREATE_CASH_MEMO_FAILURE:
    case CashMemoActionTypes.VIEW_CASH_MEMO_FAILURE:
    case CashMemoActionTypes.UPDATE_CASH_MEMO_FAILURE:
    case CashMemoActionTypes.DELETE_CASH_MEMO_FAILURE:
    case CashMemoActionTypes.UPDATE_PRICE_DETAILS_FAILURE:
    case CashMemoActionTypes.INVOKE_ORDER_DETAILS_FAILURE:
    case CashMemoActionTypes.LOAD_ITEM_FROM_CASH_MEMO_HISTORY_FAILURE:
    case CashMemoActionTypes.FILE_UPLOAD_FAILURE:
    case CashMemoActionTypes.FILE_UPLOAD_LIST_FAILURE:
    case CashMemoActionTypes.FILE_DOWNLOAD_URL_FAILURE:
    case CashMemoActionTypes.LOAD_TCS_DETAIL_FAILURE:
    case CashMemoActionTypes.VALIDATE_METAL_RATE_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case CashMemoActionTypes.GET_MATERIAL_PRICES_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        materialPrices: [],
        isLoading: false
      };

    case CashMemoActionTypes.LOAD_ITEM_FROM_CASH_MEMO_HISTORY_SUCCESS:
      return {
        ...state,
        productDetails: itemDetailsAdapter.addMany(
          [action.payload],
          state.productDetails
        ),
        hasError: null,
        isLoading: false
      };
    case CashMemoActionTypes.CREATE_CASH_MEMO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        createCashMemoResponse: action.payload
      };

    case CashMemoActionTypes.VIEW_CASH_MEMO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        viewCashMemoResponse: action.payload
      };
    case CashMemoActionTypes.PARTIAL_UPDATE_CASH_MEMO:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        isIGST: null
      };
    case CashMemoActionTypes.PARTIAL_UPDATE_CASH_MEMO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        partialUpdateCashMemoResponse: action.payload
      };
    case CashMemoActionTypes.PARTIAL_UPDATE_CASH_MEMO_FAILURE:
      return {
        ...state,
        hasError: action.payload.error,
        isLoading: false,
        isIGST:
          action.payload?.isIGST && action.payload.isIGST !== null
            ? !action.payload.isIGST
            : null,
        partialUpdateCashMemoResponse: {
          ...action.payload.oldData,
          hasError: true
        }
      };

    case CashMemoActionTypes.UPDATE_CASH_MEMO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        updateCashMemoResponse: action.payload
      };

    case CashMemoActionTypes.UPDATE_PRICE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        updatePriceDetailsResponse: action.payload
      };

    case CashMemoActionTypes.DELETE_CASH_MEMO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        deleteCashMemoResponse: action.payload
      };

    case CashMemoActionTypes.INVOKE_ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        invokeOrderDetailsResponse: action.payload
      };

    case CashMemoActionTypes.LOAD_CASH_MEMO_HISTORY:
      return {
        ...state,
        isHistoryDetailsLoading: true
      };
    case CashMemoActionTypes.LOAD_CASH_MEMO_HISTORY_SUCCESS:
      return {
        ...state,
        isHistoryDetailsLoading: false,
        cashMemoHistory: action.payload.cashMemoHistoryDetails,
        cashMemoHistoryTotalElements: action.payload.totalElements
      };
    case CashMemoActionTypes.LOAD_CASH_MEMO_HISTORY_FAILURE:
      return {
        ...state,
        isHistoryDetailsLoading: null,
        hasError: action.payload
      };
    case CashMemoActionTypes.RESET_VALUES:
      return {
        ...state,
        hasError: null,
        isLoading: false,
        createCashMemoResponse: null,
        viewCashMemoResponse: null,
        partialUpdateCashMemoResponse: null,
        isIGST: null,
        updateCashMemoResponse: null,
        updatePriceDetailsResponse: null,
        isMetalRateValidated: null,
        deleteCashMemoResponse: false,
        invokeOrderDetailsResponse: null,
        isABInvoked: false,
        materialPrices: [],
        uploadFileResponse: false,
        uploadFileListResponse: [],
        downloadFileUrl: null,

        isHistoryDetailsLoading: null,
        tcsDetails: null,
        setFocus: 0,
        productDetails: itemDetailsAdapter.removeAll(state.productDetails)
      };

    case CashMemoActionTypes.SET_AB_INVOKED:
      return {
        ...state,
        isABInvoked: action.payload
      };

    case CashMemoActionTypes.RESET_HISTORY:
      return {
        ...state,
        cashMemoHistoryTotalElements: null,
        cashMemoHistory: [],
        historySearchParameter: null
      };
    case CashMemoActionTypes.UPDATE_HISTORY_SEARCH_PARAMETER:
      return {
        ...state,
        historySearchParameter: action.payload
      };

    case CashMemoActionTypes.GET_MATERIAL_PRICES_SUCCESS:
      return {
        ...state,
        materialPrices: action.payload,
        hasError: null,
        isLoading: false
      };

    case CashMemoActionTypes.FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        uploadFileResponse: action.payload,
        hasError: null,
        isLoading: false
      };

    case CashMemoActionTypes.FILE_UPLOAD_LIST_SUCCESS:
      return {
        ...state,
        uploadFileListResponse: action.payload,
        hasError: null,
        isLoading: false
      };

    case CashMemoActionTypes.FILE_DOWNLOAD_URL_SUCCESS:
      return {
        ...state,
        downloadFileUrl: action.payload,
        hasError: null,
        isLoading: false
      };

    case CashMemoActionTypes.LOAD_TCS_DETAIL:
      return {
        ...state,
        isLoading: true,
        tcsDetails: null
      };

    case CashMemoActionTypes.LOAD_TCS_DETAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        tcsDetails: action.payload
      };

    case CashMemoActionTypes.VALIDATE_METAL_RATE:
      return {
        ...state,
        isLoading: true,
        isMetalRateValidated: null
      };

    case CashMemoActionTypes.VALIDATE_METAL_RATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isMetalRateValidated: true
      };

    case CashMemoActionTypes.SET_FOCUS:
      return {
        ...state,
        setFocus: action.payload
      };

    default:
      return state;
  }
}
