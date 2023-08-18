import { Action } from '@ngrx/store';
import {
  CustomErrors, ExcludeItemCodes, ExcludeItemCodesPayload, ExcludeThemeCodes, FileResponse, GepDetails, GEPDetailsPayload, GEPPurityConfig, GEPPurityConfigListPayload,
  GEPPurityConfigResponse, Lov, MetalType, ProductGroup,
  ProductGroupDeduction, ProductGroupMappingResponse, ProductGroupsDeduction, PurityDetailsPayload, PurityDetailsResponse, Ranges, RemoveProductGroupDeduction, RemoveThemeCodesPayload, SaveThemeCodesPayload, SearchProdcutGroup
} from '@poss-web/shared/models';
export enum GEPPurityConfigActionTypes {
  LOAD_GEP_PURITY_CONFIG_LIST = '[gep-purity-config] Load Gep Purity Configuration List',
  LOAD_GEP_PURITY_CONFIG_LIST_SUCCESS = '[gep-purity-config] Load Gep Purity Configuration List Success',
  LOAD_GEP_PURITY_CONFIG_LIST_FAILURE = '[gep-purity-config] Load Gep Purity Configuration List Failure',

  SEARCH_CONFIG_NAME = '[gep-purity-config]Search Config Name',
  SEARCH_CONFIG_NAME_SUCCESS = '[gep-purity-config]Search Config Name Success',
  SEARCH_CONFIG_NAME_FAILURE = '[gep-purity-config]Search Config Name Failure',

  SAVE_GEP_DETAILS = '[gep-purity-config]Save GEP Details',
  SAVE_GEP_DETAILS_SUCCESS = '[gep-purity-config]Save GEP Details Success',
  SAVE_GEP_DETAILS_FAILURE = '[gep-purity-config]Save GEP Details Failure',

  LOAD_METAL_TYPES = '[gep-purity-config]Load Metal Types',
  LOAD_METAL_TYPES_SUCCESS = '[gep-purity-config]Load Metal Types Success',
  LOAD_METAL_TYPES_FAILURE = '[gep-purity-config]Load Metal Types Failure',

  LOAD_ITEM_TYPES = '[gep-purity-config]Load Item Types',
  LOAD_ITEM_TYPES_SUCCESS = '[gep-purity-config]Load Item Types Success',
  LOAD_ITEM_TYPES_FAILURE = '[gep-purity-config]Load Item Types Failure',

  LOAD_GOLD_RANGES = '[gep-purity-config]Load Gold Ranges',
  LOAD_GOLD_RANGES_SUCCESS = '[gep-purity-config]Load Gold Ranges Success',
  LOAD_GOLD_RANGES_FAILURE = '[gep-purity-config]Load Gold Ranges Failure',

  SAVE_PURITY_DETAILS = '[gep-purity-config]Save PurityDetails',
  SAVE_PURITY_DETAILS_SUCCESS = '[gep-purity-config]Save PurityDetails Success',
  SAVE_PURITY_DETAILS_FAILURE = '[gep-purity-config]Save PurityDetails Failure',

  UPLOAD_FILE = '[gep-purity-config] Upload File',
  UPLOAD_FILE_SUCCESS = '[gep-purity-config] Upload File Success',
  UPLOAD_FILE_FAILURE = '[gep-purity-config] Upload File Failure',

  GET_EXCLUDE_THEME_CODES = '[gep-purity-config] Get Exclude Theme Codes',
  GET_EXCLUDE_THEME_CODES_SUCCESS = '[gep-purity-config] Get Exclude Theme Codes Success',
  GET_EXCLUDE_THEME_CODES_FAILURE = '[gep-purity-config] Get Exclude Theme Codes Failure',

  GET_EXCLUDE_ITEM_CODES = '[gep-purity-config] Get Exclude Item Codes',
  GET_EXCLUDE_ITEM_CODES_SUCCESS = '[gep-purity-config] Get Exclude Item Codes Success',
  GET_EXCLUDE_ITEM_CODES_FAILURE = '[gep-purity-config] Get Exclude Item Codes Failure',

