import { createFeatureSelector } from '@ngrx/store';
import { FocConfigurationState } from './foc-config-state';
import {
  FocConfigurationActions,
  FocConfigurationActionTypes
} from './foc-config-actions';
import { focSchemeBasedEnums, tabTypeEnums } from '@poss-web/shared/models';

export const focConfigurationKey = 'focConfiguration';
export const selectFocConfigurationState = createFeatureSelector<
  FocConfigurationState
>(focConfigurationKey);
export const initialState: FocConfigurationState = {
  focConfigList: null,
  isLoading: null,
  error: null,
  schemeDetails: null,
  hasSaved: null,
  hasUpdated: null,
  totalElements: null,
  rangeWeight: [],
  valueBasedVariantDetails: [],
  weightBasedVariantDetails: [],
  valueBasedVariantDetailsGoldStandard: [],
  valueBasedVariantDetailsGoldSlab: [],
  weightBasedVariantDetailsGoldStandard: [],
  weightBasedVariantDetailsGoldSlab: [],
  valueBasedVariantDetailsOthersStandard: [],
  valueBasedVariantDetailsOthersSlab: [],
  weightBasedVariantDetailsOthersStandard: [],
  weightBasedVariantDetailsOthersSlab: [],
  productGroups: null,
  focItems: [],
  locationList: [],
  isLocationUpdated: null,
  itemCodes: [],
  hasSavedFocItems: false,
  mappedFocItems: [],
  totalFocItems: 0,
  schemeDetailsById: null,
  hasProductsUpdated: false,
  totalLocation: null,
  loadMappedProdcutGroup: null,
  isPublished: null,
  allSelectedItemCodes: null,
  allSelectedLocationCodes: null,
  focTypeSate: {
    valueBasedGoldCoin: focSchemeBasedEnums.STANDARD,
    valueBasedOthers: focSchemeBasedEnums.STANDARD,
    weightBasedGoldCoin: focSchemeBasedEnums.STANDARD,
    weightBasedOthers: focSchemeBasedEnums.STANDARD
  }
};

