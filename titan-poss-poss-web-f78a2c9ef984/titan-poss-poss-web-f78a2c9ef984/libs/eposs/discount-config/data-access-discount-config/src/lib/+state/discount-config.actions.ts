import { Action } from '@ngrx/store';
import {
  BrandSummary,
  CustomErrors,
  DiscounExcludeItemListPayload,
  DiscountBestDealListPayload,
  DiscountConfigSuccessList,
  DiscountExcludeItemSuccessList,
  DiscountLocationListPayload,
  DiscountLocationSuccessList,
  DiscountProductCategoryListPayload,
  DiscountProductCategorySuccessList,
  DiscountProductGroupListPayload,
  DiscountProductGroupSuccessList,
  discountWorkflowpayload,
  DisountConfigListPayload,
  FaqFileUploadResponse,
  FaqRequestPaylaod,
  Lov,
  MappedBestDealDiscountSuccessList,
  MappedDetails,
  NewDiscountApplicableConfig,
  NewDiscountDetails,
  ProductGroupMappingOption,
  RequestLists,
  RequestPayload,
  SaveBestDealDiscountPayload,
  SaveDiscountLocationsPayload,
  SaveDiscountProductCategoryPayload,
  SaveDiscountProductGroupPayload,
  SaveDiscountSchemesPayload,
  SaveDiscountThemesPayload,
  SaveExcludeTypePayload,
  TSSSRequestPayload
} from '@poss-web/shared/models';

export enum DiscountConfigActionTypes {
  LOAD_DISCOUNT_CONFIG_LIST = '[discount-configuration]  Load Discount Config List',
  LOAD_DISCOUNT_CONFIG_LIST_SUCCESS = '[discount-configuration]  Load Discount Config List Success',
  LOAD_DISCOUNT_CONFIG_LIST_FAILURE = '[discount-configuration]  Load Discount Config List Failure',

  LOAD_DISCOUNT_CONFIG_DETAILS = '[discount-configuration]  Load Discount Config Details',
  LOAD_DISCOUNT_CONFIG_DETAILS_SUCCESS = '[discount-configuration]  Load Discount Config Details Success',
  LOAD_DISCOUNT_CONFIG_DETAILS_FAILURE = '[discount-configuration]  Load Discount Config Details Failure',

  SAVE_DISCOUNT_CONFIG_DETAILS = '[discount-configuration]  Save Discount Config Details',
  SAVE_DISCOUNT_CONFIG_DETAILS_SUCCESS = '[discount-configuration]  Save Discount Config Details Success',
  SAVE_DISCOUNT_CONFIG_DETAILS_FAILURE = '[discount-configuration]  Save Discount Config Details Failure',

  EDIT_DISCOUNT_CONFIG_DETAILS = '[discount-configuration]  Update Discount Config Details',
  EDIT_DISCOUNT_CONFIG_DETAILS_SUCCESS = '[discount-configuration]  Update Discount Config Details Success',
  EDIT_DISCOUNT_CONFIG_DETAILS_FAILURE = '[discount-configuration]  Update Discount Config Details Failure',

  // SAVE_DISC_APPLICABLE_DETAILS = '[discount-configuration]   Discount Applicable details',
  // SAVE_DISC_APPLICABLE_DETAILS_SUCCESS = '[discount-configuration]   Discount Applicable details Success',
  // SAVE_DISC_APPLICABLE_DETAILS_FAILURE = '[discount-configuration]   Discount Applicable details Failure',

  LOAD_DISCOUNT_MAPPED_LOCATION_LIST = '[discount-configuration]   Load Discount Mapped  Location List',
  LOAD_DISCOUNT_MAPPED_LOCATION_LIST_SUCCESS = '[discount-configuration]   Load Discount Mapped  Location List Success',
  LOAD_DISCOUNT_MAPPED_LOCATION_LIST_FAILURE = '[discount-configuration]   Load Discount Mapped  Location List Failure',

  MAP_LOCATIONS = '[discount-configuration]   Discount Map  Locations',
  MAP_LOCATIONS_SUCCESS = '[discount-configuration]   Discount Map  Locations Success',
  MAP_LOCATIONS_FAILURE = '[discount-configuration]   Discount Map  Locations Failure',

  LOAD_DISCOUNT_MAPPED_PRODUCT_CATEGORY_LIST = '[discount-configuration]   Load Discount Mapped  Product Category List',
  LOAD_DISCOUNT_MAPPED_PRODUCT_CATEGORY_LIST_SUCCESS = '[discount-configuration]   Load Discount Mapped  Product Category List Success',
  LOAD_DISCOUNT_MAPPED_PRODUCT_CATEGORY_LIST_FAILURE = '[discount-configuration]   Load Discount Mapped  Product Category List Failure',

  MAP_PRODUCT_CATEGORIES = '[discount-configuration]   Discount Map  Product Categories',
  MAP_PRODUCT_CATEGORIES_SUCCESS = '[discount-configuration]   Discount Map  Product Categories Success',
  MAP_PRODUCT_CATEGORIES_FAILURE = '[discount-configuration]   Discount Map  Product Categories Failure',

  LOAD_DISCOUNT_MAPPED_PRODUCT_GROUP_LIST = '[discount-configuration]   Load Discount Mapped  Product Group List',
  LOAD_DISCOUNT_MAPPED_PRODUCT_GROUP_LIST_SUCCESS = '[discount-configuration]   Load Discount Mapped  Product Group List Success',
  LOAD_DISCOUNT_MAPPED_PRODUCT_GROUP_LIST_FAILURE = '[discount-configuration]   Load Discount Mapped  Product Group List Failure',

  MAP_PRODUCT_GROUPS = '[discount-configuration]   Discount Map  Product Groups',
  MAP_PRODUCT_GROUPS_SUCCESS = '[discount-configuration]   Discount Map  Product Groups Success',
  MAP_PRODUCT_GROUPS_FAILURE = '[discount-configuration]   Discount Map  Product Groups Failure',