  LOAD_PRODUCT_GROUPS = '[gep-purity-config] Load Product Groups',
  LOAD_PRODUCT_GROUPS_SUCCESS = '[gep-purity-config] Load Product Groups Success',
  LOAD_PRODUCT_GROUPS_FAILURE = '[gep-purity-config] Load Product Groups Failure',

  SEARCH_PRODUCT_GROUP = '[gep-purity-config] Search Product Group',
  SEARCH_PRODUCT_GROUP_SUCCESS = '[gep-purity-config] Search Product Group Success',
  SEARCH_PRODUCT_GROUP_FAILURE = '[gep-purity-config] Search Product Group Failure',

  RESET_GEP_PURITY_CONFIGURATION = '[gep-purity-config] Reset Gep Purity Configuration',

  UPDATE_TOGGLE_BUTTON = '[gep-purity-config] Update Toggle Button',
  UPDATE_TOGGLE_BUTTON_SUCCESS = '[gep-purity-config]  Update Toggle Button Success',
  UPDATE_TOGGLE_BUTTON_FAILURE = '[gep-purity-config]  Update Toggle Button Failure',

  SAVE_PRODUCT_GROUPS_DEDUCTION = '[gep-purity-config]Save Product Groups Deduction',
  SAVE_PRODUCT_GROUPS_DEDUCTION_SUCCESS = '[gep-purity-config]Save Product Groups Deduction Success',
  SAVE_PRODUCT_GROUPS_DEDUCTION_FAILURE = '[gep-purity-config]Save Product Groups Deduction Failure',
  
  UPDATE_PRODUCT_GROUPS_DEDUCTION = '[gep-purity-config]Update Product Groups Deduction',
  UPDATE_PRODUCT_GROUPS_DEDUCTION_SUCCESS = '[gep-purity-config]Update Product Groups Deduction Success',
  UPDATE_PRODUCT_GROUPS_DEDUCTION_FAILURE = '[gep-purity-config]Update Product Groups Deduction Failure',

  LOAD_GEP_PURITY_DETAILS = '[gep-purity-config]Load Gep Purity Details',
  LOAD_GEP_PURITY_DETAILS_SUCCESS = '[gep-purity-config]Load Gep Purity Details Success',
  LOAD_GEP_PURITY_DETAILS_FAILURE = '[gep-purity-config]Load Gep Purity Details Failure',

  LOAD_GEP_DETAILS = '[gep-purity-config]Load Gep Details',
  LOAD_GEP_DETAILS_SUCCESS = '[gep-purity-config]Load Gep Details Success',
  LOAD_GEP_DETAILS_FAILURE = '[gep-purity-config]Load Gep Details Failure',

  LOAD_PRODUCT_GROUPS_DEUCTION = '[gep-purity-config]Load Product Groups Deduction',
  LOAD_PRODUCT_GROUPS_DEUCTION_SUCCESS = '[gep-purity-config]Load Product Groups Deduction Success',
  LOAD_PRODUCT_GROUPS_DEUCTION_FAILURE = '[gep-purity-config]Load Product Groups Deduction Failure',

  SAVE_THEME_CODES = '[gep-purity-config]Save Theme Codes',
  SAVE_THEME_CODES_SUCCESS = '[gep-purity-config]Save Theme Codes Success',
  SAVE_THEME_CODES_FAILURE = '[gep-purity-config]Save Theme Codes Failure',

  DELETE_THEME_CODES = '[gep-purity-config]Delete Theme Codes',
  DELETE_THEME_CODES_SUCCESS = '[gep-purity-config]Delete Theme Codes Success',
  DELETE_THEME_CODES_FAILURE = '[gep-purity-config]Delete Theme Codes Failure',

  REMOVE_PRODUCT_GROUP = '[gep-purity-config]Remove Product Group',
  REMOVE_PRODUCT_GROUP_SUCCESS = '[gep-purity-config]Remove Product Group Success',
  REMOVE_PRODUCT_GROUP_FAILURE = '[gep-purity-config]Remove Product Group Failure',

  SEARCH_ITEM_CODE = '[gep-purity-config]Search Item Code',
  SEARCH_ITEM_CODE_SUCCESS = '[gep-purity-config]Search Item Code Success',
  SEARCH_ITEM_CODE_FAILURE = '[gep-purity-config]Search Item Code Failure',

