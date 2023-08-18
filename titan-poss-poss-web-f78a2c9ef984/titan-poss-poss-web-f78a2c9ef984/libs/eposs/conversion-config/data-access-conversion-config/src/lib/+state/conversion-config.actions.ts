import {
  ConversionConfigListPayload,
  ConversionConfigList,
  CustomErrors,
  ConversionConfigByIdPayload,
  CheckBoxHeader,
  SaveConversionConfigValuesPayload,
  UpdateToggleButtonPayload
} from '@poss-web/shared/models';
import { Action } from '@ngrx/store';
export enum ConversionConfigActionTypes {
  LOAD_CONVERSION_CONFIG_LIST = '[ConversionConfig] Load Conversion Configuration List',
  LOAD_CONVERSION_CONFIG_LIST_SUCCESS = '[ConversionConfig] Load Conversion Configuration List Success',
  LOAD_CONVERSION_CONFIG_LIST_FAILURE = '[ConversionConfig] Load Conversion Configuration List Failure',

  CONVERSION_CONFIG_DETAILS_BY_ID = '[ConversionConfig] Conversion Config Details By Id',
  CONVERSION_CONFIG_DETAILS_BY_ID_SUCCESS = '[ConversionConfig] Conversion Config Details By Id Success',
  CONVERSION_CONFIG_DETAILS_BY_ID_FAILURE = '[ConversionConfig] Conversion Config Details By Id Failure',

  UPDATE_CONVERSION_CONFIG_DETAILS = '[ConversionConfig] Update Conversion Config Details',
  UPDATE_CONVERSION_CONFIG_DETAILS_SUCCESS = '[ConversionConfig] Update Conversion Config Details Success',
  UPDATE_CONVERSION_CONFIG_DETAILS_FAILURE = '[ConversionConfig] Update Conversion Config Details Failure',

  RESET_CONVERSION_CONFIG = '[ConversionConfig] Reset Conversion Conffiguration',

  LOAD_PRODUCT_GROUPS = '[ConversionConfig]Load Product Groups',
  LOAD_PRODUCT_GROUPS_SUCCESS = '[ConversionConfig]Load Product Groups Success',
  LOAD_PRODUCT_GROUPS_FAILURE = '[ConversionConfig]Load Product Groups Failure',

  LOAD_PRODUCT_CATEGORIES = '[ConversionConfig]Load Product Categories',
  LOAD_PRODUCT_CATEGORIES_SUCCESS = '[ConversionConfig]Load Product Categories Success',
  LOAD_PRODUCT_CATEGORIES_FAILURE = '[ConversionConfig]Load Product Categories Failure',

  SEARCH_CONFIG_NAME = '[ConversionConfig]Search Config Name',
  SEARCH_CONFIG_NAME_SUCCESS = '[ConversionConfig]Search Config Name Success',
  SEARCH_CONFIG_NAME_FAILURE = '[ConversionConfig]Search Config Name Failure',

  SAVE_CONVERSION_CONFIG_VALUES = '[ConversionConfig] Save Conversion Config Values',
  SAVE_CONVERSION_CONFIG_VALUES_SUCCESS = '[ConversionConfig] Save Conversion Config Values Success',
  SAVE_CONVERSION_CONFIG_VALUES_FAILURE = '[ConversionConfig] Save Conversion Config Values Failure',

  UPDATE_TOGGLE_BUTTON = '[ConversionConfig] Update Toggle Button',
  UPDATE_TOGGLE_BUTTON_SUCCESS = '[ConversionConfig] Update Toggle Button Success',
  UPDATE_TOGGLE_BUTTON_FAILURE = '[ConversionConfig] Update Toggle Button Failure'
}
export class LoadConversionConfigList implements Action {
  readonly type = ConversionConfigActionTypes.LOAD_CONVERSION_CONFIG_LIST;
  constructor(public payload: ConversionConfigListPayload) {}
}
export class LoadConversionConfigListSuccess implements Action {
  readonly type =
    ConversionConfigActionTypes.LOAD_CONVERSION_CONFIG_LIST_SUCCESS;
  constructor(public payload: ConversionConfigList) {}
}