  LOAD_EXCLUDE_TYPE_LIST = '[discount-configuration]   Load Discount Exclude Type List',
  LOAD_EXCLUDE_TYPE_LIST_SUCCESS = '[discount-configuration]   Load Discount Exclude Type List Success',
  LOAD_EXCLUDE_TYPE_LIST_FAILURE = '[discount-configuration]   Load Discount Exclude Type List Failure',

  LOAD_EXCLUDE_ITEM_CODES = '[discount-configuration]   Load Discount Exclude Item List',
  LOAD_EXCLUDE_ITEM_CODES_SUCCESS = '[discount-configuration]   Load Discount Exclude Item List Success',
  LOAD_EXCLUDE_ITEM_CODES_FAILURE = '[discount-configuration]   Load Discount Exclude Item List Failure',

  MAP_EXCLUDE_THEME_CODES = '[discount-configuration]   Discount Map Exclude Theme Codes',
  MAP_EXCLUDE_THEME_CODES_SUCCESS = '[discount-configuration]   Discount Map Exclude Theme Codes Success',
  MAP_EXCLUDE_THEME_CODES_FAILURE = '[discount-configuration]   Discount Map Exclude Theme Codes Failure',

  MAP_EXCLUDE_TYPE = '[discount-configuration]   Discount Map Exclude Type',
  MAP_EXCLUDE_TYPE_SUCCESS = '[discount-configuration]   Discount Map Exclude Type Success',
  MAP_EXCLUDE_TYPE_FAILURE = '[discount-configuration]   Discount Map Exclude Type Failure',

  MAP_EXCLUDE_SCHEME_CODES = '[discount-configuration]   Discount Map Exclude Scheme Codes',
  MAP_EXCLUDE_SCHEME_CODES_SUCCESS = '[discount-configuration]   Discount Map Exclude Scheme Codes Success',
  MAP_EXCLUDE_SCHEME_CODES_FAILURE = '[discount-configuration]   Discount Map Exclude Scheme Codes Failure',

  GET_MAPPED_LOCATIONS = '[discount-configuration] Get Mapped Locations',
  GET_MAPPED_LOCATIONS_SUCCESS = '[discount-configuration] Get Mapped Locations Success',
  GET_MAPPED_LOCATIONS_FAILURE = '[discount-configuration] Get Mapped Locations Failure',

  GET_MAPPED_PRODUCT_GROUPS = '[discount-configuration] Get Mapped Product Groups',
  GET_MAPPED_PRODUCT_GROUPS_SUCCESS = '[discount-configuration] Get Mapped Product Groups Success',
  GET_MAPPED_PRODUCT_GROUPS_FAILURE = '[discount-configuration] Get Mapped Product Groups Failure',

  GET_MAPPED_PRODUCT_CATEGORIES = '[discount-configuration] Get Mapped Product Categories',
  GET_MAPPED_PRODUCT_CATEGORIES_SUCCESS = '[discount-configuration] Get Mapped Product Categories Success',
  GET_MAPPED_PRODUCT_CATEGORIES_FAILURE = '[discount-configuration] Get Mapped Product Categories Failure',

  LOAD_DISCOUNT_TYPES = '[discount-configuration] Load Discount Types',
  LOAD_DISCOUNT_TYPES_SUCCESS = '[discount-configuration] Load Discount Types Success',
  LOAD_DISCOUNT_TYPES_FAILURE = '[discount-configuration] Load Discount Types Failure',

  LOAD_CLUBBING_DISCOUNT_TYPES = '[discount-configuration] Load Clubbing Discount Types',
  LOAD_CLUBBING_DISCOUNT_TYPES_SUCCESS = '[discount-configuration] Load Clubbing Discount Types Success',
  LOAD_CLUBBING_DISCOUNT_TYPES_FAILURE = '[discount-configuration] Load Clubbing Discount Types Failure',

  LOAD_APPROVERS = '[discount-configuration] Load Approvers',
  LOAD_APPROVERS_SUCCESS = '[discount-configuration] Load Approvers Success',
  LOAD_APPROVERS_FAILURE = '[discount-configuration] Load Approvers Failure',

  LOAD_APPLICABLE_LEVELS = '[discount-configuration] Load Applicable Levels',
  LOAD_APPLICABLE_LEVELS_SUCCESS = '[discount-configuration] Load Applicable Levels Success',
  LOAD_APPLICABLE_LEVELS_FAILURE = '[discount-configuration] Load Applicable Levels Failure',

  LOAD_BRANDS = '[discount-configuration] Load Brands',
  LOAD_BRANDS_SUCCESS = '[discount-configuration] Load Brands Success',
  LOAD_BRANDS_FAILURE = '[discount-configuration] Load Brands Failure',

  LOAD_SUB_BRANDS = '[discount-configuration] Load Sub Brands',
  LOAD_SUB_BRANDS_SUCCESS = '[discount-configuration] Load Sub Brands Success',
  LOAD_SUB_BRANDS_FAILURE = '[discount-configuration] Load Sub Brands Failure',

  LOAD_TEP_DURATION_RANGE = '[discount-configuration] Load Tep Duration Range',
  LOAD_TEP_DURATION_RANGE_SUCCESS = '[discount-configuration] Load Tep Duration Range Success',
  LOAD_TEP_DURATION_RANGE_FAILURE = '[discount-configuration] Load Tep Duration Range Failre',

  LOAD_BEST_DEAL_DISCOUNT_LIST = '[discount-configuration]  Load Best Deal Discount List',
  LOAD_BEST_DEAL_DISCOUNT_LIST_SUCCESS = '[discount-configuration]  Load Best Deal Discount List Success',
  LOAD_BEST_DEAL_DISCOUNT_LIST_FAILURE = '[discount-configuration]  Load Best Deal Discount List Failure',

  GET_MAPPED_BEST_DEAL_DISCOUNTS = '[discount-configuration] Get Mapped Best Deal Discounts',
  GET_MAPPED_BEST_DEAL_DISCOUNTS_SUCCESS = '[discount-configuration] Get Mapped Best Deal Discounts Success',
  GET_MAPPED_BEST_DEAL_DISCOUNTS_FAILURE = '[discount-configuration] Get Mapped Best Deal Discounts Failure',

