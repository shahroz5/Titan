import { createFeatureSelector } from '@ngrx/store';
import {
  RivaahConfigurationAction,
  RivaahConfigurationActionTypes
} from './rivaah-configuration.actions';
import { RivaahConfigurationState } from './rivaah-configuration.state';

export const RivaahConfigurationFeatureKey = 'RivaahConfiguration';

export const selectRivaahConfigurationState = createFeatureSelector<
  RivaahConfigurationState
>(RivaahConfigurationFeatureKey);

export const initialState: RivaahConfigurationState = {
  isLoading: false,
  hasUpdated: false,
  error: null,
  isCouponSaved: false,
  couponConfig: null,
  totalElements: null,
  rivaahEligibilityRes: [],
  isRivaElibilityUpdated: null,
  isRivaElibilityCreated: null,
  isRivaElibilityDeleted: null,
  isRivaElibilityToggled: null,
  productGroups: null,
  productCategory: null,
  mappedProductCategory: null,
  rivaahLocations: [],
  locationCount: 0,
  hasProductsUpdated: false,
  savedLocations: null,
  updatedLocations: null,
  deletedLocations: null,
  loadMappedProductGroup: null,
  selectedLocations: null,
};

export function RivaahConfigurationReducer(
  state: RivaahConfigurationState = initialState,
  action: RivaahConfigurationAction
) {
  switch (action.type) {
    case RivaahConfigurationActionTypes.LOAD_COUPON_CONFIGURATION:
    case RivaahConfigurationActionTypes.LOAD_RIVAAH_ELIGIBILITY_CONFIGURATION:
    case RivaahConfigurationActionTypes.LOAD_PRODUCT_CATEGORY:
    case RivaahConfigurationActionTypes.LOAD_MAPPED_PRODUCT_CATEGORY:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case RivaahConfigurationActionTypes.CREATE_RIVAAH_ELIGIBILITY_CONFIGURATION:
      return {
        ...state,
        isRivaElibilityCreated: false,
        isLoading: true,
        error: null
      };
    case RivaahConfigurationActionTypes.UPDATE_RIVAAH_ELIGIBILITY_CONFIGURATION:
      return {
        ...state,
        isRivaElibilityUpdated: false,
        isLoading: true,
        error: null
      };
    case RivaahConfigurationActionTypes.DELETE_RIVAAH_ELIGIBILITY_CONFIGURATION:
      return {
        ...state,
        isRivaElibilityDeleted: false,
        isLoading: true,
        error: null
      };
    case RivaahConfigurationActionTypes.TOGGLE_RIVAAH_ELIGIBILITY_CONFIGURATION_STATUS:
      return {
        ...state,
        isRivaElibilityToggled: false,
        isLoading: true,
        error: null
      };
    case RivaahConfigurationActionTypes.LOAD_COUPON_CONFIGURATION_SUCCESSS:
      return {
        ...state,
        isLoading: false,
        couponConfig: action.payload
      };
    case RivaahConfigurationActionTypes.LOAD_COUPON_CONFIGURATION_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };

    case RivaahConfigurationActionTypes.UPDATE_COUPON_CONFIGURATION:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false,
        isCouponSaved: false,
        couponConfig: null,
        error: null
      };

    case RivaahConfigurationActionTypes.UPDATE_COUPON_CONFIGURATION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true,
        isCouponSaved: true,
        couponConfig: action.payload
      };

    case RivaahConfigurationActionTypes.UPDATE_COUPON_CONFIGURATION_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasUpdated: false,
        isCouponSaved: false,
        error: action.payload
      };

    case RivaahConfigurationActionTypes.LOAD_RIVAAH_ELIGIBILITY_CONFIGURATION_SUCCESSS:
      return {
        ...state,
        isLoading: false,
        rivaahEligibilityRes: action.payload.rivaahEligibilityConfig,
        totalElements: action.payload.totalElements
      };
    case RivaahConfigurationActionTypes.CREATE_RIVAAH_ELIGIBILITY_CONFIGURATION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isRivaElibilityCreated: true
      };
    case RivaahConfigurationActionTypes.UPDATE_RIVAAH_ELIGIBILITY_CONFIGURATION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isRivaElibilityUpdated: true
      };
    case RivaahConfigurationActionTypes.DELETE_RIVAAH_ELIGIBILITY_CONFIGURATION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isRivaElibilityDeleted: true
      };
    case RivaahConfigurationActionTypes.TOGGLE_RIVAAH_ELIGIBILITY_CONFIGURATION_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isRivaElibilityToggled: true
      };
    case RivaahConfigurationActionTypes.LOAD_RIVAAH_ELIGIBILITY_CONFIGURATION_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case RivaahConfigurationActionTypes.CREATE_RIVAAH_ELIGIBILITY_CONFIGURATION_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isRivaElibilityCreated: false
      };
    case RivaahConfigurationActionTypes.UPDATE_RIVAAH_ELIGIBILITY_CONFIGURATION_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isRivaElibilityUpdated: false
      };
    case RivaahConfigurationActionTypes.DELETE_RIVAAH_ELIGIBILITY_CONFIGURATION_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isRivaElibilityDeleted: false
      };
    case RivaahConfigurationActionTypes.TOGGLE_RIVAAH_ELIGIBILITY_CONFIGURATION_STATUS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isRivaElibilityToggled: false
      };
    case RivaahConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_PRODUCT_ID:
      return {
        ...state,
        isLoading: true,
        productGroups: null,
        error: null
      };
    case RivaahConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_PRODUCT_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productGroups: action.payload
      };
    case RivaahConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_PRODUCT_ID_FAILURE:
        return {
          ...state,
          isLoading: false,
          error: action.payload,
          loadMappedProdcutGroup: false,
          productGroups: null
        };
    case RivaahConfigurationActionTypes.LOAD_PRODUCT_CATEGORY_SUCCESS:
      return {
        ...state,
        productCategory: action.payload,
        isLoading: false
      };
    case RivaahConfigurationActionTypes.LOAD_PRODUCT_CATEGORY_FAILURE:
    case RivaahConfigurationActionTypes.LOAD_MAPPED_PRODUCT_CATEGORY_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case RivaahConfigurationActionTypes.LOAD_MAPPED_PRODUCT_CATEGORY_SUCCESS:
      return {
        ...state,
        mappedProductCategory: action.payload,
        isLoading: false
      };
    case RivaahConfigurationActionTypes.UPDATE_PRODUCT_GROUPS_BY_PRODUCT_ID:
      return {
        ...state,
        isLoading: true,
        hasProductsUpdated: false,
        error: null
      };
    case RivaahConfigurationActionTypes.UPDATE_PRODUCT_GROUPS_BY_PRODUCT_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasProductsUpdated: true
      };
    case RivaahConfigurationActionTypes.UPDATE_PRODUCT_GROUPS_BY_PRODUCT_ID_FAILURE:
      return {
        ...state,
        hasProductsUpdated: false,
        isLoading: null,
        error: action.payload,
        productGroups: null
      };
    case RivaahConfigurationActionTypes.LOAD_RIVAAH_MAPPED_LOCATION_LIST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case RivaahConfigurationActionTypes.LOAD_RIVAAH_MAPPED_LOCATION_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        rivaahLocations: action.payload.rivaahLocationList,
        locationCount: action.payload.count,
        error: null
      };
    case RivaahConfigurationActionTypes.SAVE_RIVAAH_LOCATIONS:
      return {
        ...state,
        savedLocations: false,
        isLoading: false,
        error: null
      };
    case RivaahConfigurationActionTypes.UPDATE_RIVAAH_LOCATIONS:
      return {
        ...state,
        updatedLocations: false,
        isLoading: false,
        error: null
      };
    case RivaahConfigurationActionTypes.DELETE_RIVAAH_LOCATIONS:
      return {
        ...state,
        deletedLocations: false,
        isLoading: false,
        error: null
      };
    case RivaahConfigurationActionTypes.SAVE_RIVAAH_LOCATIONS_SUCCESS:
      return {
        ...state,
        savedLocations: true,
        isLoading: false
      };
    case RivaahConfigurationActionTypes.UPDATE_RIVAAH_LOCATIONS_SUCCESS:
      return {
        ...state,
        updatedLocations: true,
        isLoading: false
      };
    case RivaahConfigurationActionTypes.DELETE_RIVAAH_LOCATIONS_SUCCESS:
      return {
        ...state,
        deletedLocations: true,
        isLoading: false
      };
    case RivaahConfigurationActionTypes.GET_MAPPED_LOCATIONS_SUCCESS:
      return {
        ...state,
        selectedLocations: action.payload,
        isLoading: false
      };
    case RivaahConfigurationActionTypes.LOAD_RIVAAH_MAPPED_LOCATION_LIST_FAILURE:
    case RivaahConfigurationActionTypes.GET_MAPPED_LOCATIONS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case RivaahConfigurationActionTypes.SAVE_RIVAAH_LOCATIONS_FAILURE:
      return {
        ...state,
        rivaahLocations: [...state.rivaahLocations],
        error: action.payload,
        isLoading: false,
      };
    case RivaahConfigurationActionTypes.UPDATE_RIVAAH_LOCATIONS_FAILURE:
        return {
          ...state,
          rivaahLocations: [...state.rivaahLocations],
          error: action.payload,
          isLoading: false,
        };
    case RivaahConfigurationActionTypes.DELETE_RIVAAH_LOCATIONS_FAILURE:
      return {
        ...state,
        rivaahLocations: [...state.rivaahLocations],
        error: action.payload,
        isLoading: false,
      };
    case RivaahConfigurationActionTypes.LOAD_RESET:
      return {
        isLoading: null,
        error: null,
        isRivaElibilityCreated: null,
        isRivaElibilityUpdated: null,
        isRivaElibilityDeleted: null,
        isRivaElibilityToggled: null,
        rivaahEligibilityRes: [],
        hasUpdated: null,
        couponConfig: null,
        isCouponSaved: null,
        rivaahLocations: [],
        locationCount: 0,
        productGroups: null,
        savedLocations: null,
        updatedLocations: null,
        deletedLocations: null,
        selectedLocations: null,
        hasProductsUpdated: false,
        productCategory: null,
        mappedProductCategory: null,
      };
    default: {
      return { ...state };
    }
  }
}