  ITEM_CODES_ERROR_LOG_DOWNLOAD = '[airpay-configuration] Item Codes Download Error Log',
  ITEM_CODES_ERROR_LOG_DOWNLOAD_SUCCESS = '[airpay-configuration] Item Codes Download Error Log Success',
  ITEM_CODES_ERROR_LOG_DOWNLOAD_FAILURE = '[airpay-configuration] Item Codes Download Error Log Failure',

  LOAD_SILVER_RANGES = '[gep-purity-config]Load Silver Ranges',
  LOAD_SILVER_RANGES_SUCCESS = '[gep-purity-config]Load Silver Ranges Success',
  LOAD_SILVER_RANGES_FAILURE = '[gep-purity-config]Load Silver Ranges Failure',

  LOAD_PLATINUM_RANGES = '[gep-purity-config]Load Platinum Ranges',
  LOAD_PLATINUM_RANGES_SUCCESS = '[gep-purity-config]Load Platinum Ranges Success',
  LOAD_PLATINUM_RANGES_FAILURE = '[gep-purity-config]Load Platinum Ranges Failure',

  LOAD_LOCATIONS = '[ gep-purity-config ] Load Locations',
  LOAD_LOCATIONS_SUCCESS = '[ gep-purity-config] Load Locations Success',
  LOAD_LOCATIONS_FAILURE = '[ gep-purity-config ] Load locations Failure',

  LOAD_SELETED_PRODUCT_GROUPS = '[ gep-purity-config ] Load Selected Product Groups',
  LOAD_SELETED_PRODUCT_GROUPS_SUCCESS = '[ gep-purity-config] Load Selected Product Groups Success',
  LOAD_SELETED_PRODUCT_GROUPS_FAILURE = '[ gep-purity-config ] Load Selected Product Groups Failure'
}
export class LoadGEPPurityConfig implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_GEP_PURITY_CONFIG_LIST;
  constructor(public payload: GEPPurityConfigListPayload) {}
}
export class LoadGEPPurityConfigSuccess implements Action {
  readonly type =
    GEPPurityConfigActionTypes.LOAD_GEP_PURITY_CONFIG_LIST_SUCCESS;
  constructor(public payload: GEPPurityConfigResponse) {}
}
export class LoadGEPPurityConfigFailure implements Action {
  readonly type =
    GEPPurityConfigActionTypes.LOAD_GEP_PURITY_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchConfigName implements Action {
  readonly type = GEPPurityConfigActionTypes.SEARCH_CONFIG_NAME;
  constructor(
    public payload: {
      configName: string;
      type: string;
    }
  ) {}
}
export class SearchConfigNameSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.SEARCH_CONFIG_NAME_SUCCESS;
  constructor(public payload: GEPPurityConfig[]) {}
}
export class SearchConfigNameFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.SEARCH_CONFIG_NAME_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveGEPDetails implements Action {
  readonly type = GEPPurityConfigActionTypes.SAVE_GEP_DETAILS;
  constructor(public payload: GEPDetailsPayload) {}
}
export class SaveGEPDetailsSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.SAVE_GEP_DETAILS_SUCCESS;
  constructor(public payload: GepDetails) {}
}
export class SaveGEPDetailsFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.SAVE_GEP_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadMetalTypes implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_METAL_TYPES;
}
export class LoadMetalTypesSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_METAL_TYPES_SUCCESS;
  constructor(public payload: MetalType[]) {}
}
export class LoadMetalTypesFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_METAL_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadItemTypes implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_ITEM_TYPES;
}
export class LoadItemTypesSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_ITEM_TYPES_SUCCESS;
  constructor(public payload: Lov[]) {}
}
export class LoadItemTypesFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_ITEM_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SavePurityDetails implements Action {
  readonly type = GEPPurityConfigActionTypes.SAVE_PURITY_DETAILS;
  constructor(public payload: PurityDetailsPayload) {}
}
export class SavePurityDetailsSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.SAVE_PURITY_DETAILS_SUCCESS;
  constructor(public payload: PurityDetailsResponse[]) {}
}
export class SavePurityDetailsFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.SAVE_PURITY_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UploadFile implements Action {
  readonly type = GEPPurityConfigActionTypes.UPLOAD_FILE;
  constructor(public payload: ExcludeItemCodesPayload) {}
}
export class UploadFileSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.UPLOAD_FILE_SUCCESS;
  constructor(
    public payload: { fileResponse: FileResponse; configId: string }
  ) {}
}
export class UploadFileFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.UPLOAD_FILE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class GetExcludeThemeCodes implements Action {
  readonly type = GEPPurityConfigActionTypes.GET_EXCLUDE_THEME_CODES;
  constructor(public payload: string) {}
}
export class GetExcludeThemeCodesSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.GET_EXCLUDE_THEME_CODES_SUCCESS;
  constructor(public payload: ExcludeThemeCodes[]) {}
}
export class GetExcludeThemeCodesFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.GET_EXCLUDE_THEME_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class GetExcludeItemCodes implements Action {
  readonly type = GEPPurityConfigActionTypes.GET_EXCLUDE_ITEM_CODES;
  constructor(
    public payload: { configId: string; pageIndex: number; pageSize: number }
  ) {}
}
export class GetExcludeItemCodesSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.GET_EXCLUDE_ITEM_CODES_SUCCESS;
  constructor(
    public payload: { itemCodes: ExcludeItemCodes[]; totalElements: number }
  ) {}
}
export class GetExcludeItemCodesFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.GET_EXCLUDE_ITEM_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadProductGroups implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS;
}
export class LoadProductGroupsSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: ProductGroup[]) {}
}
export class LoadProductGroupsFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchProductGroup implements Action {
  readonly type = GEPPurityConfigActionTypes.SEARCH_PRODUCT_GROUP;
  constructor(public payload: SearchProdcutGroup) {}
}
export class SearchProductGroupSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.SEARCH_PRODUCT_GROUP_SUCCESS;
  constructor(public payload: ProductGroupsDeduction[]) {}
}
export class SearchProductGroupFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.SEARCH_PRODUCT_GROUP_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetGepPurityConfiguration implements Action {
  readonly type = GEPPurityConfigActionTypes.RESET_GEP_PURITY_CONFIGURATION;
}