  MAP_BEST_DEAL_DISCOUNTS = '[discount-configuration] Map Best Deal Discounts',
  MAP_BEST_DEAL_DISCOUNTS_SUCCESS = '[discount-configuration] Map Best Deal Discounts Success',
  MAP_BEST_DEAL_DISCOUNTS_FAILURE = '[discount-configuration] Map Best Deal Discounts Failure',

  SAVE_SLAB_DETAILS = '[discount-configuration] Save Slab Details',
  SAVE_SLAB_DETAILS_SUCCESS = '[discount-configuration] Save Slab Details Success',
  SAVE_SLAB_DETAILS_FAILURE = '[discount-configuration] Save Slab Details Failure',

  SAVE_DISCOUNT_DETAILS = '[discount-configuration] Save Discount Details',
  SAVE_DISCOUNT_DETAILS_SUCCESS = '[discount-configuration] Save Discount Details Success',
  SAVE_DISCOUNT_DETAILS_FAILURE = '[discount-configuration] Save Discount Details Failure',

  LOAD_DISCOUNT_DETAILS = '[discount-configuration] Load Discount Details',
  LOAD_DISCOUNT_DETAILS_SUCCESS = '[discount-configuration] Load Discount Details Success',
  LOAD_DISCOUNT_DETAILS_FAILURE = '[discount-configuration] Load Discount Details Failure',

  LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID = '[discount-configuration] Load Mapped Product group By Config Id',
  LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID_SUCCESS = '[discount-configuration] Load Mapped Product group Mapping By Config Id  Success',
  LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID_FAILURE = '[discount-configuration] Load Mapped Product group By Confif Id Failure',

  UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID = '[discount-configuration] Update Product Groups By Config Id',
  UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID_SUCCESS = '[discount-configuration] Update Product Groups  By Config Id  Success',
  UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID_FAILURE = '[discount-configuration] Update Product Groups By Confif Id Failure',

  LOAD_DISCOUNT_COMPONENT_PG_CONFIG = '[discount-configuration] Load Discount Component PG Config',
  LOAD_DISCOUNT_COMPONENT_PG_CONFIG_SUCCESS = '[discount-configuration] Load Discount Component PG Config Success',
  LOAD_DISCOUNT_COMPONENT_PG_CONFIG_FAILURE = '[discount-configuration] Load Discount Component PG Config Failure',

  UPDATE_DISCOUNT_COMPONENT_PG_CONFIG = '[discount-configuration] Update Discount Component PG Config',
  UPDATE_DISCOUNT_COMPONENT_PG_CONFIG_SUCCESS = '[discount-configuration] Update Discount Component PG Config Success',
  UPDATE_DISCOUNT_COMPONENT_PG_CONFIG_FAILURE = '[discount-configuration] Update Discount Component PG Config Failure',

  COMPUTE_TSSS_CONFIG = '[discount-configuration] Compute TSSS config',
  COMPUTE_TSSS_CONFIG_SUCCESS = '[discount-configuration] Compute TSSS config Success',
  COMPUTE_TSSS_CONFIG_FAILURE = '[discount-configuration] Compute TSSS config Failure',

  LOAD_TSSS_CONFIG_DOWNLOAD_URL = '[discount-configuration] Load TSSS Configuration Download Url',
  LOAD_TSSS_CONFIG_DOWNLOAD_URL_SUCCESS = '[discount-configuration] Load TSSS Configuration Download Url Success',
  LOAD_TSSS_CONFIG_DOWNLOAD_URL_FAILURE = '[discount-configuration] Load TSSS Configuration Download Url Failure',

  SAVE_EMPOWERMENT_DETAILS = '[discount-configuration] Save Empowerment Details',
  SAVE_EMPOWERMENT_DETAILS_SUCCESS = '[discount-configuration] Save Empowerment Details Success',
  SAVE_EMPOWERMENT_DETAILS_FAILURE = '[discount-configuration] Save Empowerment Details Failure',

  UPDATE_EMPOWERMENT_DETAILS = '[discount-configuration] Update Empowerment Details',
  UPDATE_EMPOWERMENT_DETAILS_SUCCESS = '[discount-configuration]Update Empowerment Details Success',
  UPDATE_EMPOWERMENT_DETAILS_FAILURE = '[discount-configuration] Update Empowerment Details Failure',

  LOAD_EMPOWERMENT_DISCOUNT_DETAILS = '[discount-configuration] Load  Empowerment Discount Details',
  LOAD_EMPOWERMENT_DISCOUNT_DETAILS_SUCCESS = '[discount-configuration] Load Empowerment Discount Details Success',
  LOAD_EMPOWERMENT_DISCOUNT_DETAILS_FAILURE = '[discount-configuration] Load Empowerment Discount Details Failure',

  PUBLISH_DISCOUNT_CONFIG = '[discount-configuration] Publish discount configuration',
  PUBLISH_DISCOUNT_CONFIG_SUCCESS = '[discount-configuration] Publish discount configuration Success',
  PUBLISH_DISCOUNT_CONFIG_FAILURE = '[discount-configuration] Publish discount configuration Failure',

  SEND_FOR_APPROVAL_DISCOUNT_CONFIG = '[discount-configuration] Send For Approval discount configuration',
  SEND_FOR_APPROVAL_DISCOUNT_CONFIG_SUCCESS = '[discount-configuration] Send For Approval discount configuration Success',
  SEND_FOR_APPROVAL_DISCOUNT_CONFIG_FAILURE = '[discount-configuration] Send For Approval discount configuration Failure',

  APPROVE_DISCOUNT_CONFIG = '[discount-configuration] Approve discount configuration',
  APPROVE_DISCOUNT_CONFIG_SUCCESS = '[discount-configuration] Approve discount configuration Success',
  APPROVE_DISCOUNT_CONFIG_FAILURE = '[discount-configuration]  Approve discount configuration Failure',

  RESET_DISCOUNTS = '[discount-configuration] Reset Discounts',

