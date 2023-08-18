import { createFeatureSelector } from '@ngrx/store';
import { CmRequestState } from './grf-request.state';
import { GrfRequestActionTypes, GrfRequestActions } from './grf-request.actions';
import { cmRequestListAdapter, itemDetailsAdapter } from './grf-request.entity';

export const cmRequestFeatureKey = 'cmRequest';

export const selectGrfRequestState = createFeatureSelector<CmRequestState>(
  cmRequestFeatureKey
);

export const initialState: CmRequestState = {
  hasError: null,
  isLoading: false,
  cmRequestList: cmRequestListAdapter.getInitialState(),
  cmRequestDetails: null,
  customerDetails: null,
  headerDetails: null,
  productList: null,
  productDetails: itemDetailsAdapter.getInitialState(),
  cmApprovalRequest: null,
  updateCashMemoResponse: null,
  uploadFileListResponse: [],
  downloadFileUrl: null
};

export function cmRequestReducer(
  state: CmRequestState = initialState,
  action: GrfRequestActions
): CmRequestState {
  switch (action.type) {
    case GrfRequestActionTypes.LOAD_GRF_REQUEST_LIST:
    case GrfRequestActionTypes.LOAD_GRF_REQUEST_DETAILS:
    case GrfRequestActionTypes.LOAD_GRF_PRODUCT_DETAILS:
    case GrfRequestActionTypes.LOAD_GRF_PRODUCT_LIST:
    case GrfRequestActionTypes.GRF_APPROVAL_REQUEST:
    case GrfRequestActionTypes.CONFIRM_MANUAL_GRF:
      return { ...state, isLoading: true, hasError: null };

    case GrfRequestActionTypes.FILE_UPLOAD_LIST:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        uploadFileListResponse: []
      };

    case GrfRequestActionTypes.FILE_DOWNLOAD_URL:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        downloadFileUrl: null
      };

    case GrfRequestActionTypes.LOAD_GRF_REQUEST_LIST_FAILURE:
    case GrfRequestActionTypes.LOAD_GRF_REQUEST_DETAILS_FAILURE:
    case GrfRequestActionTypes.LOAD_GRF_PRODUCT_LIST_FAILURE:
    case GrfRequestActionTypes.LOAD_GRF_PRODUCT_DETAILS_FAILURE:
    case GrfRequestActionTypes.GRF_APPROVAL_REQUEST_FAILURE:
    case GrfRequestActionTypes.CONFIRM_MANUAL_GRF_FAILURE:
    case GrfRequestActionTypes.FILE_UPLOAD_LIST_FAILURE:
    case GrfRequestActionTypes.FILE_DOWNLOAD_URL_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case GrfRequestActionTypes.LOAD_GRF_REQUEST_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cmRequestList: cmRequestListAdapter.addMany(
          action.payload,
          state.cmRequestList
        )
      };

    case GrfRequestActionTypes.LOAD_GRF_REQUEST_DETAILS_SUCCESS:
        return {
          ...state,
          isLoading: false,
          cmRequestDetails: action.payload.data,
          headerDetails:
            action.payload.data.headerData.data.manualBillDetails
              .manualBillDetails,
          customerDetails: action.payload.data.headerData.data,
          // productDetails: itemDetailsAdapter.addMany(
          //   action.payload.data.approvedData.data.itemList,
          //   state.productDetails
          // )
        };


    case GrfRequestActionTypes.LOAD_GRF_PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productList: action.payload
      };

    case GrfRequestActionTypes.LOAD_GRF_PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productDetails: itemDetailsAdapter.addMany(
          action.payload,
          state.productDetails
        )
      };

    case GrfRequestActionTypes.GRF_APPROVAL_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cmApprovalRequest: action.payload
      };

    case GrfRequestActionTypes.CONFIRM_MANUAL_GRF_SUCCESS:
      return {
        ...state,
        isLoading: false,
        updateCashMemoResponse: action.payload
      };

    case GrfRequestActionTypes.FILE_UPLOAD_LIST_SUCCESS:
      return {
        ...state,
        uploadFileListResponse: action.payload,
        hasError: null,
        isLoading: false
      };

    case GrfRequestActionTypes.FILE_DOWNLOAD_URL_SUCCESS:
      return {
        ...state,
        downloadFileUrl: action.payload,
        hasError: null,
        isLoading: false
      };

    case GrfRequestActionTypes.CLEAR_GRF_REQUEST_LIST:
      return {
        ...state,
        isLoading: false,
        cmRequestList: cmRequestListAdapter.removeAll(state.cmRequestList)
      };

    case GrfRequestActionTypes.CLEAR_GRF_REQUEST_DETAILS:
      return {
        ...state,
        isLoading: false,
        cmRequestDetails: null,
        customerDetails: null,
        headerDetails: null,
        productList: null,
        productDetails: itemDetailsAdapter.removeAll(state.productDetails),
        cmApprovalRequest: null,
        updateCashMemoResponse: null,
        uploadFileListResponse: [],
        downloadFileUrl: null
      };

    default:
      return state;
  }
}