export class SaveProductGroupsDeduction implements Action {
  readonly type = GEPPurityConfigActionTypes.SAVE_PRODUCT_GROUPS_DEDUCTION;
  constructor(public payload: ProductGroupDeduction) {}
}
export class SaveProductGroupsDeductionSuccess implements Action {
  readonly type =
    GEPPurityConfigActionTypes.SAVE_PRODUCT_GROUPS_DEDUCTION_SUCCESS;
  constructor(public payload: string) {}
}
export class SaveProductGroupsDeductionFailure implements Action {
  readonly type =
    GEPPurityConfigActionTypes.SAVE_PRODUCT_GROUPS_DEDUCTION_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class updateProductGroupsDeduction implements Action {
  readonly type = GEPPurityConfigActionTypes.UPDATE_PRODUCT_GROUPS_DEDUCTION;
  constructor(public payload: ProductGroupDeduction) {}
}
export class updateProductGroupsDeductionSuccess implements Action {
  readonly type =
    GEPPurityConfigActionTypes.UPDATE_PRODUCT_GROUPS_DEDUCTION_SUCCESS;
  constructor(public payload: string) {}
}
export class updateProductGroupsDeductionFailure implements Action {
  readonly type =
    GEPPurityConfigActionTypes.UPDATE_PRODUCT_GROUPS_DEDUCTION_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadGepPurityDetails implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_GEP_PURITY_DETAILS;
  constructor(public payload: string) {}
}
export class LoadGepPurityDetailsSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_GEP_PURITY_DETAILS_SUCCESS;
  constructor(public payload: PurityDetailsResponse[]) {}
}
export class LoadGepPurityDetailsFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_GEP_PURITY_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadGepDetails implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_GEP_DETAILS;
  constructor(public payload: string) {}
}
export class LoadGepDetailsSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_GEP_DETAILS_SUCCESS;
  constructor(public payload: GepDetails) {}
}
export class LoadGepDetailsFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_GEP_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadProductGroupsDeduction implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS_DEUCTION;
  constructor(
    public payload: {
      configId: string;
      pageIndex: number;
      pageSize: number;
    }
  ) {}
}
export class LoadProductGroupsDeductionSuccess implements Action {
  readonly type =
    GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS_DEUCTION_SUCCESS;
  constructor(
    public payload: {
      productGroupsDeduction: ProductGroupsDeduction[];
      count: number;
    }
  ) {}
}
export class LoadProductGroupsDeductionFailure implements Action {
  readonly type =
    GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS_DEUCTION_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveThemeCodes implements Action {
  readonly type = GEPPurityConfigActionTypes.SAVE_THEME_CODES;
  constructor(public payload: SaveThemeCodesPayload) {}
}
export class SaveThemeCodesSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.SAVE_THEME_CODES_SUCCESS;
  constructor(public payload: string) {}
}
export class SaveThemeCodesFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.SAVE_THEME_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class DeleteThemeCodes implements Action {
  readonly type = GEPPurityConfigActionTypes.DELETE_THEME_CODES;
  constructor(public payload: RemoveThemeCodesPayload) {}
}
export class DeleteThemeCodesSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.DELETE_THEME_CODES_SUCCESS;
}
export class DeleteThemeCodesFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.DELETE_THEME_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class RemoveProductGroups implements Action {
  readonly type = GEPPurityConfigActionTypes.REMOVE_PRODUCT_GROUP;
  constructor(public payload: RemoveProductGroupDeduction) {}
}
export class RemoveProductGroupsSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.REMOVE_PRODUCT_GROUP_SUCCESS;
}
export class RemoveProductGroupsFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.REMOVE_PRODUCT_GROUP_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchItemCode implements Action {
  readonly type = GEPPurityConfigActionTypes.SEARCH_ITEM_CODE;
  constructor(public payload: { configId: string; itemCode: string }) {}
}
export class SearchItemCodeSucccess implements Action {
  readonly type = GEPPurityConfigActionTypes.SEARCH_ITEM_CODE_SUCCESS;
  constructor(public payload: ExcludeItemCodes[]) {}
}
export class SearchItemCodeFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.SEARCH_ITEM_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ItemCodeErrorLogDownload implements Action {
  readonly type = GEPPurityConfigActionTypes.ITEM_CODES_ERROR_LOG_DOWNLOAD;
  constructor(public payload: string) {}
}
export class ItemCodeErrorLogDownloadSuccess implements Action {
  readonly type =
    GEPPurityConfigActionTypes.ITEM_CODES_ERROR_LOG_DOWNLOAD_SUCCESS;
  constructor(public payload: any) {}
}
export class ItemCodeErrorLogDownloadFailure implements Action {
  readonly type =
    GEPPurityConfigActionTypes.ITEM_CODES_ERROR_LOG_DOWNLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateToggleButton implements Action {
  readonly type = GEPPurityConfigActionTypes.UPDATE_TOGGLE_BUTTON;
  constructor(public payload: { configId: string; isActive: boolean }) {}
}
export class UpdateToggleButtonSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.UPDATE_TOGGLE_BUTTON_SUCCESS;
}
export class UpdateToggleButtonFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.UPDATE_TOGGLE_BUTTON_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadGoldRanges implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_GOLD_RANGES;
  constructor(public payload: string) {}
}
export class LoadGoldRangesSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_GOLD_RANGES_SUCCESS;
  constructor(public payload: Ranges[]) {}
}
export class LoadGoldRangesFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_GOLD_RANGES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSilverRanges implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_SILVER_RANGES;
  constructor(public payload: string) {}
}
export class LoadSilverRangesSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_SILVER_RANGES_SUCCESS;
  constructor(public payload: Ranges[]) {}
}
export class LoadSilverRangesFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_SILVER_RANGES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPlatinumRanges implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_PLATINUM_RANGES;
  constructor(public payload: string) {}
}
export class LoadPlatinumRangesSuccess implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_PLATINUM_RANGES_SUCCESS;
  constructor(public payload: Ranges[]) {}
}
export class LoadPlatinumRangesFailure implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_PLATINUM_RANGES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
// export class LoadLocations implements Action {
//   readonly type = GEPPurityConfigActionTypes.LOAD_LOCATIONS;
// }