  LOAD_REQUESTS = '[discount-configuration] LOAD REQUESTS LIST',
  LOAD_REQUESTS_SUCCESS = '[discount-configuration] LOAD REQUESTS LIST Success',
  LOAD_REQUESTS_FAILURE = '[discount-configuration] LOAD REQUESTS LIST Failure',
  // LOAD_TABS_BY_DISCOUNT_TYPE = '[discount-configuration]  Load Discount Config Details'

  FAQ_FILE_UPLOAD = '[discount-configuration] FAQ File Upload',
  FAQ_FILE_UPLOAD_SUCCESS = '[discount-configuration] FAQ File Upload Success',
  FAQ_FILE_UPLOAD_FAILURE = '[discount-configuration] FAQ File Upload Failure',

  FAQ_FILE_DOWNLOAD = '[discount-configuration] FAQ File Download',
  FAQ_FILE_DOWNLOAD_SUCCESS = '[discount-configuration] FAQ File Download Success',
  FAQ_FILE_DOWNLOAD_FAILURE = '[discount-configuration] FAQ File Download Failure',

  LOAD_RESEND_EMAIL_STATUS = '[discount-configuration] Load Resend Email Status',
  LOAD_RESEND_EMAIL_STATUS_SUCCESS = '[discount-configuration] Load Resend Email Status Success',
  LOAD_RESEND_EMAIL_STATUS_FAILURE = '[discount-configuration] Load Resend Email Status Failure'
}

export class LoadDiscountConfigList implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_LIST;
  constructor(public payload: DisountConfigListPayload) {}
}
export class LoadDiscountConfigListSuccess implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_LIST_SUCCESS;
  constructor(public payload: DiscountConfigSuccessList) {}
}

export class LoadDiscountConfigListFailure implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadDiscountConfigDetails implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_DETAILS;
  constructor(public payload: string) {}
}
export class LoadDiscountConfigDetailsSuccess implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: NewDiscountApplicableConfig) {}
}

export class LoadDiscountConfigDetailsFailure implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveDiscountConfigList implements Action {
  readonly type = DiscountConfigActionTypes.SAVE_DISCOUNT_CONFIG_DETAILS;
  constructor(public payload: NewDiscountDetails) {}
}
export class SaveDiscountConfigListSuccess implements Action {
  readonly type =
    DiscountConfigActionTypes.SAVE_DISCOUNT_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: NewDiscountDetails) {}
}

export class SaveDiscountConfigListFailure implements Action {
  readonly type =
    DiscountConfigActionTypes.SAVE_DISCOUNT_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditDiscountConfigList implements Action {
  readonly type = DiscountConfigActionTypes.EDIT_DISCOUNT_CONFIG_DETAILS;
  constructor(public id: string, public payload: NewDiscountApplicableConfig) {}
}
export class EditDiscountConfigListSuccess implements Action {
  readonly type =
    DiscountConfigActionTypes.EDIT_DISCOUNT_CONFIG_DETAILS_SUCCESS;
  // constructor(public payload: any) {}
}

export class LoadRequests implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_REQUESTS;

  constructor(readonly payload: RequestPayload) {}
}

