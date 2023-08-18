import { createFeatureSelector } from '@ngrx/store';
import {
  GEPPurityConfigActions,
  GEPPurityConfigActionTypes
} from './gep-purity-config.actions';
import { GEPPurityConfigState } from './gep-purity-config.state';
export const GEP_PURITY_CONFIGURATION_KEY = 'GEPPurityConfguration';
export const selectGEPPurityConfiguration = createFeatureSelector<
  GEPPurityConfigState
>(GEP_PURITY_CONFIGURATION_KEY);
export const initialState: GEPPurityConfigState = {
  totalElements: 0,
  GEPPurityConfigList: null,
  isLoading: false,
  error: null,
  hasGEPDetailsSaved: false,
  metalType: null,
  itemType: null,
  hasPurityDetailsSaved: false,
  excludeThemeCodes: null,
  excludeItemCodes: null,
  productGroups: null,
  hasSearched: null,
  configId: null,
  hasGroupsSaved: false,
  hasGroupsDataUpdated: false,
  gepDetails: null,
  purityDetails: [],
  productGroupsDeduction: null,
  hasThemeCodeSaved: false,
  hasThemeCodeRemoved: false,
  hasProductGroupRemoved: false,
  errorLog: null,
  fileResponse: undefined,
  productGroupsCount: 0,
  hasUpdateToggleButton: false,
  goldRanges: [],
  platinumRanges: [],
  silverRanges: [],
  location: [],
  allSelectedGroups: []
};
export function GEPPurityConfigReducer(
  state: GEPPurityConfigState = initialState,
  action: GEPPurityConfigActions
) {
  switch (action.type) {
    case GEPPurityConfigActionTypes.LOAD_GEP_PURITY_CONFIG_LIST:
    case GEPPurityConfigActionTypes.SEARCH_CONFIG_NAME:
    case GEPPurityConfigActionTypes.LOAD_METAL_TYPES:
    case GEPPurityConfigActionTypes.LOAD_ITEM_TYPES:
    case GEPPurityConfigActionTypes.LOAD_GOLD_RANGES:
    case GEPPurityConfigActionTypes.UPLOAD_FILE:
    case GEPPurityConfigActionTypes.GET_EXCLUDE_THEME_CODES:
    case GEPPurityConfigActionTypes.GET_EXCLUDE_ITEM_CODES:
    case GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS:
    case GEPPurityConfigActionTypes.LOAD_GEP_PURITY_DETAILS:
    case GEPPurityConfigActionTypes.LOAD_GEP_DETAILS:
    case GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS_DEUCTION:
    case GEPPurityConfigActionTypes.SEARCH_ITEM_CODE:
    case GEPPurityConfigActionTypes.ITEM_CODES_ERROR_LOG_DOWNLOAD:
    case GEPPurityConfigActionTypes.LOAD_SILVER_RANGES:
    case GEPPurityConfigActionTypes.LOAD_PLATINUM_RANGES:
    //case GEPPurityConfigActionTypes.LOAD_LOCATIONS:
    case GEPPurityConfigActionTypes.LOAD_SELETED_PRODUCT_GROUPS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case GEPPurityConfigActionTypes.ITEM_CODES_ERROR_LOG_DOWNLOAD_SUCCESS:
      return {
        ...state,
        errorLog: action.payload,
        isLoading: false,
        error: null
      };
    case GEPPurityConfigActionTypes.LOAD_METAL_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        metalType: action.payload
      };
    case GEPPurityConfigActionTypes.LOAD_ITEM_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        itemType: action.payload
      };
    case GEPPurityConfigActionTypes.LOAD_GOLD_RANGES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        goldRanges: action.payload
      };
    case GEPPurityConfigActionTypes.LOAD_SILVER_RANGES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        silverRanges: action.payload
      };
    case GEPPurityConfigActionTypes.LOAD_PLATINUM_RANGES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        platinumRanges: action.payload
      };
    case GEPPurityConfigActionTypes.UPLOAD_FILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        fileResponse: action.payload.fileResponse,
        configId: action.payload.configId
      };
    case GEPPurityConfigActionTypes.LOAD_GEP_PURITY_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        GEPPurityConfigList: action.payload.gepPurityConfigList,
        totalElements: action.payload.totalElements
      };
    case GEPPurityConfigActionTypes.SEARCH_CONFIG_NAME_SUCCESS:
      return {
        ...state,
        isLoading: false,
        GEPPurityConfigList: action.payload,
        totalElements: 0
      };
    case GEPPurityConfigActionTypes.LOAD_GEP_PURITY_CONFIG_LIST_FAILURE:
    case GEPPurityConfigActionTypes.SEARCH_CONFIG_NAME_FAILURE:
    case GEPPurityConfigActionTypes.LOAD_METAL_TYPES_FAILURE:
    case GEPPurityConfigActionTypes.LOAD_ITEM_TYPES_FAILURE:
    case GEPPurityConfigActionTypes.LOAD_GOLD_RANGES_FAILURE:
    case GEPPurityConfigActionTypes.UPLOAD_FILE_FAILURE:
    case GEPPurityConfigActionTypes.GET_EXCLUDE_THEME_CODES_FAILURE:
    case GEPPurityConfigActionTypes.GET_EXCLUDE_ITEM_CODES_FAILURE:
    case GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS_FAILURE:
    case GEPPurityConfigActionTypes.LOAD_GEP_PURITY_DETAILS_FAILURE:
    case GEPPurityConfigActionTypes.LOAD_GEP_DETAILS_FAILURE:
    case GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS_DEUCTION_FAILURE:
    case GEPPurityConfigActionTypes.SEARCH_ITEM_CODE_FAILURE:
    case GEPPurityConfigActionTypes.ITEM_CODES_ERROR_LOG_DOWNLOAD_FAILURE:
    case GEPPurityConfigActionTypes.LOAD_SILVER_RANGES_FAILURE:
    case GEPPurityConfigActionTypes.LOAD_PLATINUM_RANGES_FAILURE:
      // case GEPPurityConfigActionTypes.LOAD_LOCATIONS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case GEPPurityConfigActionTypes.SAVE_GEP_DETAILS:
      return {
        ...state,
        isLoading: true,
        hasGEPDetailsSaved: false
      };
    case GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productGroups: action.payload
      };
    case GEPPurityConfigActionTypes.SAVE_GEP_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasGEPDetailsSaved: true,
        gepDetails: action.payload,
        configId: action.payload.configId
      };
    case GEPPurityConfigActionTypes.SAVE_GEP_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasGEPDetailsSaved: false,
        error: action.payload
      };
    case GEPPurityConfigActionTypes.SAVE_PURITY_DETAILS:
      return {
        ...state,
        isLoading: true,
        hasPurityDetailsSaved: false
      };
    case GEPPurityConfigActionTypes.SAVE_PURITY_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasPurityDetailsSaved: true,
        configId: action.payload.length > 0 ? action.payload[0].configId : null,
        purityDetails: action.payload
      };
    case GEPPurityConfigActionTypes.SAVE_PURITY_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasPurityDetailsSaved: false,
        error: action.payload
      };
    case GEPPurityConfigActionTypes.GET_EXCLUDE_THEME_CODES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        excludeThemeCodes: action.payload
      };
    case GEPPurityConfigActionTypes.GET_EXCLUDE_ITEM_CODES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        excludeItemCodes: action.payload.itemCodes,
        totalElements: action.payload.totalElements
      };

    case GEPPurityConfigActionTypes.SEARCH_ITEM_CODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        excludeItemCodes: action.payload
      };
    case GEPPurityConfigActionTypes.SEARCH_PRODUCT_GROUP:
      return {
        ...state,
        isLoading: true,
        hasSearched: false
      };
    case GEPPurityConfigActionTypes.SEARCH_PRODUCT_GROUP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSearched: true,
        productGroupsDeduction: action.payload
      };
    case GEPPurityConfigActionTypes.SEARCH_PRODUCT_GROUP_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasSearched: false,
        error: action.payload
      };
    case GEPPurityConfigActionTypes.RESET_GEP_PURITY_CONFIGURATION:
      return {
        ...state,
        configId: null,
        hasGEPDetailsSaved: false,
        hasPurityDetailsSaved: false,
        hasUpdatedToggleButton: false,
        hasGroupsSaved: false,
        hasGroupsDataUpdated: false,
        gepDetails: null,
        purityDetails: [],
        error: null,
        productGroupsDeduction: null,
        hasThemeCodeSaved: false,
        excludeThemeCodes: null,
        excludeItemCodes: null,
        hasProductGroupRemoved: null,
        hasStatusUpdated: false,
        hasLocationsSaved: false,
        hasThemeCodeRemoved: false,
        fileResponse: undefined,
        errorLog: null,
        productGroupsCount: 0,
        hasUpdateToggleButton: false
      };

    case GEPPurityConfigActionTypes.SAVE_PRODUCT_GROUPS_DEDUCTION:
      return {
        ...state,
        isLoading: true,
        hasGroupsSaved: false
      };
    case GEPPurityConfigActionTypes.SAVE_PRODUCT_GROUPS_DEDUCTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasGroupsSaved: true,
        configId: action.payload
      };
    case GEPPurityConfigActionTypes.SAVE_PRODUCT_GROUPS_DEDUCTION_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasGroupsSaved: false,
        error: action.payload
      };
    case GEPPurityConfigActionTypes.UPDATE_PRODUCT_GROUPS_DEDUCTION:
      return {
        ...state,
        isLoading: true,
        hasGroupsDataUpdated: false
      };
    case GEPPurityConfigActionTypes.UPDATE_PRODUCT_GROUPS_DEDUCTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasGroupsDataUpdated: true,
        configId: action.payload
      };
    case GEPPurityConfigActionTypes.UPDATE_PRODUCT_GROUPS_DEDUCTION_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasGroupsDataUpdated: false,
        error: action.payload
      };
    case GEPPurityConfigActionTypes.LOAD_GEP_PURITY_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        purityDetails: action.payload
      };
    case GEPPurityConfigActionTypes.LOAD_GEP_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        gepDetails: action.payload
      };
    case GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS_DEUCTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productGroupsDeduction: action.payload.productGroupsDeduction,
        productGroupsCount: action.payload.count
      };
    case GEPPurityConfigActionTypes.SAVE_THEME_CODES:
      return {
        ...state,
        isLoading: true,
        hasThemeCodeSaved: false
      };
    case GEPPurityConfigActionTypes.SAVE_THEME_CODES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasThemeCodeSaved: true,
        configId: action.payload
      };
    case GEPPurityConfigActionTypes.SAVE_THEME_CODES_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasThemeCodeSaved: false,
        error: action.payload
      };
    case GEPPurityConfigActionTypes.DELETE_THEME_CODES:
      return {
        ...state,
        isLoading: true,
        hasThemeCodeRemoved: false
      };
    case GEPPurityConfigActionTypes.DELETE_THEME_CODES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasThemeCodeRemoved: true
      };
    case GEPPurityConfigActionTypes.DELETE_THEME_CODES_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasThemeCodeRemoved: false,
        error: action.payload
      };

    case GEPPurityConfigActionTypes.REMOVE_PRODUCT_GROUP:
      return {
        ...state,
        isLoading: true,
        hasProductGroupRemoved: false
      };
    case GEPPurityConfigActionTypes.REMOVE_PRODUCT_GROUP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasProductGroupRemoved: true
      };
    case GEPPurityConfigActionTypes.REMOVE_PRODUCT_GROUP_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasProductGroupRemoved: false,
        error: action.payload
      };
    case GEPPurityConfigActionTypes.UPDATE_TOGGLE_BUTTON:
      return {
        ...state,
        isLoading: true,
        error: null,
        hasUpdateToggleButton: false
      };
    case GEPPurityConfigActionTypes.UPDATE_TOGGLE_BUTTON_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        hasUpdateToggleButton: true
      };
    case GEPPurityConfigActionTypes.UPDATE_TOGGLE_BUTTON_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        hasUpdateToggleButton: false
      };
    // case GEPPurityConfigActionTypes.LOAD_LOCATIONS_SUCCESS:
    //   return {
    //     ...state,
    //     isLoading: false,
    //     location: action.payload
    //   };
    case GEPPurityConfigActionTypes.LOAD_SELETED_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allSelectedGroups: action.payload
      };
    case GEPPurityConfigActionTypes.LOAD_SELETED_PRODUCT_GROUPS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    default:
      return { ...state };
  }
}
