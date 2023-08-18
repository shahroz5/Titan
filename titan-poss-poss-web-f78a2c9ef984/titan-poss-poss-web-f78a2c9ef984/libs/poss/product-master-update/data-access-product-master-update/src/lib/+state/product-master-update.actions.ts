import { Action } from '@ngrx/store';
import { CustomErrors } from '@poss-web/shared/models';

export enum ProductMasterUpdateActionTypes {
  LOAD_PRODUCT_MASTER_UPDATE = '[Product-Master-Update] Load Product Master Update',
  LOAD_PRODUCT_MASTER_UPDATE_SUCCESS = '[Product-Master-Update] Load Product Master Update Success',
  LOAD_PRODUCT_MASTER_UPDATE_FAILURE = '[Product-Master-Update] Load Product Master Update Failure'
}

export class LoadProductMasterUpdate implements Action {
  readonly type = ProductMasterUpdateActionTypes.LOAD_PRODUCT_MASTER_UPDATE;
  constructor(readonly itemCode: string, readonly lotNumber: string) {}
}

export class LoadProductMasterUpdateSuccess implements Action {
  readonly type =
    ProductMasterUpdateActionTypes.LOAD_PRODUCT_MASTER_UPDATE_SUCCESS;
  constructor(readonly payload: any) {}
}

export class LoadProductMasterUpdateFailure implements Action {
  readonly type =
    ProductMasterUpdateActionTypes.LOAD_PRODUCT_MASTER_UPDATE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export type ProductMasterActions =
  | LoadProductMasterUpdate
  | LoadProductMasterUpdateSuccess
  | LoadProductMasterUpdateFailure;
