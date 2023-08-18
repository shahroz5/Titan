import { createFeatureSelector } from '@ngrx/store';
import { CtGrfActionTypes, CtGrfActions } from './grf.actions';
import { creditNoteAdaptor } from './grf.entity';
import { CtGrfState } from './grf.state';

export const ctGrfFeatureKey = 'grf';

export const selectCtGrfState = createFeatureSelector<CtGrfState>(
  ctGrfFeatureKey
);

export const initialState: CtGrfState = {
  errors: null,
  isLoading: false,
  selectedRsoName: null,
  totalAmt: 0,
  initiateGrfResponse: null,
  updateGrfResponse: null,
  partiallyGrfResponse: null,
  goldWeight: 0.0,
  rsoDetails: [],
  remarks: '',
  viewGrfResponse: null,
  frozenCNs: [],
  creditNote: creditNoteAdaptor.getInitialState(),
  mergeCNsResponse: null,
  hasOtpGenerated: false,
  hasOtpValidated: false,
  anotherCustomerCN: null,
  grfHistoryItems: null,
  historySearchParamDetails: null,
  orderNumber: { order: 0, status: null },
  cnValidationDetails: null,
  uploadFileResponse: false,
  uploadFileListResponse: [],
  downloadFileUrl: null
};

export function CtGrfReducer(
  state: CtGrfState = initialState,
  action: CtGrfActions
): CtGrfState {
  switch (action.type) {
    case CtGrfActionTypes.INITIATE_GRF:
    case CtGrfActionTypes.UPDATE_GRF:
    case CtGrfActionTypes.PARTIALLY_UPDATE_GRF:
    case CtGrfActionTypes.LOAD_RSO_DETAILS:
    case CtGrfActionTypes.VIEW_GRF:
    case CtGrfActionTypes.LOAD_FROZEN_CNS:
    case CtGrfActionTypes.SEARCH_GRF:
    case CtGrfActionTypes.MERGE_CNS:
    case CtGrfActionTypes.LOAD_GRF_HISTORY:
    case CtGrfActionTypes.LOAD_CN_VALIDATION_DETAILS:
      return { ...state, isLoading: true, errors: null };
    case CtGrfActionTypes.LOAD_RSO_DETAILS_SUCCESS:
      return {
        ...state,
        rsoDetails: action.payload,
        errors: null,
        isLoading: false
      };
    case CtGrfActionTypes.FILE_UPLOAD:
      return {
        ...state,
        isLoading: true,
        errors: null,
        uploadFileResponse: false
      };
    case CtGrfActionTypes.LOAD_RSO_DETAILS_FAILURE:
      return {
        ...state,
        rsoDetails: null,
        errors: action.payload,
        isLoading: false
      };
    case CtGrfActionTypes.INITIATE_GRF_SUCCESS:
      return {
        ...state,
        initiateGrfResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case CtGrfActionTypes.INITIATE_GRF_FAILURE:
      return {
        ...state,
        initiateGrfResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case CtGrfActionTypes.UPDATE_GRF_SUCCESS:
      return {
        ...state,
        updateGrfResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case CtGrfActionTypes.UPDATE_GRF_FAILURE:
      return {
        ...state,
        updateGrfResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case CtGrfActionTypes.PARTIALLY_UPDATE_GRF_SUCCESS:
      return {
        ...state,
        partiallyGrfResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case CtGrfActionTypes.PARTIALLY_UPDATE_GRF_FAILURE:
      return {
        ...state,
        partiallyGrfResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case CtGrfActionTypes.VIEW_GRF_SUCCESS:
      return {
        ...state,
        viewGrfResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case CtGrfActionTypes.VIEW_GRF_FAILURE:
      return {
        ...state,
        viewGrfResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case CtGrfActionTypes.SET_SELECTED_RSO_NAME:
      return {
        ...state,
        selectedRsoName: action.payload,
        errors: null,
        isLoading: false
      };
    case CtGrfActionTypes.SET_TOTAL_AMOUNT:
      return {
        ...state,
        totalAmt: action.payload,
        errors: null,
        isLoading: false
      };
    case CtGrfActionTypes.FILE_UPLOAD_LIST:
      return {
        ...state,
        isLoading: true,
        errors: null,
        uploadFileListResponse: []
      };
    case CtGrfActionTypes.FILE_UPLOAD_LIST_SUCCESS:
      return {
        ...state,
        uploadFileListResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case CtGrfActionTypes.FILE_DOWNLOAD_URL:
      return {
        ...state,
        isLoading: true,
        errors: null,
        downloadFileUrl: null
      };
    case CtGrfActionTypes.RESET_GRF:
      return {
        ...state,
        errors: null,
        isLoading: false,
        selectedRsoName: null,
        totalAmt: 0,
        initiateGrfResponse: null,
        updateGrfResponse: null,
        partiallyGrfResponse: null,
        goldWeight: 0.0,
        rsoDetails: [],
        uploadFileResponse: false,
        uploadFileListResponse: [],
        downloadFileUrl: null,
        remarks: '',
        viewGrfResponse: null,
        frozenCNs: [],
        creditNote: creditNoteAdaptor.getInitialState(),
        mergeCNsResponse: null,
        hasOtpGenerated: false,
        hasOtpValidated: false,
        anotherCustomerCN: null
      };
    case CtGrfActionTypes.SET_GOLD_WEIGHT:
      return {
        ...state,
        goldWeight: action.goldWeight
      };
    case CtGrfActionTypes.SET_REMARKS:
      return {
        ...state,
        remarks: action.payload
      };

    case CtGrfActionTypes.LOAD_FROZEN_CNS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        frozenCNs: action.payload
      };
    case CtGrfActionTypes.SEARCH_GRF_SUCCESS:
      return {
        ...state,
        isLoading: false,
        creditNote: creditNoteAdaptor.addMany(
          [action.payload],
          state.creditNote
        ),
        anotherCustomerCN: action.payload
      };

    case CtGrfActionTypes.MERGE_CNS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        mergeCNsResponse: action.payload
      };
    case CtGrfActionTypes.GENERATE_OTP:
      return {
        ...state,
        isLoading: true,
        errors: null,
        hasOtpGenerated: false
      };
    case CtGrfActionTypes.GENERATE_OTP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasOtpGenerated: true
      };
    case CtGrfActionTypes.GENERATE_OTP_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
        hasOtpGenerated: false
      };
    case CtGrfActionTypes.FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        uploadFileResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case CtGrfActionTypes.FILE_DOWNLOAD_URL_SUCCESS:
      return {
        ...state,
        downloadFileUrl: action.payload,
        errors: null,
        isLoading: false
      };
    case CtGrfActionTypes.LOAD_FROZEN_CNS_FAILURE:
    case CtGrfActionTypes.SEARCH_GRF_FAILURE:
    case CtGrfActionTypes.MERGE_CNS_FAILURE:
    case CtGrfActionTypes.FILE_UPLOAD_FAILURE:
    case CtGrfActionTypes.FILE_UPLOAD_LIST_FAILURE:
    case CtGrfActionTypes.FILE_DOWNLOAD_URL_FAILURE:
    case CtGrfActionTypes.LOAD_CN_VALIDATION_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.payload
      };
    case CtGrfActionTypes.VALIDATE_OTP:
      return {
        ...state,
        isLoading: true,
        hasOtpValidated: false
      };
    case CtGrfActionTypes.VALIDATE_OTP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasOtpValidated: true
      };
    case CtGrfActionTypes.VALIDATE_OTP_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasOtpValidated: false,
        errors: action.payload
      };
    case CtGrfActionTypes.REMOVE_GRF_CN:
      return {
        ...state,
        creditNote: creditNoteAdaptor.removeOne(
          action.payload,
          state.creditNote
        )
      };
    case CtGrfActionTypes.REMOVE_ALL_GRF_CNS:
      return {
        ...state,
        creditNote: creditNoteAdaptor.removeAll(state.creditNote),
        frozenCNs: [],
        mergeCNsResponse: null,
        hasOtpGenerated: false,
        hasOtpValidated: false,
        anotherCustomerCN: null
      };
    case CtGrfActionTypes.LOAD_GRF_HISTORY_SUCCESS:
      return {
        ...state,
        grfHistoryItems: action.payload,
        errors: null,
        isLoading: false
      };
    case CtGrfActionTypes.LOAD_GRF_HISTORY_FAILURE:
      return {
        ...state,
        grfHistoryItems: null,
        errors: action.payload,
        isLoading: false
      };
    case CtGrfActionTypes.SET_HISTORY_SEARCH_PARAM_DETAILS:
      return {
        ...state,
        historySearchParamDetails: action.payload
      };
    case CtGrfActionTypes.SET_ORDER_NUMBER:
      return {
        ...state,
        orderNumber: { order: action.payload, status: action.status }
      };
    case CtGrfActionTypes.LOAD_CN_VALIDATION_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cnValidationDetails: action.payload
      };
    default:
      return state;
  }
}
