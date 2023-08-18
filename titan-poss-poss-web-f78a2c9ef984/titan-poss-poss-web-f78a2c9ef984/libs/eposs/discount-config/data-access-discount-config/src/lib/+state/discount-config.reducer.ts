import { createFeatureSelector } from '@ngrx/store';
import { DiscountConfigState } from './discount-config.state';
import {
  DiscountConfigAction,
  DiscountConfigActionTypes
} from './discount-config.actions';

export const discountConfigFeatureKey = 'discountConfig';

export const selectDiscountConfigState = createFeatureSelector<
  DiscountConfigState
>(discountConfigFeatureKey);

export const initialState: DiscountConfigState = {
  isLoading: null,
  error: null,
  saveLotAge: false,
  saveMaxPercentage: false,
  discountConfigList: [],
  discountDetails: null,
  totalCount: 0,
  hasSaved: false,
  hasUpdated: false,
  discountLocations: [],
  discountProductCategories: [],
  discountProductGroups: [],
  discountExcludeItems: [],
  excludeItemCodes: [],
  excludeConfigCount: 0,
  excludeItemCount: 0,
  locationCount: 0,
  productCategoryCount: 0,
  productGroupCount: 0,
  saveLocations: null,
  saveProductCategories: null,
  saveProductGroups: null,
  isExcludeThemeSaved: false,
  isExcludeTypeSaved: false,
  selectedLocations: null,
  selectedProductGroups: null,
  selectedProductCategories: null,
  bestDealDiscountCount: 0,
  bestDealDiscountList: null,
  isPublished: false,
  selectedBestDealDiscount: null,
  saveBestDealDiscounts: null,
  discountTypes: [],
  clubbingDiscountTypes: [],
  approvers: [],
  slabDetails: null,
  discDetails: [],
  isDiscDetailsSaved: false,
  // saveDiscountDetails: null,
  // editDiscountDetails: null,
  discountComponentProductGroups: [],
  discountComponentPGConfig: [],
  isDiscountComponentPGConfigSaved: false,
  discountComponentPGConfigCount: 0,
  brands: null,
  subBrands: null,
  applicableLevels: null,
  rangeTepDuration: null,
  isTsssComputed: false,
  tsssConfigCouponResponse: null,
  empowermentUpdatedDiscount: null,
  empowermentDiscounts: [],
  selectedBestDealDiscountCount: 0,
  isExcludeSchemeSaved: null,
  discountRequestList: [],
  discountRequestCount: 0,
  isDiscountSentForApproval: false,
  isDiscountApproved: null,
  faqFileUploadResponse: null,
  faqFileDownloadResponse: null,
  isEmailResent: null
};