// export class LoadLocationsSuccess implements Action {
//   readonly type = GEPPurityConfigActionTypes.LOAD_LOCATIONS_SUCCESS;
//   constructor(public payload: Location[]) {}
// }
// export class LoadLocationsFailure implements Action {
//   readonly type = GEPPurityConfigActionTypes.LOAD_LOCATIONS_FAILURE;
//   constructor(public payload: CustomErrors) {}
// }

export class LoadSelectedPgs implements Action {
  readonly type = GEPPurityConfigActionTypes.LOAD_SELETED_PRODUCT_GROUPS;
  constructor(
    public payload: {
      configId: string;
      pageIndex: number;
      pageSize: number;
    }
  ) {}
}

export class LoadSelectedPgsSuccess implements Action {
  readonly type =
    GEPPurityConfigActionTypes.LOAD_SELETED_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: ProductGroupMappingResponse) {}
}
export class LoadSelectedPgsFailure implements Action {
  readonly type =
    GEPPurityConfigActionTypes.LOAD_SELETED_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export type GEPPurityConfigActions =
  | LoadGEPPurityConfig
  | LoadGEPPurityConfigSuccess
  | LoadGEPPurityConfigFailure
  | SearchConfigName
  | SearchConfigNameSuccess
  | SearchConfigNameFailure
  | SaveGEPDetails
  | SaveGEPDetailsSuccess
  | SaveGEPDetailsFailure
  | LoadMetalTypes
  | LoadMetalTypesSuccess
  | LoadMetalTypesFailure
  | LoadItemTypes
  | LoadItemTypesSuccess
  | LoadItemTypesFailure
  | LoadGoldRanges
  | LoadGoldRangesSuccess
  | LoadGoldRangesFailure
  | SavePurityDetails
  | SavePurityDetailsSuccess
  | SavePurityDetailsFailure
  | UploadFile
  | UploadFileSuccess
  | UploadFileFailure
  | GetExcludeThemeCodes
  | GetExcludeThemeCodesSuccess
  | GetExcludeThemeCodesFailure
  | GetExcludeItemCodes
  | GetExcludeItemCodesSuccess
  | GetExcludeItemCodesFailure
  | LoadProductGroups
  | LoadProductGroupsSuccess
  | LoadProductGroupsFailure
  | SearchProductGroup
  | SearchProductGroupSuccess
  | SearchProductGroupFailure
  | ResetGepPurityConfiguration
  | SaveProductGroupsDeduction
  | SaveProductGroupsDeductionSuccess
  | SaveProductGroupsDeductionFailure
  | updateProductGroupsDeduction
  | updateProductGroupsDeductionSuccess
  | updateProductGroupsDeductionFailure
  | LoadGepPurityDetails
  | LoadGepPurityDetailsSuccess
  | LoadGepPurityDetailsFailure
  | LoadGepDetails
  | LoadGepDetailsSuccess
  | LoadGepDetailsFailure
  | LoadProductGroupsDeduction
  | LoadProductGroupsDeductionSuccess
  | LoadProductGroupsDeductionFailure
  | SaveThemeCodes
  | SaveThemeCodesSuccess
  | SaveThemeCodesFailure
  | DeleteThemeCodes
  | DeleteThemeCodesSuccess
  | DeleteThemeCodesFailure
  | RemoveProductGroups
  | RemoveProductGroupsSuccess
  | RemoveProductGroupsFailure
  | SearchItemCode
  | SearchItemCodeSucccess
  | SearchItemCodeFailure
  | ItemCodeErrorLogDownload
  | ItemCodeErrorLogDownloadSuccess
  | ItemCodeErrorLogDownloadFailure
  | UpdateToggleButton
  | UpdateToggleButtonSuccess
  | UpdateToggleButtonFailure
  | LoadSilverRanges
  | LoadSilverRangesSuccess
  | LoadSilverRangesFailure
  | LoadPlatinumRanges
  | LoadPlatinumRangesSuccess
  | LoadPlatinumRangesFailure
  // | LoadLocations
  // | LoadLocationsSuccess
  // | LoadLocationsFailure
  | LoadSelectedPgs
  | LoadSelectedPgsSuccess
  | LoadSelectedPgsFailure;
