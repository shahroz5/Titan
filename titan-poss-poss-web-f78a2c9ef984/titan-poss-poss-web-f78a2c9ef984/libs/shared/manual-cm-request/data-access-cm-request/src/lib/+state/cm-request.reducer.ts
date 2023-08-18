import { createFeatureSelector } from '@ngrx/store';
import { CmRequestState } from './cm-request.state';
import { CmRequestActionTypes, CmRequestActions } from './cm-request.actions';
import { cmRequestListAdapter, itemDetailsAdapter } from './cm-request.entity';
import { StatusTypesEnum } from '@poss-web/shared/models';

export const cmRequestFeatureKey = 'cmRequest';

export const selectCmRequestState = createFeatureSelector<CmRequestState>(
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
  downloadFileUrl: null,
  requestStausDropDownValues: StatusTypesEnum.APPROVED
};

export function cmRequestReducer(
  state: CmRequestState = initialState,
  action: CmRequestActions
): CmRequestState {
  switch (action.type) {
    case CmRequestActionTypes.LOAD_CM_REQUEST_LIST:
    case CmRequestActionTypes.LOAD_CM_REQUEST_DETAILS:
    case CmRequestActionTypes.LOAD_CM_PRODUCT_DETAILS:
    case CmRequestActionTypes.LOAD_CM_PRODUCT_LIST:
    case CmRequestActionTypes.CM_APPROVAL_REQUEST:
    case CmRequestActionTypes.CONFIRM_MANUAL_CM:
      return { ...state, isLoading: true, hasError: null };

    case CmRequestActionTypes.FILE_UPLOAD_LIST:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        uploadFileListResponse: []
      };

    case CmRequestActionTypes.FILE_DOWNLOAD_URL:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        downloadFileUrl: null
      };

    case CmRequestActionTypes.LOAD_CM_REQUEST_LIST_FAILURE:
    case CmRequestActionTypes.LOAD_CM_REQUEST_DETAILS_FAILURE:
    case CmRequestActionTypes.LOAD_CM_PRODUCT_LIST_FAILURE:
    case CmRequestActionTypes.LOAD_CM_PRODUCT_DETAILS_FAILURE:
    case CmRequestActionTypes.CM_APPROVAL_REQUEST_FAILURE:
    case CmRequestActionTypes.CONFIRM_MANUAL_CM_FAILURE:
    case CmRequestActionTypes.FILE_UPLOAD_LIST_FAILURE:
    case CmRequestActionTypes.FILE_DOWNLOAD_URL_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case CmRequestActionTypes.LOAD_CM_REQUEST_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cmRequestList: cmRequestListAdapter.addMany(
          action.payload,
          state.cmRequestList
        )
      };

    case CmRequestActionTypes.LOAD_CM_REQUEST_DETAILS_SUCCESS:
      if (action.payload.userType) {
        return {
          ...state,
          isLoading: false,
          cmRequestDetails: action.payload.data,
          headerDetails:
            action.payload.data.headerData.data.manualBillDetails
              .manualBillDetails,
          customerDetails: action.payload.data.headerData.data,
          productDetails: itemDetailsAdapter.addMany(
            action.payload.data.approvedData.data.itemList,
            state.productDetails
          )
        };
      } else {
        return {
          ...state,
          isLoading: false,
          cmRequestDetails: action.payload.data,
          headerDetails:
            action.payload.data.headerData.data.manualBillDetails
              .manualBillDetails,
          customerDetails: action.payload.data.headerData.data
        };
      }

    case CmRequestActionTypes.LOAD_CM_PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productList: action.payload
      };

    case CmRequestActionTypes.LOAD_CM_PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productDetails: itemDetailsAdapter.addMany(
          action.payload,
          state.productDetails
        )
      };

    case CmRequestActionTypes.CM_APPROVAL_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cmApprovalRequest: action.payload
      };

    case CmRequestActionTypes.CONFIRM_MANUAL_CM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        updateCashMemoResponse: action.payload
      };

    case CmRequestActionTypes.FILE_UPLOAD_LIST_SUCCESS:
      return {
        ...state,
        uploadFileListResponse: action.payload,
        hasError: null,
        isLoading: false
      };

    case CmRequestActionTypes.FILE_DOWNLOAD_URL_SUCCESS:
      return {
        ...state,
        downloadFileUrl: action.payload,
        hasError: null,
        isLoading: false
      };

    case CmRequestActionTypes.CLEAR_CM_REQUEST_LIST:
      return {
        ...state,
        isLoading: false,
        cmRequestList: cmRequestListAdapter.removeAll(state.cmRequestList)
      };

    case CmRequestActionTypes.CLEAR_CM_REQUEST_PRODUCT_DETAILS:
      return {
        ...state,
        isLoading: false,
        productDetails: itemDetailsAdapter.removeAll(state.productDetails)
      };

    case CmRequestActionTypes.CLEAR_CM_REQUEST_DETAILS:
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

      case CmRequestActionTypes.SET_DROPDOWN_VALUE:
        return {
          ...state,
          requestStausDropDownValues: action.payload
        };

    default:
      return state;
  }
}