export function DiscountConfigReducer(
  state: DiscountConfigState = initialState,
  action: DiscountConfigAction
) {
  switch (action.type) {
    case DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_LIST:
    case DiscountConfigActionTypes.LOAD_BEST_DEAL_DISCOUNT_LIST:

    case DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_LOCATION_LIST:
    case DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_DETAILS:
    case DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_CATEGORY_LIST:
    case DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_GROUP_LIST:
    case DiscountConfigActionTypes.LOAD_EXCLUDE_TYPE_LIST:
    case DiscountConfigActionTypes.LOAD_EXCLUDE_ITEM_CODES:
    case DiscountConfigActionTypes.MAP_EXCLUDE_THEME_CODES:
    case DiscountConfigActionTypes.MAP_EXCLUDE_TYPE:
    case DiscountConfigActionTypes.MAP_EXCLUDE_SCHEME_CODES:
    case DiscountConfigActionTypes.MAP_BEST_DEAL_DISCOUNTS:
    case DiscountConfigActionTypes.LOAD_DISCOUNT_TYPES:
    case DiscountConfigActionTypes.LOAD_CLUBBING_DISCOUNT_TYPES:
    case DiscountConfigActionTypes.LOAD_APPROVERS:
      // case DiscountConfigActionTypes.GET_MAPPED_LOCATIONS:
      // case DiscountConfigActionTypes.GET_MAPPED_PRODUCT_CATEGORIES:
      // case DiscountConfigActionTypes.GET_MAPPED_PRODUCT_GROUPS:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false,
        hasSaved: false,
        saveLocations: false,
        saveProductCategories: false,
        saveProductGroups: false,
        isExcludeThemeSaved: false,
        isExcludeTypeSaved: false,
        isExcludeSchemeSaved: false,
        saveBestDealDiscounts: false,
        error: null
      };
    case DiscountConfigActionTypes.LOAD_TSSS_CONFIG_DOWNLOAD_URL:
    case DiscountConfigActionTypes.FAQ_FILE_UPLOAD:
    case DiscountConfigActionTypes.LOAD_RESEND_EMAIL_STATUS:
      return {
        ...state,
        isLoading: true
      };

    case DiscountConfigActionTypes.LOAD_RESEND_EMAIL_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isEmailResent: action.payload
      };

    case DiscountConfigActionTypes.LOAD_REQUESTS:
      return {
        ...state,
        isLoading: true,
        discountRequestList: [],
        discountRequestCount: 0
      };
    case DiscountConfigActionTypes.LOAD_REQUESTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        discountRequestList: action.payload.requestList,
        discountRequestCount: action.payload.totalElements
      };
    case DiscountConfigActionTypes.PUBLISH_DISCOUNT_CONFIG:
      return {
        ...state,
        isLoading: true,
        isPublished: false
      };
    case DiscountConfigActionTypes.SEND_FOR_APPROVAL_DISCOUNT_CONFIG:
      return {
        ...state,
        isLoading: true,
        isDiscountSentForApproval: false
      };
    case DiscountConfigActionTypes.SEND_FOR_APPROVAL_DISCOUNT_CONFIG_SUCCESS:
      return {
        ...state,
        isLoading: true,
        isDiscountSentForApproval: true
      };

    case DiscountConfigActionTypes.APPROVE_DISCOUNT_CONFIG:
      return {
        ...state,
        isLoading: true,
        isDiscountApproved: null
      };
    case DiscountConfigActionTypes.APPROVE_DISCOUNT_CONFIG_SUCCESS:
      return {
        ...state,
        isLoading: true,
        isDiscountApproved: action.payload
      };

    case DiscountConfigActionTypes.COMPUTE_TSSS_CONFIG:
      return {
        ...state,
        isLoading: true,
        isTsssComputed: false
      };

    case DiscountConfigActionTypes.COMPUTE_TSSS_CONFIG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isTsssComputed: true
      };

    case DiscountConfigActionTypes.LOAD_TSSS_CONFIG_DOWNLOAD_URL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        tsssConfigCouponResponse: action.payload
      };

    case DiscountConfigActionTypes.FAQ_FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        faqFileUploadResponse: action.payload
      };

    // case DiscountConfigActionTypes.FAQ_FILE_DOWNLOAD_SUCCESS:
    //   return {
    //     ...state,
    //     isLoading: false,
    //     faqFileDownloadResponse: action.payload
    //   };

    case DiscountConfigActionTypes.PUBLISH_DISCOUNT_CONFIG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isPublished: true
      };
    case DiscountConfigActionTypes.SAVE_DISCOUNT_CONFIG_DETAILS:
    case DiscountConfigActionTypes.EDIT_DISCOUNT_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };
    case DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        discountConfigList: action.payload.discountConfigList,
        totalCount: action.payload.count,
        error: null
      };

    case DiscountConfigActionTypes.LOAD_BEST_DEAL_DISCOUNT_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSaved: false,
        bestDealDiscountList: action.payload.discountConfigList,
        bestDealDiscountCount: action.payload.count,
        error: null
      };

    case DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_DETAILS_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        discountDetails: action.payload,
        isLoading: false
      };
    case DiscountConfigActionTypes.LOAD_DISCOUNT_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        discountTypes: action.payload
      };
    case DiscountConfigActionTypes.LOAD_CLUBBING_DISCOUNT_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        clubbingDiscountTypes: action.payload
      };
    case DiscountConfigActionTypes.LOAD_APPROVERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        approvers: action.payload
      };

    case DiscountConfigActionTypes.SAVE_DISCOUNT_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        hasSaved: true,
        discountDetails: action.payload,
        isLoading: false
      };
    case DiscountConfigActionTypes.EDIT_DISCOUNT_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        hasUpdated: true,
        isLoading: false,
        saveLotAge: false,
        saveMaxPercentage: false
      };

    case DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_LOCATION_LIST_SUCCESS:
      return {
        ...state,
        hasUpdated: false,
        isLoading: false,
        discountLocations: action.payload.discountLocationList,
        locationCount: action.payload.count,
        error: null
      };
    case DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_CATEGORY_LIST_SUCCESS:
      return {
        ...state,
        hasUpdated: false,
        isLoading: false,
        discountProductCategories: action.payload.discountProductCategoryList,
        productCategoryCount: action.payload.count,
        error: null
      };
    case DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_GROUP_LIST_SUCCESS:
      return {
        ...state,
        hasUpdated: false,
        isLoading: false,
        discountProductGroups: action.payload.discountProductGroupList,
        productGroupCount: action.payload.count,
        error: null
      };
    case DiscountConfigActionTypes.LOAD_EXCLUDE_TYPE_LIST_SUCCESS:
      return {
        ...state,
        hasUpdated: false,
        isLoading: false,
        discountExcludeItems: action.payload.discountExcludeItemList,
        excludeConfigCount: action.payload.count,
        error: null
      };
    case DiscountConfigActionTypes.LOAD_EXCLUDE_ITEM_CODES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        excludeItemCodes: action.payload.discountExcludeItemList,
        excludeItemCount: action.payload.count,
        error: null
      };
    case DiscountConfigActionTypes.MAP_LOCATIONS_SUCCESS:
      return {
        ...state,
        saveLocations: true,
        isLoading: false
      };

    case DiscountConfigActionTypes.MAP_BEST_DEAL_DISCOUNTS_SUCCESS:
      return {
        ...state,
        saveBestDealDiscounts: true,
        isLoading: false
      };

    case DiscountConfigActionTypes.MAP_PRODUCT_CATEGORIES_SUCCESS:
      return {
        ...state,
        saveProductCategories: true,
        isLoading: false
      };
    case DiscountConfigActionTypes.MAP_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        saveProductGroups: true,
        isLoading: false
      };
    case DiscountConfigActionTypes.MAP_EXCLUDE_THEME_CODES_SUCCESS:
      return {
        ...state,
        isExcludeThemeSaved: true,
        isLoading: false
      };
    case DiscountConfigActionTypes.MAP_EXCLUDE_TYPE_SUCCESS:
      return {
        ...state,
        isExcludeTypeSaved: true,
        isLoading: false
      };
    case DiscountConfigActionTypes.MAP_EXCLUDE_SCHEME_CODES_SUCCESS:
      return {
        ...state,
        isExcludeSchemeSaved: true,
        isLoading: false
      };
    case DiscountConfigActionTypes.GET_MAPPED_LOCATIONS_SUCCESS:
      return {
        ...state,
        selectedLocations: action.payload,
        isLoading: false
      };
    case DiscountConfigActionTypes.GET_MAPPED_PRODUCT_CATEGORIES_SUCCESS:
      return {
        ...state,
        selectedProductCategories: action.payload,
        isLoading: false
      };
    case DiscountConfigActionTypes.GET_MAPPED_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        selectedProductGroups: action.payload,
        isLoading: false
      };
    case DiscountConfigActionTypes.GET_MAPPED_BEST_DEAL_DISCOUNTS_SUCCESS:
      return {
        ...state,
        selectedBestDealDiscount: action.payload.mappedDetails,
        selectedBestDealDiscountCount: action.payload.count,
        isLoading: false
      };
    case DiscountConfigActionTypes.LOAD_APPLICABLE_LEVELS:
    case DiscountConfigActionTypes.LOAD_SUB_BRANDS:
    case DiscountConfigActionTypes.LOAD_BRANDS:
    case DiscountConfigActionTypes.LOAD_TEP_DURATION_RANGE:
      return {
        ...state,
        error: null
      };

    case DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_LIST_FAILURE: {
      return {
        discountConfigList: [...state.discountConfigList],
        isLoading: false,
        hasSaved: false,
        hasUpdated: false,
        isPublished: false
      };
    }
    case DiscountConfigActionTypes.LOAD_BEST_DEAL_DISCOUNT_LIST_FAILURE:
    case DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_DETAILS_FAILURE:
    case DiscountConfigActionTypes.SAVE_DISCOUNT_CONFIG_DETAILS_FAILURE:
    case DiscountConfigActionTypes.EDIT_DISCOUNT_CONFIG_DETAILS_FAILURE:
    case DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_LOCATION_LIST_FAILURE:
    case DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_GROUP_LIST_FAILURE:
    case DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_CATEGORY_LIST_FAILURE:
    case DiscountConfigActionTypes.SEND_FOR_APPROVAL_DISCOUNT_CONFIG_FAILURE:
    case DiscountConfigActionTypes.LOAD_EXCLUDE_TYPE_LIST_FAILURE:
    case DiscountConfigActionTypes.LOAD_EXCLUDE_ITEM_CODES_FAILURE:
    case DiscountConfigActionTypes.APPROVE_DISCOUNT_CONFIG_FAILURE:
    case DiscountConfigActionTypes.GET_MAPPED_PRODUCT_GROUPS_FAILURE:
    case DiscountConfigActionTypes.GET_MAPPED_LOCATIONS_FAILURE:
    case DiscountConfigActionTypes.GET_MAPPED_PRODUCT_CATEGORIES_FAILURE:
    case DiscountConfigActionTypes.PUBLISH_DISCOUNT_CONFIG_FAILURE:
    case DiscountConfigActionTypes.GET_MAPPED_BEST_DEAL_DISCOUNTS_FAILURE:

    case DiscountConfigActionTypes.LOAD_DISCOUNT_TYPES_FAILURE:
    case DiscountConfigActionTypes.LOAD_CLUBBING_DISCOUNT_TYPES_FAILURE:
    case DiscountConfigActionTypes.LOAD_APPROVERS_FAILURE:
    case DiscountConfigActionTypes.LOAD_SUB_BRANDS_FAILURE:
    case DiscountConfigActionTypes.LOAD_BRANDS_FAILURE:
    case DiscountConfigActionTypes.LOAD_APPLICABLE_LEVELS_FAILURE:
    case DiscountConfigActionTypes.LOAD_TEP_DURATION_RANGE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        hasSaved: false,
        hasUpdated: false,
        isPublished: false
      };

    case DiscountConfigActionTypes.MAP_LOCATIONS_FAILURE:
      return {
        ...state,
        discountLocations: [...state.discountLocations],
        error: action.payload,
        isLoading: false,
        hasSaved: false,
        hasUpdated: false,
        isPublished: false
      };
    case DiscountConfigActionTypes.MAP_PRODUCT_CATEGORIES_FAILURE:
      return {
        ...state,
        discountProductCategories: [...state.discountProductCategories],
        error: action.payload,
        isLoading: false,
        hasSaved: false,
        hasUpdated: false,
        isPublished: false
      };
    case DiscountConfigActionTypes.MAP_PRODUCT_GROUPS_FAILURE:
      return {
        ...state,
        discountProductGroups: [...state.discountProductGroups],
        error: action.payload,
        isLoading: false,
        hasSaved: false,
        hasUpdated: false,
        isPublished: false
      };
    case DiscountConfigActionTypes.MAP_EXCLUDE_THEME_CODES_FAILURE:
    case DiscountConfigActionTypes.MAP_EXCLUDE_TYPE_FAILURE:
    case DiscountConfigActionTypes.MAP_EXCLUDE_SCHEME_CODES_FAILURE:
      return {
        ...state,
        discountExcludeItems: [...state.discountExcludeItems],
        error: action.payload,
        isLoading: false,
        hasSaved: false,
        hasUpdated: false,
        isPublished: false
      };

    case DiscountConfigActionTypes.SAVE_DISCOUNT_DETAILS_FAILURE:
      return {
        ...state,
        discDetails: [...state.discDetails],
        error: action.payload,
        isLoading: false,
        hasSaved: false,
        hasUpdated: false,
        isPublished: false
      };
    case DiscountConfigActionTypes.UPDATE_EMPOWERMENT_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        empowermentUpdatedDiscount: { ...state.empowermentUpdatedDiscount }
      };
    case DiscountConfigActionTypes.MAP_BEST_DEAL_DISCOUNTS_FAILURE:
      return {
        ...state,
        discDetails: [...state.discDetails],
        error: action.payload,
        isLoading: false,
        hasSaved: false,
        hasUpdated: false,
        isPublished: false
      };
    case DiscountConfigActionTypes.LOAD_APPLICABLE_LEVELS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        applicableLevels: action.payload
      };
    case DiscountConfigActionTypes.LOAD_SUB_BRANDS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        subBrands: action.payload
      };
    case DiscountConfigActionTypes.LOAD_BRANDS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        brands: action.payload
      };
    case DiscountConfigActionTypes.LOAD_TEP_DURATION_RANGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        rangeTepDuration: action.payload
      };
    case DiscountConfigActionTypes.SAVE_SLAB_DETAILS:
    case DiscountConfigActionTypes.SAVE_EMPOWERMENT_DETAILS:
      return {
        ...state,
        isLoading: true,
        isDiscDetailsSaved: false,
        error: null
      };

    case DiscountConfigActionTypes.SAVE_SLAB_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        slabDetails: action.payload
      };

    case DiscountConfigActionTypes.SAVE_EMPOWERMENT_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        empowermentUpdatedDiscount: action.payload,
        isDiscDetailsSaved: true
      };

    case DiscountConfigActionTypes.SAVE_SLAB_DETAILS_FAILURE:
    case DiscountConfigActionTypes.LOAD_DISCOUNT_DETAILS_FAILURE:
    case DiscountConfigActionTypes.COMPUTE_TSSS_CONFIG_FAILURE:
    case DiscountConfigActionTypes.LOAD_TSSS_CONFIG_DOWNLOAD_URL_FAILURE:
    case DiscountConfigActionTypes.SAVE_EMPOWERMENT_DETAILS_FAILURE:
    case DiscountConfigActionTypes.LOAD_EMPOWERMENT_DISCOUNT_DETAILS_FAILURE:
    case DiscountConfigActionTypes.LOAD_REQUESTS_FAILURE:
    case DiscountConfigActionTypes.FAQ_FILE_UPLOAD_FAILURE:
    case DiscountConfigActionTypes.FAQ_FILE_DOWNLOAD_FAILURE:
    case DiscountConfigActionTypes.LOAD_RESEND_EMAIL_STATUS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case DiscountConfigActionTypes.SAVE_DISCOUNT_DETAILS:
    case DiscountConfigActionTypes.UPDATE_EMPOWERMENT_DETAILS:
      return {
        ...state,
        isLoading: true,
        error: null,
        isDiscDetailsSaved: false
      };

    case DiscountConfigActionTypes.LOAD_DISCOUNT_DETAILS:
    case DiscountConfigActionTypes.LOAD_EMPOWERMENT_DISCOUNT_DETAILS:
      return {
        ...state,
        isLoading: true,
        error: null
        // discDetails: []
      };

    case DiscountConfigActionTypes.SAVE_DISCOUNT_DETAILS_SUCCESS:
    case DiscountConfigActionTypes.UPDATE_EMPOWERMENT_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isDiscDetailsSaved: true,
        empowermentUpdatedDiscount: action.payload
      };

    case DiscountConfigActionTypes.LOAD_EMPOWERMENT_DISCOUNT_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        empowermentDiscounts: action.payload
      };

    case DiscountConfigActionTypes.LOAD_DISCOUNT_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        discDetails: action.payload
      };

    case DiscountConfigActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID:
      return {
        ...state,
        isLoading: true,
        discountComponentProductGroups: null
      };

    case DiscountConfigActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case DiscountConfigActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        discountComponentProductGroups: action.payload
      };

    case DiscountConfigActionTypes.UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID:
      return {
        ...state,
        isLoading: true,
        hasProductsUpdated: false,
        error: null
      };

    case DiscountConfigActionTypes.UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasProductsUpdated: true
      };

    case DiscountConfigActionTypes.UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID_FAILURE:
      return {
        ...state,
        hasProductsUpdated: false,
        isLoading: null,
        error: action.payload
      };

    case DiscountConfigActionTypes.LOAD_DISCOUNT_COMPONENT_PG_CONFIG:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case DiscountConfigActionTypes.LOAD_DISCOUNT_COMPONENT_PG_CONFIG_SUCCESS:
      console.log(action.payload.data, 'reducer data success');
      return {
        ...state,
        isLoading: false,
        discountComponentPGConfig: action.payload.data,
        discountComponentPGConfigCount: action.payload.count
      };

    case DiscountConfigActionTypes.UPDATE_DISCOUNT_COMPONENT_PG_CONFIG:
      return {
        ...state,
        isLoading: true,
        isDiscountComponentPGConfigSaved: false
      };

    case DiscountConfigActionTypes.UPDATE_DISCOUNT_COMPONENT_PG_CONFIG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isDiscountComponentPGConfigSaved: true
      };

    case DiscountConfigActionTypes.LOAD_DISCOUNT_COMPONENT_PG_CONFIG_FAILURE:
    case DiscountConfigActionTypes.UPDATE_DISCOUNT_COMPONENT_PG_CONFIG_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case DiscountConfigActionTypes.RESET_DISCOUNTS: {
      return {
        isLoading: null,
        error: null,
        discountConfigList: [],
        discountDetails: null,
        totalCount: 0,
        hasSaved: false,
        hasUpdated: false,
        discountLocations: [],
        discountProductCategories: [],
        discountProductGroups: [],
        discountExcludeItems: [],
        excludeItemCodes: [],
        excludeItemCount: 0,
        excludeConfigCount: 0,
        locationCount: 0,
        productCategoryCount: 0,
        productGroupCount: 0,
        saveLocations: null,
        saveProductCategories: null,
        saveProductGroups: null,
        isExcludeThemeSaved: false,
        isExcludeTypeSaved: false,
        isExcludeSchemeSaved: null,
        selectedLocations: null,
        selectedProductGroups: null,
        selectedProductCategories: null,
        bestDealDiscountCount: 0,
        bestDealDiscountList: null,
        isPublished: false,
        saveBestDealDiscounts: false,
        slabDetails: null,
        discDetails: [],
        isDiscDetailsSaved: false,
        isTsssComputed: false,
        isDiscountSentForApproval: false,
        isDiscountApproved: null,
        tsssConfigCouponResponse: null,
        empowermentUpdatedDiscount: null,
        empowermentDiscounts: [],
        isEmailResent: null
      };
    }
    // case DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_CATEGORY_LIST_FAILURE:
    //   return {
    //     ...state,
    //     isLoading: false,
    //     error: null
    //   };
    default:
      return { ...state };
  }
}
