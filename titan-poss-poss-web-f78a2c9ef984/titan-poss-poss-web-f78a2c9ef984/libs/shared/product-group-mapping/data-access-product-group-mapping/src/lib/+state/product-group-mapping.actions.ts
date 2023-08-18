import { Action } from '@ngrx/store';
import { CustomErrors, ProductGroup } from '@poss-web/shared/models';

export enum ProductGroupMappingActionTypes {
  LOAD_PRODUCT_GROUPS = '[product-group-mapping]Load Product groups',
  LOAD_PRODUCT_GROUPS_SUCCESS = '[product-group-mapping]Load Product groups Success',
  LOAD_PRODUCT_GROUPS_FAILURE = '[product-group-mapping] Load Product groups Failure',

  LOAD_RESET = '[product-group-mapping] Load Reset'
}

export class LoadProductGroupMapping implements Action {
  readonly type = ProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS;
  constructor(public payload?: string) {}
}

export class LoadProductGroupMappingSuccess implements Action {
  readonly type = ProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: ProductGroup[]) {}
}

export class LoadProductGroupMappingFailure implements Action {
  readonly type = ProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = ProductGroupMappingActionTypes.LOAD_RESET;
}

export type ProductGroupActions =
  | LoadProductGroupMapping
  | LoadProductGroupMappingSuccess
  | LoadProductGroupMappingFailure
  | LoadReset;
