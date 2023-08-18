import { createFeatureSelector } from '@ngrx/store';
import { CNSearchEnum } from '@poss-web/shared/models';
import { CreditNoteActions, CreditNoteActionTypes } from './cn.actions';
import { sentRequestAdaptor, transferedCNsAdaptor } from './cn.entity';
import { CreditNoteState } from './cn.state';

export const initialState: CreditNoteState = {
  error: null,
  isLoading: false,
  creditNoteSearchResult: [],
  creditNoteDetails: null,
  requestNo: null,
  search: {
    cnNumber: '',
    mobileNumber: '',
    fiscalYear: '',
    startDate: null,
    endDate: null,
    isUnipayCN: false
  },
  sentRequests: sentRequestAdaptor.getInitialState(),
  searchRequests: sentRequestAdaptor.getInitialState(),
  count: 0,
  hasSearched: false,
  request: null,
  cnNumber: null,
  requestType: CNSearchEnum.REMOVE_GOLD_RATE,
  transferToEghs: null,
  transferedCNs: transferedCNsAdaptor.getInitialState(),
  downloadCN: false,
  totalCount: 0,
  hasCancelled: false,
  totalElements: 0,
  transferedCN: null,
  refundAmountDetails: null
};
export const CREDIT_NOTE_FEATURE_KEY = 'cnRemovalGoldRate';
export const selectCreditNoteState = createFeatureSelector<CreditNoteState>(
  CREDIT_NOTE_FEATURE_KEY
);
export function CreditNoteReducer(
  state: CreditNoteState = initialState,
  action: CreditNoteActions
): CreditNoteState {
  switch (action.type) {
    case CreditNoteActionTypes.CREDIT_NOTE_DETAILS_BY_ID:
    case CreditNoteActionTypes.RAISE_REQUEST:
    case CreditNoteActionTypes.LOAD_REQUEST_BY_ID:
    case CreditNoteActionTypes.TRANSFER_TO_EGHS:
    case CreditNoteActionTypes.DOWNLOAD_CN:
    case CreditNoteActionTypes.SEARCH_CREDIT_NOTES:
    case CreditNoteActionTypes.LOAD_SENT_REQUESTS:
      return {
        ...state,
        isLoading: true,
        error: null,
        searchRequests: sentRequestAdaptor.getInitialState()
        //count: 0
      };
    case CreditNoteActionTypes.LOAD_TRANSFERED_CNS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case CreditNoteActionTypes.SEARCH_CREDIT_NOTES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        creditNoteSearchResult: action.payload.searchResult,
        totalElements: action.payload.count
      };
    case CreditNoteActionTypes.CREDIT_NOTE_DETAILS_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        creditNoteDetails: action.payload
      };
    case CreditNoteActionTypes.RAISE_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        requestNo: action.payload
      };

    case CreditNoteActionTypes.CREDIT_NOTE_DETAILS_BY_ID_FAILURE:
    case CreditNoteActionTypes.RAISE_REQUEST_FAILURE:
    case CreditNoteActionTypes.LOAD_SENT_REQUESTS_FAILURE:
    case CreditNoteActionTypes.LOAD_REQUEST_BY_ID_FAILURE:
    case CreditNoteActionTypes.CONFIGRM_REQUEST_TYPE_FAILURE:
    case CreditNoteActionTypes.TRANSFER_TO_EGHS_FAILURE:
    case CreditNoteActionTypes.LOAD_TRANSFERED_CNS_FAILURE:
    case CreditNoteActionTypes.SEARCH_CREDIT_NOTES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case CreditNoteActionTypes.DOWNLOAD_CN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        downloadCN: false
      };

    case CreditNoteActionTypes.RESET_LIST_PAGE:
      return {
        ...state,
        error: null,
        isLoading: false,
        creditNoteSearchResult: [],
        creditNoteDetails: null,
        requestNo: null,
        search: {
          cnNumber: '',
          mobileNumber: '',
          fiscalYear: '',
          startDate: null,
          endDate: null,
          isUnipayCN: false
        },
        sentRequests: sentRequestAdaptor.getInitialState(),
        searchRequests: sentRequestAdaptor.getInitialState(),
        transferedCNs: transferedCNsAdaptor.getInitialState(),
        count: 0,
        hasSearched: false,
        requestType: CNSearchEnum.REMOVE_GOLD_RATE,
        hasCancelled: false,
        totalElements: 0
      };

    case CreditNoteActionTypes.CLEAR_SEARCH_LIST:
      return {
        ...state,
        creditNoteSearchResult: []
      };

    case CreditNoteActionTypes.RESET_DETAILS_PAGE:
      return {
        ...state,
        isLoading: false,
        creditNoteDetails: null,
        requestNo: null,
        error: null,
        request: null,
        cnNumber: null,
        transferToEghs: null,
        downloadCN: null,
        hasCancelled: false
      };
    case CreditNoteActionTypes.RESET_REQUESTS:
      return {
        ...state,
        isLoading: false,
        sentRequests: sentRequestAdaptor.removeAll(state.sentRequests),
        searchRequests: sentRequestAdaptor.removeAll(state.searchRequests),
        transferedCNs: transferedCNsAdaptor.removeAll(state.transferedCNs),
        error: null,
        hasCancelled: false,
        hasSearched: false
      };
    case CreditNoteActionTypes.STORE_SEARCH:
      return {
        ...state,
        search: {
          cnNumber: action.payload.cnNumber,
          mobileNumber: action.payload.mobileNumber,
          fiscalYear: action.payload.fiscalYear,
          startDate: action.payload.startDate,
          endDate: action.payload.endDate,
          isUnipayCN: action.payload.isUnipayCN
        }
      };
    case CreditNoteActionTypes.LOAD_SENT_REQUESTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSearched: false,
        sentRequests: sentRequestAdaptor.addMany(
          action.payload.requestSentResponse,
          state.sentRequests
        ),
        count: action.payload.count
      };
    case CreditNoteActionTypes.SEARCH_REQUEST:
      return {
        ...state,
        isLoading: true,
        hasSearched: false,
        searchRequests: sentRequestAdaptor.removeAll(state.searchRequests),
        sentRequests: sentRequestAdaptor.removeAll(state.sentRequests),
        error: null
      };

    case CreditNoteActionTypes.SEARCH_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSearched: true,
        searchRequests: sentRequestAdaptor.setAll(
          action.payload.requestSentResponse,
          state.searchRequests
        ),
        count: action.payload.requestSentResponse.length,
        error: null
      };

    case CreditNoteActionTypes.SEARCH_REQUEST_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasSearched: false,
        error: action.payload
      };
    case CreditNoteActionTypes.LOAD_REQUEST_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        request: action.payload
      };
    case CreditNoteActionTypes.CONFIGRM_REQUEST_TYPE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cnNumber: action.payload
      };
    case CreditNoteActionTypes.TRANSFER_TO_EGHS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        transferToEghs: action.payload
      };
    case CreditNoteActionTypes.STORE_REQUEST_TYPE:
      return {
        ...state,
        requestType: action.payload
      };
    case CreditNoteActionTypes.LOAD_TRANSFERED_CNS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        transferedCNs: transferedCNsAdaptor.addMany(
          action.payload.transferedCNs,
          state.transferedCNs
        ),
        totalCount: action.payload.totalCount
      };

    case CreditNoteActionTypes.DOWNLOAD_CN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        downloadCN: true
      };

    case CreditNoteActionTypes.RESET_SEARCH:
      return {
        ...state,
        searchRequests: sentRequestAdaptor.removeAll(state.searchRequests),
        error: null,
        hasCancelled: false,
        isLoading: false
      };

    case CreditNoteActionTypes.CANCEL_REQUEST:
      return {
        ...state,
        isLoading: true,
        hasCancelled: false,
        error: null
      };
    case CreditNoteActionTypes.CANCEL_REQUEST_SUCCESS:
      return {
        ...state,
        hasCancelled: true,
        isLoading: false
      };
    case CreditNoteActionTypes.CANCEL_REQUEST_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasCancelled: false,
        error: action.payload
      };
    case CreditNoteActionTypes.SEARCH_TRANSFERED_CNS:
      return {
        ...state,
        isLoading: true,
        error: null,
        transferedCN: null,
        hasSearched: false
      };
    case CreditNoteActionTypes.SEARCH_TRANSFERED_CNS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSearched: true,
        transferedCN: action.payload.searchResult,
        totalCount: action.payload.count
      };
    case CreditNoteActionTypes.SEARCH_TRANSFERED_CNS_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasSearched: true,
        error: action.payload
      };
    case CreditNoteActionTypes.RESET_ERROR:
      return {
        ...state,
        error: null
      };
    case CreditNoteActionTypes.CALCULATE_CN_REFUND_AMOUNT:
      return {
        ...state,
        isLoading: true,
        error: null,
        refundAmountDetails: null
      };
    case CreditNoteActionTypes.CALCULATE_CN_REFUND_AMOUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        refundAmountDetails: action.payload
      };
    case CreditNoteActionTypes.CALCULATE_CN_REFUND_AMOUNT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        refundAmountDetails: null
      };
    case CreditNoteActionTypes.CANCEL_AUTO_APPROVED_CN:
    case CreditNoteActionTypes.CANCEL_REQUEST_APPROVED_CN:
    case CreditNoteActionTypes.CONFIGRM_REQUEST_TYPE:
      return {
        ...state,
        isLoading: true,
        error: null,
        cnNumber: null
      };
    case CreditNoteActionTypes.CANCEL_AUTO_APPROVED_CN_SUCCESS:
    case CreditNoteActionTypes.CANCEL_REQUEST_APPROVED_CN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        cnNumber: action.payload
      };
    case CreditNoteActionTypes.CANCEL_AUTO_APPROVED_CN_FAILURE:
    case CreditNoteActionTypes.CANCEL_REQUEST_APPROVED_CN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        cnNumber: null
      };
    default: {
      return state;
    }
  }
}
