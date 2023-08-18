import { createFeatureSelector } from '@ngrx/store';

import {
  CPGProductGroupConfigForQCGCActions,
  CPGProductGroupConfigForQCGCActionTypes
} from './cpg-product-group-config-for-qcgc.actions';
import { CPGProductGroupConfigForQCGCState } from './cpg-product-group-config-for-qcgc.state';

export const initialState: CPGProductGroupConfigForQCGCState = {
  cpgProductGroupConfigListing: null,
  cpgProductGroupConfigDetails: null,
  totalCpgProductGroupConfig: 0,
  cpgProductGroupConfigDetailsSavedResponse: null,
  cpgProductGroupConfigDetailsEditedResponse: null,
  cpgProductGroupMapping: [],
  cpgProductGroupMappingUpdated: false,
  error: null,
  isLoading: null
};

export const CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_FEATURE_KEY =
  'cpgProductGroupConfigForQCGC';
export const selectCPGProductGroupConfigForQCGCState = createFeatureSelector<
  CPGProductGroupConfigForQCGCState
>(CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_FEATURE_KEY);

export function CPGProductGroupConfigForQCGCReducer(
  state: CPGProductGroupConfigForQCGCState = initialState,
  action: CPGProductGroupConfigForQCGCActions
): CPGProductGroupConfigForQCGCState {
  switch (action.type) {
    case CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING:
    case CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS:
      return {
        ...state,
        cpgProductGroupConfigDetails: null,
        cpgProductGroupConfigDetailsSavedResponse: null,
        cpgProductGroupConfigDetailsEditedResponse: null,
        cpgProductGroupMapping: [],
        cpgProductGroupMappingUpdated: false,
        isLoading: true,
        error: null
      };

    case CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING_SUCCESS:
      return {
        ...state,
        cpgProductGroupConfigListing: action.payload.results,
        totalCpgProductGroupConfig: action.payload.totalElements,
        isLoading: false
      };

    case CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING_FAILURE:
    case CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_FAILURE:
    case CPGProductGroupConfigForQCGCActionTypes.SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_FAILURE:
    case CPGProductGroupConfigForQCGCActionTypes.EDIT_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_FAILURE:
    case CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING_FAILURE:
    case CPGProductGroupConfigForQCGCActionTypes.SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case CPGProductGroupConfigForQCGCActionTypes.SEARCH_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING_FAILURE:
      return {
        ...state,
        cpgProductGroupConfigListing: [],
        totalCpgProductGroupConfig: 0,
        error: action.payload,
        isLoading: false
      };

    case CPGProductGroupConfigForQCGCActionTypes.SEARCH_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case CPGProductGroupConfigForQCGCActionTypes.SEARCH_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING_SUCCESS:
      return {
        ...state,
       // cpgProductGroupConfigListing: action.payload,
        totalCpgProductGroupConfig: 0,
        isLoading: false
      };

    case CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_SUCCESS:
      return {
        ...state,
        cpgProductGroupConfigDetails: action.payload,
        isLoading: false
      };

    case CPGProductGroupConfigForQCGCActionTypes.SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS:
      return {
        ...state,
        cpgProductGroupConfigDetailsSavedResponse: null,
        isLoading: true,
        error: null
      };

    case CPGProductGroupConfigForQCGCActionTypes.SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_SUCCESS:
      return {
        ...state,
        cpgProductGroupConfigDetails: action.payload,
        cpgProductGroupConfigDetailsSavedResponse: action.payload,
        isLoading: false
      };

    case CPGProductGroupConfigForQCGCActionTypes.EDIT_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS:
      return {
        ...state,
        cpgProductGroupConfigDetailsEditedResponse: null,
        isLoading: true,
        error: null
      };

    case CPGProductGroupConfigForQCGCActionTypes.EDIT_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_SUCCESS:
      return {
        ...state,
        cpgProductGroupConfigDetails: action.payload,
        cpgProductGroupConfigDetailsEditedResponse: action.payload,
        isLoading: false
      };

    case CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING:
      return {
        ...state,
        cpgProductGroupConfigDetailsEditedResponse: null,
        isLoading: true,
        error: null
      };

    case CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING_SUCCESS:
      return {
        ...state,
        cpgProductGroupMapping: action.payload,
        isLoading: false
      };

    case CPGProductGroupConfigForQCGCActionTypes.SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING:
      return {
        ...state,
        cpgProductGroupMappingUpdated: false,
        isLoading: true,
        error: null
      };

    case CPGProductGroupConfigForQCGCActionTypes.SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING_SUCCESS:
      return {
        ...state,
        cpgProductGroupMapping: action.payload,
        cpgProductGroupMappingUpdated: true,
        isLoading: false
      };

    default:
      return state;
  }
}