export function focConfigurationReducer(
  state: FocConfigurationState = initialState,
  action: FocConfigurationActions
) {
  switch (action.type) {
    case FocConfigurationActionTypes.PUBLISH_FOC_SCHEME:
    case FocConfigurationActionTypes.SEARCH_CONFIG_BY_SCHEME_NAME:
    case FocConfigurationActionTypes.LOAD_FOC_CONFIGURATION_LIST:
    case FocConfigurationActionTypes.LOAD_RANGE_WEIGHT:
    case FocConfigurationActionTypes.SAVE_FOC_SCHEME_CONFIGURATION:
    case FocConfigurationActionTypes.LOAD_FOC_SCHEME_CONFIGURATION_BY_CONFIG_ID:
    case FocConfigurationActionTypes.LOAD_MAPPED_LOCATIONS_BY_ID:
    case FocConfigurationActionTypes.LOAD_FOC_ITEM_CODES:
    case FocConfigurationActionTypes.LOAD_MAPPED_FOC_ITEMS_BY_ID:
    case FocConfigurationActionTypes.SEARCH_FOC_ITEM:
    case FocConfigurationActionTypes.SEARCH_LOCATION_CODE:
    case FocConfigurationActionTypes.LOAD_ALL_SELECTED_ITEM_CODES:
    case FocConfigurationActionTypes.LOAD_ALL_SELECTED_LOCATION_CODES:
      return {
        ...state,
        isLoading: true
      };

    case FocConfigurationActionTypes.PUBLISH_FOC_SCHEME_SUCCESS:
      return {
        ...state,
        isPublished: true,
        isLoading: false
      };
    case FocConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID:
      return {
        ...state,
        isLoading: true,
        productGroups: null
      };

    case FocConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        loadMappedProdcutGroup: false,
        productGroups: null
      };
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_BY_ID:
      return {
        ...state,
        isLoading: true,
        valueBasedVariantDetails: [],
        weightBasedVariantDetails: []
      };
    case FocConfigurationActionTypes.SAVE_VARIANT_DETAILS:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };
    case FocConfigurationActionTypes.LOAD_MAPPED_LOCATIONS_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        locationList: action.payload.locationList,
        totalLocation: action.payload.totalLocations
      };

    case FocConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productGroups: action.payload
      };
    case FocConfigurationActionTypes.LOAD_RANGE_WEIGHT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        rangeWeight: action.payload
      };
    case FocConfigurationActionTypes.LOAD_RANGE_WEIGHT_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };

    case FocConfigurationActionTypes.SEARCH_CONFIG_BY_SCHEME_NAME_SUCCESS:
    case FocConfigurationActionTypes.LOAD_FOC_CONFIGURATION_LIST_SUCCESS:
      return {
        ...state,
        focConfigList: action.payload.focConfigList,
        totalElements: action.payload.totalElements,
        isLoading: false
      };
    case FocConfigurationActionTypes.UPDATE_LOCATIONS_BY_ID_FAILURE:
      return {
        ...state,
        locationList: [...state.locationList],
        isLoading: null,
        error: action.payload,
        isLocationUpdated: false
      };
    case FocConfigurationActionTypes.UPDATE_FOC_SCHEME_CONFIGURATION_FAILURE:
      return {
        ...state,
        hasUpdated: false,
        isLoading: null,
        error: action.payload
      };
    case FocConfigurationActionTypes.UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID_FAILURE:
      return {
        ...state,
        hasProductsUpdated: false,
        isLoading: null,
        error: action.payload,
        productGroups: null
      };

    case FocConfigurationActionTypes.LOAD_MAPPED_LOCATIONS_BY_ID_FAILURE:

    case FocConfigurationActionTypes.SAVE_VARIANT_DETAILS_FAILURE:
    case FocConfigurationActionTypes.SEARCH_CONFIG_BY_SCHEME_NAME_FAILURE:
    case FocConfigurationActionTypes.SAVE_FOC_SCHEME_CONFIGURATION_FAILURE:
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_BY_ID_FAILURE:
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_STANDARD_BY_ID_FAILURE:
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_SLAB_BY_ID_FAILURE:
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_STANDARD_BY_ID_FAILURE:
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_SLAB_BY_ID_FAILURE:
    case FocConfigurationActionTypes.LOAD_FOC_SCHEME_CONFIGURATION_BY_CONFIG_ID_FAILURE:
    case FocConfigurationActionTypes.LOAD_FOC_CONFIGURATION_LIST_FAILURE:
    case FocConfigurationActionTypes.LOAD_FOC_ITEM_CODES_FAILURE:
    case FocConfigurationActionTypes.LOAD_MAPPED_FOC_ITEMS_BY_ID_FAILURE:
    case FocConfigurationActionTypes.SEARCH_FOC_ITEM_FAILURE:
    case FocConfigurationActionTypes.SEARCH_LOCATION_CODE_FAILURE:
    case FocConfigurationActionTypes.PUBLISH_FOC_SCHEME_FAILURE:
    case FocConfigurationActionTypes.LOAD_ALL_SELECTED_ITEM_CODES_FAILURE:
    case FocConfigurationActionTypes.LOAD_ALL_SELECTED_LOCATION_CODES_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null
      };
    case FocConfigurationActionTypes.LOAD_FOC_ITEM_CODES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        itemCodes: action.payload
      };

    case FocConfigurationActionTypes.LOAD_FOC_SCHEME_CONFIGURATION_BY_CONFIG_ID_SUCCESS:
      return {
        ...state,
        schemeDetailsById: action.payload,
        isLoading: false
      };

    case FocConfigurationActionTypes.SAVE_FOC_SCHEME_CONFIGURATION_SUCCESS:
      return {
        ...state,
        hasSaved: true,
        schemeDetails: action.payload,
        isLoading: false
      };
    case FocConfigurationActionTypes.SAVE_VARIANT_DETAILS_SUCCESS:
      return {
        ...state,
        hasUpdated: true,
        isLoading: false,
        valueBasedVariantDetails: action.payload.valueBasedVariantDetails,
        weightBasedVariantDetails: action.payload.weightBasedVariantDetails
      };
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        valueBasedVariantDetails: action.payload.valueBasedVariantDetails,
        weightBasedVariantDetails: action.payload.weightBasedVariantDetails
      };
    case FocConfigurationActionTypes.UPDATE_LOCATIONS_BY_ID:
      return {
        ...state,
        isLoading: true,
        isLocationUpdated: false
      };
    case FocConfigurationActionTypes.UPDATE_FOC_SCHEME_CONFIGURATION:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };
    case FocConfigurationActionTypes.UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID:
      return {
        ...state,
        isLoading: true,
        hasProductsUpdated: false,
        error: null
      };

    case FocConfigurationActionTypes.UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasProductsUpdated: true
        //productGroups: action.payload
      };
    case FocConfigurationActionTypes.UPDATE_LOCATIONS_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLocationUpdated: true
      };
    case FocConfigurationActionTypes.UPDATE_FOC_SCHEME_CONFIGURATION_SUCCESS:
      return {
        ...state,
        hasUpdated: true,
        isLoading: false,
        schemeDetails: action.payload
      };

    case FocConfigurationActionTypes.LOAD_FOC_TYPE_STATE:
      return {
        ...state,
        focTypeSate: {
          valueBasedGoldCoin:
            action.payload.tabName === tabTypeEnums.VALUE_BASED_GOLD_COIN
              ? action.payload.focType
              : state.focTypeSate.valueBasedGoldCoin,
          valueBasedOthers:
            action.payload.tabName === tabTypeEnums.VALUE_BASED_OTHERS
              ? action.payload.focType
              : state.focTypeSate.valueBasedOthers,
          weightBasedGoldCoin:
            action.payload.tabName === tabTypeEnums.WEIGHT_BASED_GOLD_COIN
              ? action.payload.focType
              : state.focTypeSate.weightBasedGoldCoin,
          weightBasedOthers:
            action.payload.tabName === tabTypeEnums.WEIGHT_BASED_OTHERS
              ? action.payload.focType
              : state.focTypeSate.weightBasedOthers
        }
      };

    case FocConfigurationActionTypes.LOAD_RESET:
      return {
        ...state,
        focConfigList: null,
        isLoading: null,
        error: null,
        schemeDetails: null,
        hasSaved: null,
        hasUpdated: null,
        totalElements: null,
        rangeWeight: [],
        valueBasedVariantDetails: [],
        weightBasedVariantDetails: [],
        productGroups: null,
        focItems: [],
        locationList: [],
        isLocationUpdated: null,
        itemCodes: [],
        hasSavedFocItems: false,
        mappedFocItems: [],
        totalFocItems: 0,
        schemeDetailsById: null,
        hasProductsUpdated: false,
        totalLocation: null,
        loadMappedProdcutGroup: null,
        isPublished: null,
        allSelectedItemCodes: null,
        allSelectedLocationCodes: null
      };

    case FocConfigurationActionTypes.SAVE_FOC_ITEMS:
      return {
        ...state,
        isLoading: true,
        hasSavedFocItems: false
      };
    case FocConfigurationActionTypes.SAVE_FOC_ITEMS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSavedFocItems: true
      };
    case FocConfigurationActionTypes.LOAD_MAPPED_FOC_ITEMS_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        totalFocItems: action.payload.totalElements,
        mappedFocItems: action.payload.items
      };
    case FocConfigurationActionTypes.SAVE_FOC_ITEMS_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasSavedFocItems: false,
        error: action.payload
      };
    case FocConfigurationActionTypes.SEARCH_FOC_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        mappedFocItems: action.payload
      };
    case FocConfigurationActionTypes.SEARCH_LOCATION_CODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        locationList: action.payload.locationList,
        totalLocation: 1
      };

    //View specific
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_STANDARD_BY_ID:
      return {
        ...state,
        isLoading: true,
        valueBasedVariantDetailsGoldStandard: []
      };
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_STANDARD_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        valueBasedVariantDetailsGoldStandard:
          action.payload.valueBasedVariantDetails
      };
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_SLAB_BY_ID:
      return {
        ...state,
        isLoading: true,
        valueBasedVariantDetailsGoldSlab: []
      };
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_SLAB_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        valueBasedVariantDetailsGoldSlab:
          action.payload.valueBasedVariantDetails
      };
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_OTHERS_STANDARD_BY_ID:
      return {
        ...state,
        isLoading: true,
        valueBasedVariantDetailsOthersStandard: []
      };
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_OTHERS_STANDARD_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        valueBasedVariantDetailsOthersStandard:
          action.payload.valueBasedVariantDetails
      };
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_OTHERS_SLAB_BY_ID:
      return {
        ...state,
        isLoading: true,
        valueBasedVariantDetailsOthersSlab: []
      };
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_OTHERS_SLAB_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        valueBasedVariantDetailsOthersSlab:
          action.payload.valueBasedVariantDetails
      };
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_STANDARD_BY_ID:
      return {
        ...state,
        isLoading: true,
        weightBasedVariantDetailsGoldStandard: []
      };
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_STANDARD_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        weightBasedVariantDetailsGoldStandard:
          action.payload.weightBasedVariantDetails
      };
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_SLAB_BY_ID:
      return {
        ...state,
        isLoading: true,
        weightBasedVariantDetailsGoldSlab: []
      };
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_SLAB_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        weightBasedVariantDetailsGoldSlab:
          action.payload.weightBasedVariantDetails
      };

    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_STANDARD_BY_ID:
      return {
        ...state,
        isLoading: true,
        weightBasedVariantDetailsOthersStandard: []
      };
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_STANDARD_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        weightBasedVariantDetailsOthersStandard:
          action.payload.weightBasedVariantDetails
      };
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_SLAB_BY_ID:
      return {
        ...state,
        isLoading: true,
        weightBasedVariantDetailsOthersSlab: []
      };
    case FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_SLAB_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        weightBasedVariantDetailsOthersSlab:
          action.payload.weightBasedVariantDetails
      };
    case FocConfigurationActionTypes.LOAD_ALL_SELECTED_ITEM_CODES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allSelectedItemCodes: action.payload
      };
    case FocConfigurationActionTypes.LOAD_ALL_SELECTED_LOCATION_CODES_SUCCESS:
      return {
        ...state,
        allSelectedLocationCodes: action.payload,
        isLoading: false
      };
    //View specific ends

    default:
      return {
        ...state
      };
  }
}