export class LoadRequestsSuccess implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_REQUESTS_SUCCESS;
  constructor(readonly payload: RequestLists) {}
}
export class LoadRequestsFailure implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_REQUESTS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class EditDiscountConfigListFailure implements Action {
  readonly type =
    DiscountConfigActionTypes.EDIT_DISCOUNT_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadDiscountMappedLocationList implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_LOCATION_LIST;
  constructor(public payload: DiscountLocationListPayload) {}
}
export class LoadDiscountMappedLocationListSuccess implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_LOCATION_LIST_SUCCESS;
  constructor(public payload: DiscountLocationSuccessList) {}
}
export class LoadDiscountMappedLocationListFailure implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_LOCATION_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadDiscountMappedProductGroupList implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_GROUP_LIST;
  constructor(public payload: DiscountProductGroupListPayload) {}
}
export class LoadDiscountMappedProductGroupListSuccess implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_GROUP_LIST_SUCCESS;
  constructor(public payload: DiscountProductGroupSuccessList) {}
}
export class LoadDiscountMappedProductGroupListFailure implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_GROUP_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadDiscountMappedProductCategoryList implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_CATEGORY_LIST;
  constructor(public payload: DiscountProductCategoryListPayload) {}
}
export class LoadDiscountMappedProductCategoryListSuccess implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_CATEGORY_LIST_SUCCESS;
  constructor(public payload: DiscountProductCategorySuccessList) {}
}
export class LoadDiscountMappedProductCategoryListFailure implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_CATEGORY_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadDiscountExcludeTypeList implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_EXCLUDE_TYPE_LIST;
  constructor(public payload: DiscounExcludeItemListPayload) {}
}
export class LoadDiscountExcludeTypeListSuccess implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_EXCLUDE_TYPE_LIST_SUCCESS;
  constructor(public payload: DiscountExcludeItemSuccessList) {}
}
export class LoadDiscountExcludeTypeListFailure implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_EXCLUDE_TYPE_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadDiscountExcludeItemCodes implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_EXCLUDE_ITEM_CODES;
  constructor(public payload: DiscounExcludeItemListPayload) {}
}
export class LoadDiscountExcludeItemCodesSuccess implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_EXCLUDE_ITEM_CODES_SUCCESS;
  constructor(public payload: DiscountExcludeItemSuccessList) {}
}
export class LoadDiscountExcludeItemCodesFailure implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_EXCLUDE_ITEM_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveDiscountLocations implements Action {
  readonly type = DiscountConfigActionTypes.MAP_LOCATIONS;
  constructor(public payload: SaveDiscountLocationsPayload) {}
}
export class SaveDiscountLocationsSuccess implements Action {
  readonly type = DiscountConfigActionTypes.MAP_LOCATIONS_SUCCESS;
  // constructor(public payload: DiscountLocationList) {}
}
export class SaveDiscountLocationsFailure implements Action {
  readonly type = DiscountConfigActionTypes.MAP_LOCATIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveDiscountProductCategory implements Action {
  readonly type = DiscountConfigActionTypes.MAP_PRODUCT_CATEGORIES;
  constructor(public payload: SaveDiscountProductCategoryPayload) {}
}
export class SaveDiscountProductCategorySuccess implements Action {
  readonly type = DiscountConfigActionTypes.MAP_PRODUCT_CATEGORIES_SUCCESS;
  // constructor(public payload: DiscountProductCategoryList) {}
}
export class SaveDiscountProductCategoryFailure implements Action {
  readonly type = DiscountConfigActionTypes.MAP_PRODUCT_CATEGORIES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveDiscountProductGroups implements Action {
  readonly type = DiscountConfigActionTypes.MAP_PRODUCT_GROUPS;
  constructor(public payload: SaveDiscountProductGroupPayload) {}
}
export class SaveDiscountProductGroupsSuccess implements Action {
  readonly type = DiscountConfigActionTypes.MAP_PRODUCT_GROUPS_SUCCESS;
  // constructor(public payload: DiscountProductGroupList) {}
}
export class SaveDiscountProductGroupsFailure implements Action {
  readonly type = DiscountConfigActionTypes.MAP_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
//
export class SaveDiscountExcludeThemes implements Action {
  readonly type = DiscountConfigActionTypes.MAP_EXCLUDE_THEME_CODES;
  constructor(public payload: SaveDiscountThemesPayload) {}
}
export class SaveDiscountExcludeThemesSuccess implements Action {
  readonly type = DiscountConfigActionTypes.MAP_EXCLUDE_THEME_CODES_SUCCESS;
  // constructor(public payload: DiscountProductGroupList) {}
}
export class SaveDiscountExcludeThemesFailure implements Action {
  readonly type = DiscountConfigActionTypes.MAP_EXCLUDE_THEME_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveDiscountExcludeTypes implements Action {
  readonly type = DiscountConfigActionTypes.MAP_EXCLUDE_TYPE;
  constructor(public payload: SaveExcludeTypePayload) {}
}
export class SaveDiscountExcludeTypesSuccess implements Action {
  readonly type = DiscountConfigActionTypes.MAP_EXCLUDE_TYPE_SUCCESS;
  // constructor(public payload: DiscountProductGroupList) {}
}
export class SaveDiscountExcludeTypesFailure implements Action {
  readonly type = DiscountConfigActionTypes.MAP_EXCLUDE_TYPE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveDiscountExcludeSchemes implements Action {
  readonly type = DiscountConfigActionTypes.MAP_EXCLUDE_SCHEME_CODES;
  constructor(public payload: SaveDiscountSchemesPayload) {}
}
export class SaveDiscountExcludeSchemesSuccess implements Action {
  readonly type = DiscountConfigActionTypes.MAP_EXCLUDE_SCHEME_CODES_SUCCESS;
  // constructor(public payload: DiscountProductGroupList) {}
}
export class SaveDiscountExcludeSchemesFailure implements Action {
  readonly type = DiscountConfigActionTypes.MAP_EXCLUDE_SCHEME_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSelectedLocations implements Action {
  readonly type = DiscountConfigActionTypes.GET_MAPPED_LOCATIONS;
  constructor(public payload: DiscountLocationListPayload) {}
}

export class LoadSelectedLocationsSuccess implements Action {
  readonly type = DiscountConfigActionTypes.GET_MAPPED_LOCATIONS_SUCCESS;
  constructor(public payload: MappedDetails[]) {}
}

export class LoadSelectedLocationsFailure implements Action {
  readonly type = DiscountConfigActionTypes.GET_MAPPED_LOCATIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadSelectedProductGroups implements Action {
  readonly type = DiscountConfigActionTypes.GET_MAPPED_PRODUCT_GROUPS;
  constructor(public payload: DiscountProductGroupListPayload) {}
}

export class LoadSelectedProductGroupsSuccess implements Action {
  readonly type = DiscountConfigActionTypes.GET_MAPPED_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: MappedDetails[]) {}
}

export class LoadSelectedProductGroupsFailure implements Action {
  readonly type = DiscountConfigActionTypes.GET_MAPPED_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadSelectedProductCategories implements Action {
  readonly type = DiscountConfigActionTypes.GET_MAPPED_PRODUCT_CATEGORIES;
  constructor(public payload: DiscountProductCategoryListPayload) {}
}

export class LoadSelectedProductCategoriesSuccess implements Action {
  readonly type =
    DiscountConfigActionTypes.GET_MAPPED_PRODUCT_CATEGORIES_SUCCESS;
  constructor(public payload: MappedDetails[]) {}
}

export class LoadSelectedProductCategoriesFailure implements Action {
  readonly type =
    DiscountConfigActionTypes.GET_MAPPED_PRODUCT_CATEGORIES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class PublishDiscountConfig implements Action {
  readonly type = DiscountConfigActionTypes.PUBLISH_DISCOUNT_CONFIG;
  constructor(public payload: string) {}
}

export class PublishDiscountConfigSuccess implements Action {
  readonly type = DiscountConfigActionTypes.PUBLISH_DISCOUNT_CONFIG_SUCCESS;
}

export class PublishDiscountConfigFailure implements Action {
  readonly type = DiscountConfigActionTypes.PUBLISH_DISCOUNT_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SendForApprovalDiscountConfig implements Action {
  readonly type = DiscountConfigActionTypes.SEND_FOR_APPROVAL_DISCOUNT_CONFIG;
  constructor(public payload: discountWorkflowpayload) {}
}

export class SendForApprovalDiscountConfigSuccess implements Action {
  readonly type =
    DiscountConfigActionTypes.SEND_FOR_APPROVAL_DISCOUNT_CONFIG_SUCCESS;
}

export class SendForApprovalDiscountConfigFailure implements Action {
  readonly type =
    DiscountConfigActionTypes.SEND_FOR_APPROVAL_DISCOUNT_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ApproveDiscountConfig implements Action {
  readonly type = DiscountConfigActionTypes.APPROVE_DISCOUNT_CONFIG;
  constructor(public payload: discountWorkflowpayload) {}
}

export class ApproveDiscountConfigSuccess implements Action {
  readonly type = DiscountConfigActionTypes.APPROVE_DISCOUNT_CONFIG_SUCCESS;
  constructor(public payload: string) {}
}

export class ApproveDiscountConfigFailure implements Action {
  readonly type = DiscountConfigActionTypes.APPROVE_DISCOUNT_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadBestDealDiscountList implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_BEST_DEAL_DISCOUNT_LIST;
  constructor(public payload: DisountConfigListPayload) {}
}

export class LoadBestDealDiscountListSuccess implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_BEST_DEAL_DISCOUNT_LIST_SUCCESS;
  constructor(public payload: DiscountConfigSuccessList) {}
}

export class LoadBestDealDiscountListFailure implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_BEST_DEAL_DISCOUNT_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSelectedBestDealDiscounts implements Action {
  readonly type = DiscountConfigActionTypes.GET_MAPPED_BEST_DEAL_DISCOUNTS;
  constructor(public payload: DiscountBestDealListPayload) {}
}

export class LoadSelectedBestDealDiscountSuccess implements Action {
  readonly type =
    DiscountConfigActionTypes.GET_MAPPED_BEST_DEAL_DISCOUNTS_SUCCESS;
  constructor(public payload: MappedBestDealDiscountSuccessList) {}
}

export class LoadSelectedBestDealDiscountFailure implements Action {
  readonly type =
    DiscountConfigActionTypes.GET_MAPPED_BEST_DEAL_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveBestDealDiscounts implements Action {
  readonly type = DiscountConfigActionTypes.MAP_BEST_DEAL_DISCOUNTS;
  constructor(public payload: SaveBestDealDiscountPayload) {}
}
export class SaveBestDealDiscountsSuccess implements Action {
  readonly type = DiscountConfigActionTypes.MAP_BEST_DEAL_DISCOUNTS_SUCCESS;
  // constructor(public payload: DiscountProductGroupList) {}
}
export class SaveBestDealDiscountsFailure implements Action {
  readonly type = DiscountConfigActionTypes.MAP_BEST_DEAL_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadDiscountTypes implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_DISCOUNT_TYPES;
  constructor(public payload: string) {}
}
export class LoadDiscountTypesSuccess implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_DISCOUNT_TYPES_SUCCESS;
  constructor(public payload: Lov[]) {}
}
export class LoadDiscountTypesFailure implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_DISCOUNT_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadClubbingDiscountTypes implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_CLUBBING_DISCOUNT_TYPES;
  constructor(public payload: string) {}
}
export class LoadClubbingDiscountTypesSuccess implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_CLUBBING_DISCOUNT_TYPES_SUCCESS;
  constructor(public payload: Lov[]) {}
}
export class LoadClubbingDiscountTypesFailure implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_CLUBBING_DISCOUNT_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadApprovers implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_APPROVERS;
  constructor(public payload: string) {}
}
export class LoadApproversSuccess implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_APPROVERS_SUCCESS;
  constructor(public payload: Lov[]) {}
}
export class LoadApproversFailure implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_APPROVERS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveSlabDetails implements Action {
  readonly type = DiscountConfigActionTypes.SAVE_SLAB_DETAILS;
  constructor(public payload: any) {}
}
export class SaveSlabDetailsSuccess implements Action {
  readonly type = DiscountConfigActionTypes.SAVE_SLAB_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class SaveSlabDetailsFailure implements Action {
  readonly type = DiscountConfigActionTypes.SAVE_SLAB_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveDiscountDetails implements Action {
  readonly type = DiscountConfigActionTypes.SAVE_DISCOUNT_DETAILS;
  constructor(public payload: any) {}
}
export class SaveDiscountDetailsSuccess implements Action {
  readonly type = DiscountConfigActionTypes.SAVE_DISCOUNT_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class SaveDiscountDetailsFailure implements Action {
  readonly type = DiscountConfigActionTypes.SAVE_DISCOUNT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadDiscountDetails implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_DISCOUNT_DETAILS;
  constructor(public payload: any) {}
}
export class LoadDiscountDetailsSuccess implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_DISCOUNT_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadDiscountDetailsFailure implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_DISCOUNT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveEmpowermentDetails implements Action {
  readonly type = DiscountConfigActionTypes.SAVE_EMPOWERMENT_DETAILS;
  constructor(public payload: any) {}
}
export class SaveEmpowermentDetailsSuccess implements Action {
  readonly type = DiscountConfigActionTypes.SAVE_EMPOWERMENT_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class SaveEmpowermentDetailsFailure implements Action {
  readonly type = DiscountConfigActionTypes.SAVE_EMPOWERMENT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateEmpowermentDetails implements Action {
  readonly type = DiscountConfigActionTypes.UPDATE_EMPOWERMENT_DETAILS;
  constructor(public payload: any) {}
}
export class UpdateEmpowermentDetailsSuccess implements Action {
  readonly type = DiscountConfigActionTypes.UPDATE_EMPOWERMENT_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class UpdateEmpowermentDetailsFailure implements Action {
  readonly type = DiscountConfigActionTypes.UPDATE_EMPOWERMENT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadEmpowermentDiscountDetails implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_EMPOWERMENT_DISCOUNT_DETAILS;
  constructor(public payload: any) {}
}
export class LoadEmpowermentDiscountDetailsSuccess implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_EMPOWERMENT_DISCOUNT_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadEmpowermentDiscountDetailsFailure implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_EMPOWERMENT_DISCOUNT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadDiscountComponentPGConfig implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_DISCOUNT_COMPONENT_PG_CONFIG;
  constructor(
    public payload: {
      discountId: string;
      pgType: string;
      pageIndex: number;
      pageSize: number;
    }
  ) {}
}
export class LoadDiscountComponentPGConfigSuccess implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_DISCOUNT_COMPONENT_PG_CONFIG_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadDiscountComponentPGConfigFailure implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_DISCOUNT_COMPONENT_PG_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateDiscountComponentPGConfig implements Action {
  readonly type = DiscountConfigActionTypes.UPDATE_DISCOUNT_COMPONENT_PG_CONFIG;
  constructor(
    public payload: {
      discountId: string;
      discountComponents: any;
      loadData: any;
    }
  ) {}
}
export class UpdateDiscountComponentPGConfigSuccess implements Action {
  readonly type =
    DiscountConfigActionTypes.UPDATE_DISCOUNT_COMPONENT_PG_CONFIG_SUCCESS;
  constructor(public payload: any) {}
}
export class UpdateDiscountComponentPGConfigFailure implements Action {
  readonly type =
    DiscountConfigActionTypes.UPDATE_DISCOUNT_COMPONENT_PG_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadMappedProductGroupsByConfigId implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID;
  constructor(
    public payload: { discountId: string; discountDetailsId: string }
  ) {}
}
export class LoadMappedProductGroupsByConfigIdSuccess implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID_SUCCESS;
  constructor(public payload: ProductGroupMappingOption[]) {}
}
export class LoadMappedProductGroupsByConfigIdFailure implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateMappedProductGroupByConfigId implements Action {
  readonly type = DiscountConfigActionTypes.UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID;
  constructor(
    public payload: {
      discountId: string;
      discountDetailsId: string;
      data: {
        addProducts: ProductGroupMappingOption[];
        removeProducts: ProductGroupMappingOption[];
        updateProducts: ProductGroupMappingOption[];
      };
      loadData: any;
    }
  ) {}
}
export class UpdateMappedProductGroupByConfigIdSuccess implements Action {
  readonly type =
    DiscountConfigActionTypes.UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID_SUCCESS;
  constructor(public payload: ProductGroupMappingOption[]) {}
}
export class UpdateMappedProductGroupByConfigIdFailure implements Action {
  readonly type =
    DiscountConfigActionTypes.UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadApplicableLevels implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_APPLICABLE_LEVELS;
  constructor(public payload: string) {}
}
export class LoadApplicableLevelsSuccess implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_APPLICABLE_LEVELS_SUCCESS;
  constructor(public payload: Lov[]) {}
}
export class LoadApplicableLevelsFailure implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_APPLICABLE_LEVELS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadBrands implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_BRANDS;
}
export class LoadBrandsSuccess implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_BRANDS_SUCCESS;
  constructor(public payload: BrandSummary[]) {}
}
export class LoadBrandsFailure implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_BRANDS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadSubBrands implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_SUB_BRANDS;
  constructor(public payload: string) {}
}
export class LoadSubBrandsSuccess implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_SUB_BRANDS_SUCCESS;
  constructor(public payload: BrandSummary[]) {}
}
export class LoadSubBrandsFailure implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_SUB_BRANDS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadTepDurationDaysRange implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_TEP_DURATION_RANGE;
}

export class LoadTepDurationDaysRangeSuccess implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_TEP_DURATION_RANGE_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadTepDurationDaysRangeFailure implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_TEP_DURATION_RANGE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ComputeTsssConfig implements Action {
  readonly type = DiscountConfigActionTypes.COMPUTE_TSSS_CONFIG;
  constructor(public payload: TSSSRequestPayload) {}
}

export class ComputeTsssConfigSuccess implements Action {
  readonly type = DiscountConfigActionTypes.COMPUTE_TSSS_CONFIG_SUCCESS;
  constructor(public payload: any) {}
}
export class ComputeTsssConfigFailure implements Action {
  readonly type = DiscountConfigActionTypes.COMPUTE_TSSS_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTsssConfigDownloadUrl implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_TSSS_CONFIG_DOWNLOAD_URL;
  constructor(public payload: string) {}
}

export class LoadTsssConfigDownloadUrlSuccess implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_TSSS_CONFIG_DOWNLOAD_URL_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadTsssConfigDownloadUrlFailure implements Action {
  readonly type =
    DiscountConfigActionTypes.LOAD_TSSS_CONFIG_DOWNLOAD_URL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FaqFileUpload implements Action {
  readonly type = DiscountConfigActionTypes.FAQ_FILE_UPLOAD;
  constructor(public payload: FaqRequestPaylaod) {}
}

export class FaqFileUploadSuccess implements Action {
  readonly type = DiscountConfigActionTypes.FAQ_FILE_UPLOAD_SUCCESS;
  constructor(public payload: FaqFileUploadResponse) {}
}
export class FaqFileUploadFailure implements Action {
  readonly type = DiscountConfigActionTypes.FAQ_FILE_UPLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FaqFileDownload implements Action {
  readonly type = DiscountConfigActionTypes.FAQ_FILE_DOWNLOAD;
  constructor(public payload: FaqFileUploadResponse) {}
}

export class FaqFileDownloadSuccess implements Action {
  readonly type = DiscountConfigActionTypes.FAQ_FILE_DOWNLOAD_SUCCESS;
}
export class FaqFileDownloadFailure implements Action {
  readonly type = DiscountConfigActionTypes.FAQ_FILE_DOWNLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadResendEmailStatus implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_RESEND_EMAIL_STATUS;
  constructor(public payload: string) {}
}

export class LoadResendEmailStatusSuccess implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_RESEND_EMAIL_STATUS_SUCCESS;
  constructor(public payload: string) {}
}
export class LoadResendEmailStatusFailure implements Action {
  readonly type = DiscountConfigActionTypes.LOAD_RESEND_EMAIL_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetDiscounts implements Action {
  readonly type = DiscountConfigActionTypes.RESET_DISCOUNTS;
}
export type DiscountConfigAction =
  | LoadDiscountConfigList
  | LoadDiscountConfigListSuccess
  | LoadDiscountConfigListFailure
  | LoadDiscountConfigDetails
  | LoadDiscountConfigDetailsSuccess
  | LoadDiscountConfigDetailsFailure
  | SaveDiscountConfigList
  | SaveDiscountConfigListSuccess
  | SaveDiscountConfigListFailure
  | EditDiscountConfigList
  | EditDiscountConfigListSuccess
  | EditDiscountConfigListFailure
  | LoadDiscountMappedLocationList
  | LoadDiscountMappedLocationListSuccess
  | LoadDiscountMappedLocationListFailure
  | LoadDiscountMappedProductCategoryList
  | LoadDiscountMappedProductCategoryListSuccess
  | LoadDiscountMappedProductCategoryListFailure
  | LoadDiscountMappedProductGroupList
  | LoadDiscountMappedProductGroupListSuccess
  | LoadDiscountMappedProductGroupListFailure
  | LoadDiscountExcludeTypeList
  | LoadDiscountExcludeTypeListSuccess
  | LoadDiscountExcludeTypeListFailure
  | LoadDiscountExcludeItemCodes
  | LoadDiscountExcludeItemCodesSuccess
  | LoadDiscountExcludeItemCodesFailure
  | SaveDiscountLocations
  | SaveDiscountLocationsSuccess
  | SaveDiscountLocationsFailure
  | SaveDiscountProductCategory
  | SaveDiscountProductCategorySuccess
  | SaveDiscountProductCategoryFailure
  | SaveDiscountProductGroups
  | SaveDiscountProductGroupsSuccess
  | SaveDiscountProductGroupsFailure
  | SaveDiscountExcludeThemes
  | SaveDiscountExcludeThemesSuccess
  | SaveDiscountExcludeThemesFailure
  | SaveDiscountExcludeTypes
  | SaveDiscountExcludeTypesSuccess
  | SaveDiscountExcludeTypesFailure
  | SaveDiscountExcludeSchemes
  | SaveDiscountExcludeSchemesSuccess
  | SaveDiscountExcludeSchemesFailure
  | LoadSelectedLocations
  | LoadSelectedLocationsSuccess
  | LoadSelectedLocationsFailure
  | LoadSelectedProductGroups
  | LoadSelectedProductGroupsSuccess
  | LoadSelectedProductGroupsFailure
  | LoadSelectedProductCategories
  | LoadSelectedProductCategoriesSuccess
  | LoadSelectedProductCategoriesFailure
  | ResetDiscounts
  | LoadBestDealDiscountList
  | LoadBestDealDiscountListSuccess
  | LoadBestDealDiscountListFailure
  | PublishDiscountConfig
  | PublishDiscountConfigSuccess
  | LoadSelectedBestDealDiscounts
  | LoadSelectedBestDealDiscountSuccess
  | LoadSelectedBestDealDiscountFailure
  | SaveBestDealDiscounts
  | SaveBestDealDiscountsSuccess
  | SaveBestDealDiscountsFailure
  | PublishDiscountConfigFailure
  | LoadDiscountTypes
  | LoadDiscountTypesSuccess
  | LoadDiscountTypesFailure
  | LoadClubbingDiscountTypes
  | LoadClubbingDiscountTypesSuccess
  | LoadClubbingDiscountTypesFailure
  | LoadApprovers
  | LoadApproversSuccess
  | LoadApproversFailure
  | SaveSlabDetails
  | SaveSlabDetailsSuccess
  | SaveSlabDetailsFailure
  | SaveDiscountDetails
  | SaveDiscountDetailsSuccess
  | SaveDiscountDetailsFailure
  | LoadDiscountDetails
  | LoadDiscountDetailsSuccess
  | LoadDiscountDetailsFailure
  | LoadMappedProductGroupsByConfigId
  | LoadMappedProductGroupsByConfigIdSuccess
  | LoadMappedProductGroupsByConfigIdFailure
  | UpdateMappedProductGroupByConfigId
  | UpdateMappedProductGroupByConfigIdFailure
  | UpdateMappedProductGroupByConfigIdSuccess
  | LoadDiscountComponentPGConfig
  | LoadDiscountComponentPGConfigSuccess
  | LoadDiscountComponentPGConfigFailure
  | UpdateDiscountComponentPGConfig
  | UpdateDiscountComponentPGConfigSuccess
  | UpdateDiscountComponentPGConfigFailure
  | LoadApplicableLevels
  | LoadApplicableLevelsSuccess
  | LoadApplicableLevelsFailure
  | LoadBrands
  | LoadBrandsSuccess
  | LoadBrandsFailure
  | LoadSubBrands
  | LoadSubBrandsSuccess
  | LoadSubBrandsFailure
  | LoadTepDurationDaysRange
  | LoadTepDurationDaysRangeSuccess
  | LoadTepDurationDaysRangeFailure
  | ComputeTsssConfig
  | ComputeTsssConfigSuccess
  | ComputeTsssConfigFailure
  | LoadTsssConfigDownloadUrl
  | LoadTsssConfigDownloadUrlSuccess
  | LoadTsssConfigDownloadUrlFailure
  | SaveEmpowermentDetails
  | SaveEmpowermentDetailsSuccess
  | SaveEmpowermentDetailsFailure
  | LoadRequests
  | LoadRequestsSuccess
  | LoadRequestsFailure
  | ApproveDiscountConfig
  | ApproveDiscountConfigSuccess
  | ApproveDiscountConfigFailure
  | UpdateEmpowermentDetails
  | UpdateEmpowermentDetailsSuccess
  | UpdateEmpowermentDetailsFailure
  | SendForApprovalDiscountConfig
  | SendForApprovalDiscountConfigSuccess
  | SendForApprovalDiscountConfigFailure
  | LoadEmpowermentDiscountDetails
  | LoadEmpowermentDiscountDetailsSuccess
  | LoadEmpowermentDiscountDetailsFailure
  | FaqFileUpload
  | FaqFileUploadSuccess
  | FaqFileUploadFailure
  | FaqFileDownload
  | FaqFileDownloadSuccess
  | FaqFileDownloadFailure
  | LoadResendEmailStatus
  | LoadResendEmailStatusSuccess
  | LoadResendEmailStatusFailure;