export class LoadConversionConfigListFailure implements Action {
  readonly type =
    ConversionConfigActionTypes.LOAD_CONVERSION_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ConversionConfigDetailsById implements Action {
  readonly type = ConversionConfigActionTypes.CONVERSION_CONFIG_DETAILS_BY_ID;
  constructor(public payload: number) {}
}
export class ConversionConfigDetailsByIdSuccess implements Action {
  readonly type =
    ConversionConfigActionTypes.CONVERSION_CONFIG_DETAILS_BY_ID_SUCCESS;
  constructor(public payload: ConversionConfigByIdPayload) {}
}
export class ConversionConfigDetailsByIdFailure implements Action {
  readonly type =
    ConversionConfigActionTypes.CONVERSION_CONFIG_DETAILS_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateConversionConfigDetails implements Action {
  readonly type = ConversionConfigActionTypes.UPDATE_CONVERSION_CONFIG_DETAILS;
  constructor(public payload: SaveConversionConfigValuesPayload) {}
}
export class UpdateConversionConfigDetailsSuccess implements Action {
  readonly type =
    ConversionConfigActionTypes.UPDATE_CONVERSION_CONFIG_DETAILS_SUCCESS;
}
export class UpdateConversionConfigDetailsFailure implements Action {
  readonly type =
    ConversionConfigActionTypes.UPDATE_CONVERSION_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetConversionConfig implements Action {
  readonly type = ConversionConfigActionTypes.RESET_CONVERSION_CONFIG;
}
export class LoadProductGroups implements Action {
  readonly type = ConversionConfigActionTypes.LOAD_PRODUCT_GROUPS;
}
export class LoadProductGroupsSuccess implements Action {
  readonly type = ConversionConfigActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: CheckBoxHeader[]) {}
}
export class LoadProductGroupsFailure implements Action {
  readonly type = ConversionConfigActionTypes.LOAD_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadProductCategories implements Action {
  readonly type = ConversionConfigActionTypes.LOAD_PRODUCT_CATEGORIES;
}
export class LoadProductCategoriesSuccess implements Action {
  readonly type = ConversionConfigActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS;
  constructor(public payload: CheckBoxHeader[]) {}
}
export class LoadProductCategoriesFailure implements Action {
  readonly type = ConversionConfigActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchConfigName implements Action {
  readonly type = ConversionConfigActionTypes.SEARCH_CONFIG_NAME;
  constructor(public payload: string) {}
}
export class SearchConfigNameSuccess implements Action {
  readonly type = ConversionConfigActionTypes.SEARCH_CONFIG_NAME_SUCCESS;
  constructor(public payload: ConversionConfigList) {}
}
export class SearchConfigNameFailure implements Action {
  readonly type = ConversionConfigActionTypes.SEARCH_CONFIG_NAME_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveConversionConfigValues implements Action {
  readonly type = ConversionConfigActionTypes.SAVE_CONVERSION_CONFIG_VALUES;
  constructor(public payload: SaveConversionConfigValuesPayload) {}
}
export class SaveConversionConfigValuesSuccess implements Action {
  readonly type =
    ConversionConfigActionTypes.SAVE_CONVERSION_CONFIG_VALUES_SUCCESS;
  constructor(public payload: ConversionConfigByIdPayload) {}
}
export class SaveConversionConfigValuesFailure implements Action {
  readonly type =
    ConversionConfigActionTypes.SAVE_CONVERSION_CONFIG_VALUES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateToggleButton implements Action {
  readonly type = ConversionConfigActionTypes.UPDATE_TOGGLE_BUTTON;
  constructor(public payload: UpdateToggleButtonPayload) {}
}
export class UpdateToggleButtonSuccess implements Action {
  readonly type = ConversionConfigActionTypes.UPDATE_TOGGLE_BUTTON_SUCCESS;
}
export class UpdateToggleButtonFailure implements Action {
  readonly type = ConversionConfigActionTypes.UPDATE_TOGGLE_BUTTON_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type ConversionConfigActions =
  | LoadConversionConfigList
  | LoadConversionConfigListSuccess
  | LoadConversionConfigListFailure
  | ConversionConfigDetailsById
  | ConversionConfigDetailsByIdSuccess
  | ConversionConfigDetailsByIdFailure
  | UpdateConversionConfigDetails
  | UpdateConversionConfigDetailsSuccess
  | UpdateConversionConfigDetailsFailure
  | ResetConversionConfig
  | LoadProductGroups
  | LoadProductGroupsSuccess
  | LoadProductGroupsFailure
  | LoadProductCategories
  | LoadProductCategoriesSuccess
  | LoadProductCategoriesFailure
  | SearchConfigName
  | SearchConfigNameSuccess
  | SearchConfigNameFailure
  | SaveConversionConfigValues
  | SaveConversionConfigValuesSuccess
  | SaveConversionConfigValuesFailure
  | UpdateToggleButton
  | UpdateToggleButtonSuccess
  | UpdateToggleButtonFailure;
