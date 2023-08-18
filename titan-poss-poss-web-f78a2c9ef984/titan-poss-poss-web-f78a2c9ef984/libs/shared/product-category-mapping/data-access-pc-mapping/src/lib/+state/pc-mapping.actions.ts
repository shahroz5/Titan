import { Action } from '@ngrx/store';
import { CustomErrors, ProductCategory } from '@poss-web/shared/models';

export enum ProductCategoryMappingActionTypes {
  LOAD_PRODUCT_CATEGORIES = '[ product-category-mapping ] Load Product Category',
  LOAD_PRODUCT_CATEGORIES_SUCCESS = '[ product-category-mapping ] Load Product Category Success',
  LOAD_PRODUCT_CATEGORIES_FAILURE = '[ product-category-mapping ] Load Product Category Failure',

  LOAD_RESET = '[product-group-mapping] Load Reset'
}

export class LoadProductCategory implements Action {
  readonly type = ProductCategoryMappingActionTypes.LOAD_PRODUCT_CATEGORIES;
}

export class LoadProductCategorySuccess implements Action {
  readonly type =
    ProductCategoryMappingActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS;
  constructor(public payload: ProductCategory[]) {}
}

export class LoadProductCategoryFailure implements Action {
  readonly type =
    ProductCategoryMappingActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = ProductCategoryMappingActionTypes.LOAD_RESET;
}

export type ProductCategoryMappingActions =
  | LoadProductCategory
  | LoadProductCategorySuccess
  | LoadProductCategoryFailure
  | LoadReset;
