import { InStockAction, InStockActionTypes } from './in-stock.action';
import { InStockState } from './in-stock.state';

import * as moment from 'moment';
import { createFeatureSelector } from '@ngrx/store';
import { itemAdapter } from './in-stock.entity';

export const newBinRequesFeatureKey = 'requestApprovals';

export const selectNewBinRequestState = createFeatureSelector<InStockState>(
  newBinRequesFeatureKey
);

export const initialBoutiqueStatisticsState: InStockState = {
  binCodes: [],
  binRequestResponse: null,
  hasRequestedFailure: false,
  docNo: 0,
  error: null,
  loaded: false,
  isLoading: false,
  isBinCodeReset: false,
  isDocNoReset: false,
  binCodeCount: 0,
  isRequestedBinSuccess: false,
  isRequestingBin: false,

  binHistoryResponse: itemAdapter.getInitialState(),
  isHistoryLoading: false,
  binHistoryCount: 0,
  binHistoryError: null,
  searchBinHistory: itemAdapter.getInitialState(),
  isSearchHistoryLoading: false,
  searchHistoryError: null,
  advancedFilter: {
    startDate: null,
    endDate: null,
    reqFiscalYear: null,
    statuses: []
  }
};

export function InStockReducer(
  state: InStockState = initialBoutiqueStatisticsState,
  action: InStockAction
): InStockState {
  switch (action.type) {
    case InStockActionTypes.LOAD_BINCODES:
      return {
        ...state,
        isLoading: true,
        error: null,
        hasRequestedFailure: null
      };

    case InStockActionTypes.LOAD_BINCODES_SUCCESS:
      return {
        ...state,
        binCodes: action.payload,
        loaded: true,
        isLoading: false,
        error: null,
        hasRequestedFailure: null
      };

    case InStockActionTypes.LOAD_BINCODES_FAILURE:
      return {
        ...state,
        loaded: false,
        error: action.payload,
        isLoading: false
      };

    case InStockActionTypes.LOAD_BIN_HISTORY:
      return {
        ...state,
        isLoading: true,
        isHistoryLoading: true,
        error: null,
        binHistoryError: null
      };

    case InStockActionTypes.LOAD_BIN_HISTORY_SUCCESS:
      return {
        ...state,
        binHistoryResponse: itemAdapter.addMany(
          action.payload.items,
          state.binHistoryResponse
        ),
        binHistoryCount: action.payload.count,
        isHistoryLoading: false,
        isLoading: false,
        error: null,
        binHistoryError: null
      };

    case InStockActionTypes.LOAD_BIN_HISTORY_FAILURE:
      return {
        ...state,
        error: action.payload,
        binHistoryError: action.payload,
        isHistoryLoading: false,
        isLoading: false
      };

    case InStockActionTypes.RESET_BINHISTORY:
      return {
        ...state,
        isHistoryLoading: false,
        isLoading: false,
        binHistoryCount: 0,
        binHistoryResponse: itemAdapter.removeAll(state.binHistoryResponse),

        error: null,
        binHistoryError: null
      };

    case InStockActionTypes.RESET_BINCODES:
      return {
        ...state,
        binCodes: [],
        isBinCodeReset: true,
        error: null,
        hasRequestedFailure: null,
        isLoading: false
      };

    case InStockActionTypes.RESET_DOCUMENT_NO:
      return {
        ...state,
        docNo: null,
        binRequestResponse: null,
        isDocNoReset: true,
        error: null,
        hasRequestedFailure: null,
        isLoading: false
      };

    case InStockActionTypes.LOAD_COUNT:
      return {
        ...state,
        error: null,
        hasRequestedFailure: null
      };

    case InStockActionTypes.LOAD_COUNT_SUCCESS:
      return {
        ...state,
        binCodeCount: action.payload,
        error: null,
        hasRequestedFailure: null
      };

    case InStockActionTypes.LOAD_COUNT_FAILURE:
      return {
        ...state,
        error: action.payload
      };

    case InStockActionTypes.REQUESTED_BIN:
      return {
        ...state,
        isLoading: true,
        error: null,
        hasRequestedFailure: null,
        docNo: null,
        isRequestedBinSuccess: null,
        isRequestingBin: true
      };

    case InStockActionTypes.REQUESTED_BIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isRequestedBinSuccess: true,
        binRequestResponse: action.payload,
        docNo: null,
        isRequestingBin: false,
        error: null,
        hasRequestedFailure: null
      };

    case InStockActionTypes.REQUESTED_BIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        hasRequestedFailure: true,
        isRequestedBinSuccess: false,
        isRequestingBin: false
      };

    case InStockActionTypes.LOAD_HISTORY_FILTER_DATA:
      return {
        ...state,
        advancedFilter: action.payload
      };

    case InStockActionTypes.RESET_FILTER:
      return {
        ...state,
        advancedFilter: {
          startDate: moment(action.payload).startOf('day').valueOf(),
          endDate: moment(action.payload).endOf('day').valueOf(),
          reqFiscalYear: null,
          statuses: []
        }
      };

    default:
      return state;
  }
}
