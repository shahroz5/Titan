import { Action } from '@ngrx/store';
import {
  CustomErrors,
  MaterialType,
  PurityListResult,
  CreatePurityPayload,
  PurityListPayload,
  UpdatePurityPayload
} from '@poss-web/shared/models';

export enum PurityActionTypes {
  LOAD_PURITY_LISTING = '[Purity-list]Load Purity Listing',
  LOAD_PURITY_LISTING_SUCCESS = '[Purity-list]Load Purity Listing Success',
  LOAD_PURITY_LISTING_FAILURE = '[Purity-list] Load Purity Listing Failure',

  CREATE_PURITY = '[Purity-list] Create Purity',
  CREATE_PURITY_SUCCESS = '[Purity-list] Create Purity Success',
  CREATE_PURITY_FAILURE = '[Purity-list] Create Purity Failure',

  UPDATE_PURITY_DETAIL = '[Purity-list] Update Purity Details',
  UPDATE_PURITY_DETAIL_SUCCESS = '[Purity-list] Update Purity Detail Success',
  UPDATE_PURITY_DETAIL_FAILURE = '[Purity-list] Update Purity Detail Failure',

  LOAD_PURITY_DETAIL_BY_MATERIAL_CODE_AND_PURITY = '[Purity-list] Load Purity Detail By Material Code and Purity',
  LOAD_PURITY_DETAIL_BY_MATERIAL_CODE_AND_PURITY_SUCCESS = '[Purity-list] Load Purity Detail By  Material Code and Purity Success',
  LOAD_PURITY_DETAIL_BY_MATERIAL_CODE_AND_PURITY_FAILURE = '[Purity-list] Load Purity Detail By  Material Code and Purity Failure',

  LOAD_METAL_TYPES = '[Purity-list] Load Metal Types',
  LOAD_METAL_TYPES_SUCCESS = '[Purity-list] Load Metal Type Success',
  LOAD_METAL_TYPES_FAILURE = '[Purity-list] Load Metal Type Failure',

  LOAD_RESET = '[Purity-list] Load Reset'
}

export class LoadPurityByMaterialCodeAndPurity implements Action {
  readonly type =
    PurityActionTypes.LOAD_PURITY_DETAIL_BY_MATERIAL_CODE_AND_PURITY;
  constructor(public payload: any) {}
}

export class LoadPurityByMaterialCodeAndPuritySuccess implements Action {
  readonly type =
    PurityActionTypes.LOAD_PURITY_DETAIL_BY_MATERIAL_CODE_AND_PURITY_SUCCESS;

  constructor(public payload: any) {}
}

export class LoadPurityByMaterialCodeAndPurityFailure implements Action {
  readonly type =
    PurityActionTypes.LOAD_PURITY_DETAIL_BY_MATERIAL_CODE_AND_PURITY_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdatePurity implements Action {
  readonly type = PurityActionTypes.UPDATE_PURITY_DETAIL;
  constructor(public payload: UpdatePurityPayload) {}
}

export class UpdatePuritySuccess implements Action {
  readonly type = PurityActionTypes.UPDATE_PURITY_DETAIL_SUCCESS;
}

export class UpdatePurityFailure implements Action {
  readonly type = PurityActionTypes.UPDATE_PURITY_DETAIL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadMetalTypes implements Action {
  readonly type = PurityActionTypes.LOAD_METAL_TYPES;
}

export class LoadMetalTypesSuccess implements Action {
  readonly type = PurityActionTypes.LOAD_METAL_TYPES_SUCCESS;
  constructor(public payload: MaterialType[]) {}
}

export class LoadMetalTypesFailure implements Action {
  readonly type = PurityActionTypes.LOAD_METAL_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class CreatePurity implements Action {
  readonly type = PurityActionTypes.CREATE_PURITY;
  constructor(public payload: CreatePurityPayload) {}
}

export class CreatePuritySuccess implements Action {
  readonly type = PurityActionTypes.CREATE_PURITY_SUCCESS;
}

export class CreatePurityFailure implements Action {
  readonly type = PurityActionTypes.CREATE_PURITY_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPurityList implements Action {
  readonly type = PurityActionTypes.LOAD_PURITY_LISTING;
  constructor(public payload: PurityListPayload, public searchValue?: string) {}
}

export class LoadPurityListSuccess implements Action {
  readonly type = PurityActionTypes.LOAD_PURITY_LISTING_SUCCESS;
  constructor(public payload: PurityListResult) {}
}
export class LoadPurityListFailure implements Action {
  readonly type = PurityActionTypes.LOAD_PURITY_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = PurityActionTypes.LOAD_RESET;
}
export type PurityActions =
  | LoadPurityList
  | LoadPurityListSuccess
  | LoadPurityListFailure
  | LoadReset
  | CreatePurity
  | CreatePuritySuccess
  | CreatePurityFailure
  | LoadMetalTypes
  | LoadMetalTypesSuccess
  | LoadMetalTypesFailure
  | LoadPurityByMaterialCodeAndPurity
  | LoadPurityByMaterialCodeAndPuritySuccess
  | LoadPurityByMaterialCodeAndPurityFailure
  | UpdatePurity
  | UpdatePuritySuccess
  | UpdatePurityFailure;
