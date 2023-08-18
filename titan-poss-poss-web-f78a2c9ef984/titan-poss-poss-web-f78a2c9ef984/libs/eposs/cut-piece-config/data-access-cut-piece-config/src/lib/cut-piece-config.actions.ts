import { Action } from '@ngrx/store';
import {
  CustomErrors,
  ProductCategory,
  ProductCategoryMapping,
  ProductCategoryMappingList
} from '@poss-web/shared/models';
export enum CutPieceConfigActionTypes {
  LOAD_CUT_PIECE_CONFIGS = '[cut-piece-config]Load CutPiece Configs',
  LOAD_CUT_PIECE_CONFIGS_SUCCESS = '[cut-piece-config]Load CutPiece Configs Success',
  LOAD_CUT_PIECE_CONFIGS_FAILURE = '[cut-piece-config]Load CutPiece Configs Failure',

  SEARCH_PRODUCT_CATEGORY_CODE = '[cut-piece-config]Search Prouduct Category Code',
  SEARCH_PRODUCT_CATEGORY_CODE_SUCCESS = '[cut-piece-config]Search Prouduct Category Code Success',
  SEARCH_PRODUCT_CATEGORY_CODE_FAILURE = '[cut-piece-config]Search Prouduct Category Code Failure',

  SAVE_CUT_PIECE_CONFIG = '[cut-piece-config]Save Cut Piece Config',
  SAVE_CUT_PIECE_CONFIG_SUCCESS = '[cut-piece-config]Save Cut Piece Config Success',
  SAVE_CUT_PIECE_CONFIG_FAILURE = '[cut-piece-config]Save Cut Piece Config Failure',

  LOAD_PRODUCT_CATEGORIES_MAPPING = '[cut-piece-config]Load Product Categories Mapping',
  LOAD_PRODUCT_CATEGORIES_MAPPING_SUCCESS = '[cut-piece-config]Load Product Categories Mapping Success',
  LOAD_PRODUCT_CATEGORIES_MAPPING_FAILURE = '[cut-piece-config]Load Product Categories Mapping Failure',

  LOAD_PRODUCT_CATEGORIES = '[cut-piece-config]Load Product Categories',
  LOAD_PRODUCT_CATEGORIES_SUCCESS = '[cut-piece-config]Load Product Categories Success',
  LOAD_PRODUCT_CATEGORIES_FAILURE = '[cut-piece-config]Load Product Categories Failure',

  RESET_CUT_PIECE_CONFIG = '[cut-piece-config]Reset CutPiece Config',

  LOAD_SELECTED_PRODUCT_CATEGORIES = '[cut-piece-config]Load Selected Product Categories',
  LOAD_SELECTED_PRODUCT_CATEGORIES_SUCCESS = '[cut-piece-config]Load Selected Product Categories Success',
  LOAD_SELECTED_PRODUCT_CATEGORIES_FAILURE = '[cut-piece-config]Load Selected Product Categories Failure'
}
export class LoadCutPieceConfigs implements Action {
  readonly type = CutPieceConfigActionTypes.LOAD_CUT_PIECE_CONFIGS;
}
export class LoadCutPieceConfigsSuccess implements Action {
  readonly type = CutPieceConfigActionTypes.LOAD_CUT_PIECE_CONFIGS_SUCCESS;
  constructor(public payload: string) {}
}

export class LoadCutPieceConfigsFailure implements Action {
  readonly type = CutPieceConfigActionTypes.LOAD_CUT_PIECE_CONFIGS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchProductCategoryCode implements Action {
  readonly type = CutPieceConfigActionTypes.SEARCH_PRODUCT_CATEGORY_CODE;
  constructor(
    public payload: { productCategoryCode: string; configId: string }
  ) {}
}
export class SearchProductCategroyCodeSuccess implements Action {
  readonly type =
    CutPieceConfigActionTypes.SEARCH_PRODUCT_CATEGORY_CODE_SUCCESS;
  constructor(public payload: ProductCategoryMappingList[]) {}
}
export class SearchProductCategoryCodeFailure implements Action {
  readonly type =
    CutPieceConfigActionTypes.SEARCH_PRODUCT_CATEGORY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveCutPieceConfig implements Action {
  readonly type = CutPieceConfigActionTypes.SAVE_CUT_PIECE_CONFIG;
  constructor(public payload: ProductCategoryMapping) {}
}
export class SaveCutPieceConfigSuccess implements Action {
  readonly type = CutPieceConfigActionTypes.SAVE_CUT_PIECE_CONFIG_SUCCESS;
}
export class SaveCutPieceConfigFailure implements Action {
  readonly type = CutPieceConfigActionTypes.SAVE_CUT_PIECE_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadProductCategoryMapping implements Action {
  readonly type = CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES_MAPPING;
  constructor(
    public payload: {
      configId: string;
      pageIndex: number;
      pageSize: number;
    }
  ) {}
}
export class LoadProductCategoryMappingSuccess implements Action {
  readonly type =
    CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES_MAPPING_SUCCESS;
  constructor(
    public payload: {
      response: ProductCategoryMappingList[];
      totalElements: number;
    }
  ) {}
}
export class LoadProductCategoryMappingFailure implements Action {
  readonly type =
    CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES_MAPPING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadProductCategories implements Action {
  readonly type = CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES;
}
export class LoadProductCategoriesSuccess implements Action {
  readonly type = CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS;
  constructor(public payload: ProductCategory[]) {}
}

export class LoadProductCategoriesFailure implements Action {
  readonly type = CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetCutPieceConfig implements Action {
  readonly type = CutPieceConfigActionTypes.RESET_CUT_PIECE_CONFIG;
}
export class LoadSelectedPcs implements Action {
  readonly type = CutPieceConfigActionTypes.LOAD_SELECTED_PRODUCT_CATEGORIES;
  constructor(
    public payload: {
      configId: string;
      pageIndex: number;
      pageSize: number;
    }
  ) {}
}
export class LoadSelectedPcsSuccess implements Action {
  readonly type =
    CutPieceConfigActionTypes.LOAD_SELECTED_PRODUCT_CATEGORIES_SUCCESS;
  constructor(public payload: ProductCategoryMappingList[]) {}
}
export class LoadSelectedPcsFailure implements Action {
  readonly type =
    CutPieceConfigActionTypes.LOAD_SELECTED_PRODUCT_CATEGORIES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type CutPieceConfigActions =
  | LoadCutPieceConfigs
  | LoadCutPieceConfigsSuccess
  | LoadCutPieceConfigsFailure
  | SearchProductCategoryCode
  | SearchProductCategroyCodeSuccess
  | SearchProductCategoryCodeFailure
  | SaveCutPieceConfig
  | SaveCutPieceConfigSuccess
  | SaveCutPieceConfigFailure
  | LoadProductCategoryMapping
  | LoadProductCategoryMappingSuccess
  | LoadProductCategoryMappingFailure
  | LoadProductCategories
  | LoadProductCategoriesSuccess
  | LoadProductCategoriesFailure
  | ResetCutPieceConfig
  | LoadSelectedPcs
  | LoadSelectedPcsSuccess
  | LoadSelectedPcsFailure;
