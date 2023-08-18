import { createFeatureSelector } from '@ngrx/store';
import { CreditNoteTransferState } from './cn-transfer.state';
import {
  CreditNoteTransferActions,
  CreditNotetransferActionTypes
} from './cn-transfer.actions';
import { requestsAdaptor } from './cn-transfer.entity';

export const initialState: CreditNoteTransferState = {
  locationCodes: [],
  error: null,
  isLoading: false,
  creditNoteSearchResult: [],
  searchCount: 0,
  creditNoteDetails: null,
  raisedRequestNo: null,
  raisedRequests: requestsAdaptor.getInitialState(),
  requestsCount: 0,
  hasCnUpdateRequestStatus: null,
  creditNoteUpdateResponse: null,
  isApprovedOrRejected: false,
  isTransferRequestCancelled: false,
  legacyOutwardTransferResponsePayload: null,
  legacyInwardTransferResponsePayload: null
};
export const CREDIT_NOTE_TRANSFER_FEATURE_KEY = 'cnTransfer';
export const selectCreditNoteTransferState = createFeatureSelector<
  CreditNoteTransferState
>(CREDIT_NOTE_TRANSFER_FEATURE_KEY);
export function CreditNoteTransferReducer(
  state: CreditNoteTransferState = initialState,
  action: CreditNoteTransferActions
): CreditNoteTransferState {
  switch (action.type) {
    case CreditNotetransferActionTypes.GET_LOCATION_CODES:
      return { ...state, isLoading: true, error: null };
    case CreditNotetransferActionTypes.GET_LOCATION_CODES_SUCCESS:
      return {
        ...state,
        locationCodes: action.payload,
        error: null,
        isLoading: false
      };
    case CreditNotetransferActionTypes.GET_LOCATION_CODES_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case CreditNotetransferActionTypes.GET_LEGACY_LOCATION_CODES:
      return { ...state, isLoading: true, error: null };
    case CreditNotetransferActionTypes.GET_LEGACY_LOCATION_CODES_SUCCESS:
      return {
        ...state,
        locationCodes: action.payload,
        error: null,
        isLoading: false
      };
    case CreditNotetransferActionTypes.GET_LEGACY_LOCATION_CODES_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case CreditNotetransferActionTypes.SEARCH_CREDIT_NOTES:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case CreditNotetransferActionTypes.SEARCH_CREDIT_NOTES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        creditNoteSearchResult: action.payload.result,
        searchCount: action.payload.totalCount
      };

    case CreditNotetransferActionTypes.SEARCH_CREDIT_NOTES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case CreditNotetransferActionTypes.GET_CREDIT_NOTE_DETAILS_BY_ID:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case CreditNotetransferActionTypes.GET_CREDIT_NOTE_DETAILS_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        creditNoteDetails: action.payload
      };
    case CreditNotetransferActionTypes.GET_CREDIT_NOTE_DETAILS_BY_ID_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case CreditNotetransferActionTypes.RAISE_TRANSFER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case CreditNotetransferActionTypes.RAISE_TRANSFER_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        raisedRequestNo: action.payload.requestNo
      };
    case CreditNotetransferActionTypes.RAISE_TRANSFER_REQUEST_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case CreditNotetransferActionTypes.LEGACY_CN_OUTWARD_TRANSFER:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case CreditNotetransferActionTypes.LEGACY_CN_OUTWARD_TRANSFER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        legacyOutwardTransferResponsePayload: action.payload
      };
    case CreditNotetransferActionTypes.LEGACY_CN_OUTWARD_TRANSFER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case CreditNotetransferActionTypes.LEGACY_CN_INWARD_TRANSFER:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case CreditNotetransferActionTypes.LEGACY_CN_INWARD_TRANSFER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        legacyInwardTransferResponsePayload: action.payload
      };
    case CreditNotetransferActionTypes.LEGACY_CN_INWARD_TRANSFER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case CreditNotetransferActionTypes.LOAD_TRANSFER_REQUESTS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case CreditNotetransferActionTypes.LOAD_TRANSFER_REQUESTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        raisedRequests: requestsAdaptor.addMany(
          action.payload.results,
          state.raisedRequests
        ),
        requestsCount: action.payload.count
      };
    case CreditNotetransferActionTypes.LOAD_TRANSFER_REQUESTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case CreditNotetransferActionTypes.INWARD_CN:
      return {
        ...state,
        isLoading: true,
        hasCnUpdateRequestStatus: null,
        creditNoteUpdateResponse: null,
        error: null
      };
    case CreditNotetransferActionTypes.INWARD_CN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasCnUpdateRequestStatus: true,
        creditNoteUpdateResponse: action.payload
      };
    case CreditNotetransferActionTypes.INWARD_CN_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasCnUpdateRequestStatus: false,
        error: action.payload
      };
    case CreditNotetransferActionTypes.APPROVE_OR_REJECT_CN_TRANSFER:
      return {
        ...state,
        isApprovedOrRejected: false,
        error: null
      };
    case CreditNotetransferActionTypes.APPROVE_OR_REJECT_CN_TRANSFER_SUCCESS:
      return {
        ...state,
        isApprovedOrRejected: action.payload
      };
    case CreditNotetransferActionTypes.APPROVE_OR_REJECT_CN_TRANSFER_FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case CreditNotetransferActionTypes.CANCEL_CN_TRANSFER_REQUEST:
      return {
        ...state,
        isLoading: true,
        isTransferRequestCancelled: false,
        error: null
      };
    case CreditNotetransferActionTypes.CANCEL_CN_TRANSFER_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isTransferRequestCancelled: true
      };
    case CreditNotetransferActionTypes.CANCEL_CN_TRANSFER_REQUEST_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case CreditNotetransferActionTypes.RESET_LIST_PAGE:
      return {
        ...state,
        raisedRequests: requestsAdaptor.removeAll(state.raisedRequests),
        requestsCount: 0,
        error: null
      };
    case CreditNotetransferActionTypes.RESET_SEARCH:
      return {
        ...state,
        creditNoteSearchResult: [],
        searchCount: 0,
        legacyInwardTransferResponsePayload: null,
        legacyOutwardTransferResponsePayload: null,
        error: null,
      };
    case CreditNotetransferActionTypes.RESET_CN_TRANSFER_DETAILS:
      return {
        ...state,
        locationCodes: [],
        error: null,
        creditNoteSearchResult: [],
        searchCount: 0,
        creditNoteDetails: null,
        raisedRequestNo: null,
        raisedRequests: requestsAdaptor.getInitialState(),
        requestsCount: 0,
        hasCnUpdateRequestStatus: null,
        creditNoteUpdateResponse: null,
        isApprovedOrRejected: false,
        isTransferRequestCancelled: false
      };
    default: {
      return state;
    }
  }
}
