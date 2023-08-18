import { createFeatureSelector } from '@ngrx/store';

import { VendorMasterState } from './vendor-master.state';
import {
  VendorMasterActionTypes,
  VendorMasterCodeActions
} from './vendor-master.action';

export const initialState: VendorMasterState = {
  vendorMaster: null,
  vendorMasterList: [],
  isLoading: null,
  error: null,
  totalElements: null
};
export const vendorMasterFeatureKey = 'vendorMaster';
export const selectVendorMasterState = createFeatureSelector<VendorMasterState>(
  vendorMasterFeatureKey
);

export function vendorMasterReducer(
  state: VendorMasterState = initialState,
  action: VendorMasterCodeActions
) {
  switch (action.type) {
    case VendorMasterActionTypes.LOAD_VENDOR_MASTER_LISTING:
    case VendorMasterActionTypes.SEARCH_VENDOR_MASTER_BY_CODE:
    case VendorMasterActionTypes.LOAD_VENDOR_MASTER_BY_CODE:
      return {
        ...state,
        isLoading: true
      };

    case VendorMasterActionTypes.SEARCH_VENDOR_MASTER_BY_CODE_SUCCESS:
    case VendorMasterActionTypes.LOAD_VENDOR_MASTER_LISTING_SUCCESS:
      return {
        ...state,
        vendorMasterList: action.payload.results,
        totalElements: action.payload.totalElements,
        isLoading: false
      };
    case VendorMasterActionTypes.SEARCH_VENDOR_MASTER_BY_CODE_FAILURE:
    case VendorMasterActionTypes.LOAD_VENDOR_MASTER_LISTING_FAILURE:
    case VendorMasterActionTypes.LOAD_VENDOR_MASTER_BY_CODE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null
      };

    case VendorMasterActionTypes.LOAD_VENDOR_MASTER_BY_CODE_SUCCESS:
      return {
        ...state,
        vendorMaster: action.payload,
        isLoading: false
      };

    case VendorMasterActionTypes.LOAD_RESET:
      return {
        ...state,
        totalElements: null,
        error: null,

        vendorMasterList: [],
        vendorMaster: null
      };
    default:
      return {
        ...state
      };
  }
}
