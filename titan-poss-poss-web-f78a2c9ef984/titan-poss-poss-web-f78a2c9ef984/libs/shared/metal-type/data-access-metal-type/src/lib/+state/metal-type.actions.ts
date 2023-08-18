import { Action } from '@ngrx/store';
import {
  CustomErrors,
  MetalTypePayload,
  UpdateMetalTypePayload,
  MaterialType,
  CreateMetalTypePayload,
  MetalTypeListing,
  MaterialTypelov
} from '@poss-web/shared/models';

export enum MetalTypeActions {
  LOAD_METAL_TYPE_LISTING = '[Metal-type-list] Load Metal Type List',
  LOAD_METAL_TYPE_LISTING_SUCCESS = '[Metal-type-list] Load Metal Type List Success',
  LOAD_METAL_TYPE_LISTING_FAILURE = '[Metal-type-list] Load Metal Type List Failure',

  SEARCH_METAL_TYPE_BY_MATERIAL_CODE = '[Metal-type-list] Search Metal Type By Material Code',
  SEARCH_METAL_TYPE_BY_MATERIAL_CODE_SUCCESS = '[Metal-type-list] Search Metal Type By Material Code Success',
  SEARCH_METAL_TYPE_BY_MATERIAL_CODE_FAILURE = '[Metal-type-list] Search Metal Type By Material Code Failure',

  CREATE_METAL_TYPE = '[Metal-type-list] Create Metal Type',
  CREATE_METAL_TYPE_SUCCESS = '[Metal-type-list] Create Metal Type Success',
  CREATE_METAL_TYPE_FAILURE = '[Metal-type-list] Create Metal Type Failure',

  UPDATE_METAL_TYPE_DETAIL = '[Metal-type-list] Update Metal Type Details',
  UPDATE_METAL_TYPE_DETAIL_SUCCESS = '[Metal-type-list] Update Metal Type Detail Success',
  UPDATE_METAL_TYPE_DETAIL_FAILURE = '[Metal-type-list] Update Metal Type Detail Failure',

  LOAD_METAL_TYPE_DETAIL_BY_MATERIAL_CODE = '[Metal-type-list] Load Metal Type Detail By Material Code',
  LOAD_METAL_TYPE_DETAIL_BY_MATERIAL_CODE_SUCCESS = '[Metal-type-list] Load Metal Type Detail By Material Code Success',
  LOAD_METAL_TYPE_DETAIL_BY_MATERIAL_CODE_FAILURE = '[Metal-type-list] Load Metal Type Detail By Material Code Failure',

  LOAD_MATERIAL_TYPE_LOV = '[Metal-type-list] Load Material Type Lov',
  LOAD_MATERIAL_TYPE_LOV_SUCCESS = '[Metal-type-list]  Load Material Type Lov Success',
  LOAD_MATERIAL_TYPE_LOV_FAILURE = '[Metal-type-list] Load Material Type Lov Failure',

  LOAD_RESET = '[Metal-type-list] Load Reset'
}

export class LoadMaterialTypeLov implements Action {
  readonly type = MetalTypeActions.LOAD_MATERIAL_TYPE_LOV;
}

export class LoadMaterialTypeLovSuccess implements Action {
  readonly type = MetalTypeActions.LOAD_MATERIAL_TYPE_LOV_SUCCESS;
  constructor(public payload: MaterialTypelov[]) {}
}
export class LoadMaterialTypeLovFailure implements Action {
  readonly type = MetalTypeActions.LOAD_MATERIAL_TYPE_LOV_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadMetalTypeDetailByMaterialCode implements Action {
  readonly type = MetalTypeActions.LOAD_METAL_TYPE_DETAIL_BY_MATERIAL_CODE;
  constructor(public payload: string) {}
}
export class LoadMetalTypeDetailByMaterialCodeSuccess implements Action {
  readonly type =
    MetalTypeActions.LOAD_METAL_TYPE_DETAIL_BY_MATERIAL_CODE_SUCCESS;
  constructor(public payload: MaterialType) {}
}
export class LoadMetalTypeDetailByMaterialCodeFailure implements Action {
  readonly type =
    MetalTypeActions.LOAD_METAL_TYPE_DETAIL_BY_MATERIAL_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateMetalTypeDeatil implements Action {
  readonly type = MetalTypeActions.UPDATE_METAL_TYPE_DETAIL;
  constructor(public payload: UpdateMetalTypePayload) {}
}
export class UpdateMetalTypeDeatilSuccess implements Action {
  readonly type = MetalTypeActions.UPDATE_METAL_TYPE_DETAIL_SUCCESS;
  constructor(public payload: MaterialType) {}
}
export class UpdateMetalTypeDeatilFailure implements Action {
  readonly type = MetalTypeActions.UPDATE_METAL_TYPE_DETAIL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class CreateMetalType implements Action {
  readonly type = MetalTypeActions.CREATE_METAL_TYPE;
  constructor(public payload: CreateMetalTypePayload) {}
}
export class CreateMetalTypeSuccess implements Action {
  readonly type = MetalTypeActions.CREATE_METAL_TYPE_SUCCESS;
}
export class CreateMetalTypeFailure implements Action {
  readonly type = MetalTypeActions.CREATE_METAL_TYPE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchMetalTypeByMaterialCode implements Action {
  readonly type = MetalTypeActions.SEARCH_METAL_TYPE_BY_MATERIAL_CODE;
  constructor(public payload: string) {}
}

export class SearchMetalTypeByMaterialCodeSuccess implements Action {
  readonly type = MetalTypeActions.SEARCH_METAL_TYPE_BY_MATERIAL_CODE_SUCCESS;
  constructor(public payload: MetalTypeListing) {}
}

export class SearchMetalTypeByMaterialCodeFailure implements Action {
  readonly type = MetalTypeActions.SEARCH_METAL_TYPE_BY_MATERIAL_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadMetalTypeList implements Action {
  readonly type = MetalTypeActions.LOAD_METAL_TYPE_LISTING;
  constructor(public payload: MetalTypePayload) {}
}

export class LoadMetalTypeListSuccess implements Action {
  readonly type = MetalTypeActions.LOAD_METAL_TYPE_LISTING_SUCCESS;
  constructor(public payload: MetalTypeListing) {}
}

export class LoadMetalTypeListFailure implements Action {
  readonly type = MetalTypeActions.LOAD_METAL_TYPE_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = MetalTypeActions.LOAD_RESET;
}

export type MetalTypeAction =
  | LoadMetalTypeList
  | LoadMetalTypeListSuccess
  | LoadMetalTypeListFailure
  | SearchMetalTypeByMaterialCode
  | SearchMetalTypeByMaterialCodeSuccess
  | SearchMetalTypeByMaterialCodeFailure
  | CreateMetalType
  | CreateMetalTypeSuccess
  | CreateMetalTypeFailure
  | UpdateMetalTypeDeatil
  | UpdateMetalTypeDeatilSuccess
  | UpdateMetalTypeDeatilFailure
  | LoadMetalTypeDetailByMaterialCode
  | LoadMetalTypeDetailByMaterialCodeSuccess
  | LoadMetalTypeDetailByMaterialCodeFailure
  | LoadMaterialTypeLov
  | LoadMaterialTypeLovSuccess
  | LoadMaterialTypeLovFailure
  | LoadReset;
