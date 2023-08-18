import { Action } from '@ngrx/store';
import {
  EncircleProductGroupMappingSavePayload,
  CustomErrors,
  ProductGroup,
  ProductGroupMappingResponse
} from '@poss-web/shared/models';
export enum EncircleProductGroupMappingActionTypes {
  SAVE_ENCIRCLE_PRODUCT_GROUPS = '[encircle-product-group-mapping] Save Encircle Product Groups',
  SAVE_ENCIRCLE_PRODUCT_GROUPS_SUCCESS = '[encircle-product-group-mapping] Save Encircle Product Groups Success',
  SAVE_ENCIRCLE_PRODUCT_GROUPS_FAILURE = '[encircle-product-group-mapping] Save Encircle Product Groups Failure',

  LOAD_SELECTED_PRODUCT_GROUPS = '[encircle-product-group-mapping] Load SelectedProduct Groups',
  LOAD_SELECTED_PRODUCT_GROUPS_SUCCESS = '[encircle-product-group-mapping] Load SelectedProduct Groups Success',
  LOAD_SELECTED_PRODUCT_GROUPS_FAILURE = '[encircle-product-group-mapping] Load SelectedProduct Groups Failure',

  RESET_PRODUCT_GROUPS = '[encircle-product-group-mapping] Reset Product Groups',

  REMOVE_ENCIRCLE_PRODUCT_GROUPS = '[encircle-product-group-mapping] Remove Encircle Product Groups',
  REMOVE_ENCIRCLE_PRODUCT_GROUPS_SUCCESS = '[encircle-product-group-mapping] Remove Encircle Product Groups Success',
  REMOVE_ENCIRCLE_PRODUCT_GROUPS_FAILURE = '[encircle-product-group-mapping] Remove Encircle Product Groups Failure',

  LOAD_PRODUCT_GROUPS = '[encircle-product-group-mapping]Load Product Groups',
  LOAD_PRODUCT_GROUPS_SUCCESS = '[encircle-product-group-mapping]Load Product Groups Success',
  LOAD_PRODUCT_GROUPS_FAILURE = '[encircle-product-group-mapping]Load Product Groups Failure',

  SEARCH_PRODUCT_GROUP_CODE = '[encircle-product-group-mapping] Search Product Group Code',
  SEARCH_PRODUCT_GROUP_CODE_SUCCESS = '[encircle-product-group-mapping] Search Product Group Code Success',
  SEARCH_PRODUCT_GROUP_CODE_FAILURE = '[encircle-product-group-mapping] Search Product Group Code Failure',

  LOAD_ALL_SELECTED_PRODUCT_GROUPS = '[encircle-product-group-mapping] Load All Selected Product Groups',
  LOAD_ALL_SELECTED_PRODUCT_GROUPS_SUCCESS = '[encircle-product-group-mapping] Load All Selected Product Groups Success',
  LOAD_ALL_SELECTED_PRODUCT_GROUPS_FAILURE = '[encircle-product-group-mapping] Load All Selected Product Groups Failure'
}

export class SaveEncircleProdcutGroups implements Action {
  readonly type =
    EncircleProductGroupMappingActionTypes.SAVE_ENCIRCLE_PRODUCT_GROUPS;
  constructor(public payload: EncircleProductGroupMappingSavePayload) {}
}
export class SaveEncircleProdcutGroupsSuccess implements Action {
  readonly type =
    EncircleProductGroupMappingActionTypes.SAVE_ENCIRCLE_PRODUCT_GROUPS_SUCCESS;
}
export class SaveEncircleProdcutGroupsFailure implements Action {
  readonly type =
    EncircleProductGroupMappingActionTypes.SAVE_ENCIRCLE_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadSelectedProductGroups implements Action {
  readonly type =
    EncircleProductGroupMappingActionTypes.LOAD_SELECTED_PRODUCT_GROUPS;
  constructor(
    public payload: { paymentMode: string; pageIndex: number; pageSize: number; description?: string;}
  ) {}
}
export class LoadSelectedProductGroupsSuccess implements Action {
  readonly type =
    EncircleProductGroupMappingActionTypes.LOAD_SELECTED_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: ProductGroupMappingResponse) {}
}
export class LoadSelectedProductGroupsFailure implements Action {
  readonly type =
    EncircleProductGroupMappingActionTypes.LOAD_SELECTED_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetProductGroups implements Action {
  readonly type = EncircleProductGroupMappingActionTypes.RESET_PRODUCT_GROUPS;
}
export class RemoveEncircleProdcutGroups implements Action {
  readonly type =
    EncircleProductGroupMappingActionTypes.REMOVE_ENCIRCLE_PRODUCT_GROUPS;
  constructor(public payload: EncircleProductGroupMappingSavePayload) {}
}
export class RemoveEncircleProdcutGroupsSuccess implements Action {
  readonly type =
    EncircleProductGroupMappingActionTypes.REMOVE_ENCIRCLE_PRODUCT_GROUPS_SUCCESS;
}
export class RemoveEncircleProdcutGroupsFailure implements Action {
  readonly type =
    EncircleProductGroupMappingActionTypes.REMOVE_ENCIRCLE_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadProductGroups implements Action {
  readonly type = EncircleProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS;
}
export class LoadProductGroupsSuccess implements Action {
  readonly type =
    EncircleProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: ProductGroup[]) {}
}
export class LoadProductGroupsFailure implements Action {
  readonly type =
    EncircleProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchProductGroupCode implements Action {
  readonly type =
    EncircleProductGroupMappingActionTypes.SEARCH_PRODUCT_GROUP_CODE;
  constructor(public payload: string) {}
}
export class SearchProductGroupCodeSuccess implements Action {
  readonly type =
    EncircleProductGroupMappingActionTypes.SEARCH_PRODUCT_GROUP_CODE_SUCCESS;
  constructor(public payload: ProductGroupMappingResponse) {}
}
export class SearchProductGroupCodeFailure implements Action {
  readonly type =
    EncircleProductGroupMappingActionTypes.SEARCH_PRODUCT_GROUP_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadAllSelectedProductGroups implements Action {
  readonly type =
    EncircleProductGroupMappingActionTypes.LOAD_ALL_SELECTED_PRODUCT_GROUPS;
  constructor(
    public payload: { paymentMode: string; pageIndex: number; pageSize: number }
  ) {}
}
export class LoadAllSelectedProductGroupsSuccess implements Action {
  readonly type =
    EncircleProductGroupMappingActionTypes.LOAD_ALL_SELECTED_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: ProductGroupMappingResponse) {}
}
export class LoadAllSelectedProductGroupsFailure implements Action {
  readonly type =
    EncircleProductGroupMappingActionTypes.LOAD_ALL_SELECTED_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export type EncircleProductGroupMappingActions =
  | SaveEncircleProdcutGroups
  | SaveEncircleProdcutGroupsSuccess
  | SaveEncircleProdcutGroupsFailure
  | LoadSelectedProductGroups
  | LoadSelectedProductGroupsSuccess
  | LoadSelectedProductGroupsFailure
  | ResetProductGroups
  | RemoveEncircleProdcutGroups
  | RemoveEncircleProdcutGroupsSuccess
  | RemoveEncircleProdcutGroupsFailure
  | LoadProductGroups
  | LoadProductGroupsSuccess
  | LoadProductGroupsFailure
  | SearchProductGroupCode
  | SearchProductGroupCodeSuccess
  | SearchProductGroupCodeFailure
  | LoadAllSelectedProductGroups
  | LoadAllSelectedProductGroupsSuccess
  | LoadAllSelectedProductGroupsFailure;
