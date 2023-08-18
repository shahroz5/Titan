import { createFeatureSelector } from '@ngrx/store';
import { AbManualRequestState } from './ab-manual-request.state';
import {
  AbManualRequestActionTypes,
  AbManualRequestActions
} from './ab-manual-request.actions';
import {
  AbManualRequestListAdapter,
  itemDetailsAdapter
} from './ab-manual-request.entity';
import * as moment from 'moment';

export const AbManualRequestFeatureKey = 'AbManualRequest';

export const selectAbManualRequestState = createFeatureSelector<
  AbManualRequestState
>(AbManualRequestFeatureKey);

export const initialState: AbManualRequestState = {
  hasError: null,
  isLoading: false,
  abManualRequestList: AbManualRequestListAdapter.getInitialState(),
  abManualRequestDetails: null,
  customerDetails: null,
  headerDetails: null,
  productList: null,
  productDetails: itemDetailsAdapter.getInitialState(),
  abManualApprovalRequest: null,
  updateCashMemoResponse: null,
  advancedFilter: {
    startDate: moment().startOf('day').valueOf(),
    endDate: moment().endOf('day').valueOf(),
    reqFiscalYear: null,
    location: null
  },
  uploadFileListResponse: [],
  downloadFileUrl: null
};

export function AbManualRequestReducer(
  state: AbManualRequestState = initialState,
  action: AbManualRequestActions
): AbManualRequestState {
  switch (action.type) {
    case AbManualRequestActionTypes.LOAD_AbManual_REQUEST_LIST:
    case AbManualRequestActionTypes.LOAD_AbManual_REQUEST_DETAILS:
    case AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_DETAILS:
    case AbManualRequestActionTypes.LOAD_PRODUCT_DETAILS:
    case AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_LIST:
    case AbManualRequestActionTypes.AbManual_APPROVAL_REQUEST:
    case AbManualRequestActionTypes.CONFIRM_MANUAL_AbManual:
      return { ...state, isLoading: true, hasError: null };

    case AbManualRequestActionTypes.FILE_UPLOAD_LIST:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        uploadFileListResponse: []
      };

    case AbManualRequestActionTypes.FILE_DOWNLOAD_URL:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        downloadFileUrl: null
      };

    case AbManualRequestActionTypes.LOAD_AbManual_REQUEST_LIST_FAILURE:
    case AbManualRequestActionTypes.LOAD_AbManual_REQUEST_DETAILS_FAILURE:
    case AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_LIST_FAILURE:
    case AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_DETAILS_FAILURE:
    case AbManualRequestActionTypes.LOAD_PRODUCT_DETAILS_FAILURE:
    case AbManualRequestActionTypes.AbManual_APPROVAL_REQUEST_FAILURE:
    case AbManualRequestActionTypes.CONFIRM_MANUAL_AbManual_FAILURE:
    case AbManualRequestActionTypes.FILE_UPLOAD_LIST_FAILURE:
    case AbManualRequestActionTypes.FILE_DOWNLOAD_URL_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case AbManualRequestActionTypes.LOAD_AbManual_REQUEST_LIST_SUCCESS:
      console.log('payload:', action.payload);
      return {
        ...state,
        isLoading: false,
        abManualRequestList: AbManualRequestListAdapter.addMany(
          action.payload,
          state.abManualRequestList
        )
      };

    case AbManualRequestActionTypes.LOAD_AbManual_REQUEST_DETAILS_SUCCESS:
      console.log('payload:', action.payload);

      return {
        ...state,
        isLoading: false,
        abManualRequestDetails: action.payload,
        headerDetails:
          action.payload.headerData.data.manualBillDetails.manualBillDetails,
        customerDetails: action.payload.headerData.data,
        productDetails: itemDetailsAdapter.addMany(
          action.payload.approvedData.data.itemList.map((item: any) => ({
            ...item,
            unitWeight: item.inventoryWeight
          })),
          state.productDetails
        )
      };

    case AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_LIST_SUCCESS:
      console.log('payload:', action.payload);
      return {
        ...state,
        isLoading: false,
        productList: action.payload
      };

    case AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_DETAILS_SUCCESS:
      console.log('payload:', action.payload);
      return {
        ...state,
        isLoading: false,
        productDetails: itemDetailsAdapter.addMany(
          action.payload,
          state.productDetails
        )
      };

    case AbManualRequestActionTypes.LOAD_PRODUCT_DETAILS_SUCCESS:
      console.log('payload:', action.payload);
      return {
        ...state,
        isLoading: false,
        productDetails: itemDetailsAdapter.addMany(
          action.payload,
          state.productDetails
        )
      };

    case AbManualRequestActionTypes.AbManual_APPROVAL_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        abManualApprovalRequest: action.payload
      };

    case AbManualRequestActionTypes.CONFIRM_MANUAL_AbManual_SUCCESS:
      return {
        ...state,
        isLoading: false,
        updateCashMemoResponse: action.payload
      };

    case AbManualRequestActionTypes.CLEAR_AbManual_REQUEST_LIST:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        abManualRequestList: AbManualRequestListAdapter.removeAll(
          state.abManualRequestList
        )
      };

    case AbManualRequestActionTypes.CLEAR_AbManual_REQUEST_DETAILS:
      return {
        ...state,
        hasError: null,
        isLoading: false,
        abManualRequestDetails: null,
        customerDetails: null,
        headerDetails: null,
        productList: null,
        productDetails: itemDetailsAdapter.removeAll(state.productDetails),
        abManualApprovalRequest: null,
        updateCashMemoResponse: null,
        downloadFileUrl: null
      };

    case AbManualRequestActionTypes.LOAD_HISTORY_FILTER_DATA:
      return {
        ...state,
        advancedFilter: action.payload
      };

    case AbManualRequestActionTypes.RESET_FILTER:
      return {
        ...state,
        advancedFilter: {
          startDate: moment().startOf('day').valueOf(),
          endDate: moment().endOf('day').valueOf(),
          reqFiscalYear: null,
          location: null
        }
      };

    case AbManualRequestActionTypes.FILE_UPLOAD_LIST_SUCCESS:
      return {
        ...state,
        uploadFileListResponse: action.payload,
        hasError: null,
        isLoading: false
      };

    case AbManualRequestActionTypes.FILE_DOWNLOAD_URL_SUCCESS:
      return {
        ...state,
        downloadFileUrl: action.payload,
        hasError: null,
        isLoading: false
      };

    default:
      return state;
  }
}
