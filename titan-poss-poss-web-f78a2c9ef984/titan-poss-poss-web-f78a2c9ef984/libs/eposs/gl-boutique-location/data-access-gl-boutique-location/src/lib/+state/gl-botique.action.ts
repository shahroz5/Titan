import { Action } from '@ngrx/store';
import {
  CustomErrors,
  GlBoutiqueLocationListingPayload,
  GlBoutiqueLocationSuccessPayload,
  GlBoutiqueLocationList
} from '@poss-web/shared/models';

export enum GlBoutiqueLocationActionTypes {
  LOAD_GL_BTQ_LOCATION_LIST = '[Gl-Btq-Location] Load Gl-Btq-Location List',
  LOAD_GL_BTQ_LOCATION_LIST_SUCCESS = '[Gl-Btq-Location] Load Gl-Btq-Location List Success',
  LOAD_GL_BTQ_LOCATION_LIST_FAILURE = '[Gl-Btq-Location] Load Gl-Btq-Location List Failure',

  LOAD_GL_BTQ_LOCATION_BY_LOCATION_CODE = '[Gl-Btq-Location] Load Gl-Btq-Location By Location Code',
  LOAD_GL_BTQ_LOCATION_BY_LOCATION_CODE_SUCCESS = '[Gl-Btq-Location] Load Gl-Btq-Location By Location Code Success',
  LOAD_GL_BTQ_LOCATION_BY_LOCATION_CODE_FAILURE = '[Gl-Btq-Location] Load Gl-Btq-Location By Location Code Failure',

  SAVE_GL_BTQ_LOCATION_DETAILS = '[ Gl-Btq-Location ] Save Details',
  SAVE_GL_BTQ_LOCATION_DETAILS_SUCCESS = '[ Gl-Btq-Location ] Save Gl-Btq-Location Details Success',
  SAVE_GL_BTQ_LOCATION_DETAILS_FAILURE = '[ Gl-Btq-Location ] Save Gl-Btq-Location Details Failure',

  EDIT_GL_BTQ_LOCATION_DETAILS = '[ Gl-Btq-Location] Edit Details',
  EDIT_GL_BTQ_LOCATION_DETAILS_SUCCESS = '[ Gl-Btq-Location] Edit Gl-Btq-Location Details Success',
  EDIT_GL_BTQ_LOCATION_DETAILS_FAILURE = '[ Gl-Btq-Location] Edit Gl-Btq-Location Details Failure',

  SEARCH_BY_LOCATION_CODE = '[Gl-Btq-Location] Search Gl-Btq-Location By Location Code',
  SEARCH_BY_LOCATION_CODE_SUCCESS = '[Gl-Btq-Location] Search Gl-Btq-Location By Location Code Success',
  SEARCH_BY_LOCATION_CODE_FAILURE = '[Gl-Btq-Location] Search Gl-Btq-Location By Location Code Failure',

  RESET_GL_BOUTIQUE = '[Gl-Btq-Location] Reset  GL Code Details'
}
export class LoadGlBoutiqueList implements Action {
  readonly type = GlBoutiqueLocationActionTypes.LOAD_GL_BTQ_LOCATION_LIST;
  constructor(public payload: GlBoutiqueLocationListingPayload) {}
}
export class LoadGlBoutiqueListSuccess implements Action {
  readonly type =
    GlBoutiqueLocationActionTypes.LOAD_GL_BTQ_LOCATION_LIST_SUCCESS;
  constructor(public payload: GlBoutiqueLocationSuccessPayload) {}
}
export class LoadGlBoutiqueListFailure implements Action {
  readonly type =
    GlBoutiqueLocationActionTypes.LOAD_GL_BTQ_LOCATION_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadGlBoutiqueListByLocationCode implements Action {
  readonly type =
    GlBoutiqueLocationActionTypes.LOAD_GL_BTQ_LOCATION_BY_LOCATION_CODE;
  constructor(public payload: string) {}
}
export class LoadGlBoutiqueListByLocationCodeSuccess implements Action {
  readonly type =
    GlBoutiqueLocationActionTypes.LOAD_GL_BTQ_LOCATION_BY_LOCATION_CODE_SUCCESS;
  constructor(public payload: GlBoutiqueLocationList) {}
}
export class LoadGlBoutiqueListByLocationCodeFailure implements Action {
  readonly type =
    GlBoutiqueLocationActionTypes.LOAD_GL_BTQ_LOCATION_BY_LOCATION_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveGlBoutqueLocationDetails implements Action {
  readonly type = GlBoutiqueLocationActionTypes.SAVE_GL_BTQ_LOCATION_DETAILS;
  constructor(public payload: GlBoutiqueLocationList) {}
}

export class SaveGlBoutqueLocationDetailsSuccess implements Action {
  readonly type =
    GlBoutiqueLocationActionTypes.SAVE_GL_BTQ_LOCATION_DETAILS_SUCCESS;
  constructor(public payload: GlBoutiqueLocationList) {}
}

export class SaveGlBoutqueLocationDetailsFailure implements Action {
  readonly type =
    GlBoutiqueLocationActionTypes.SAVE_GL_BTQ_LOCATION_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditGlBoutqueLocationDetails implements Action {
  readonly type = GlBoutiqueLocationActionTypes.EDIT_GL_BTQ_LOCATION_DETAILS;
  constructor(public payload: GlBoutiqueLocationList) {}
}

export class EditGlBoutqueLocationDetailsSuccess implements Action {
  readonly type =
    GlBoutiqueLocationActionTypes.EDIT_GL_BTQ_LOCATION_DETAILS_SUCCESS;
  constructor(public payload: GlBoutiqueLocationList) {}
}
export class EditGlBoutqueLocationDetailsFailure implements Action {
  readonly type =
    GlBoutiqueLocationActionTypes.EDIT_GL_BTQ_LOCATION_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchByLocationCode implements Action {
  readonly type = GlBoutiqueLocationActionTypes.SEARCH_BY_LOCATION_CODE;
  constructor(public payload: string) {}
}
export class SearchByLocationCodeSuccess implements Action {
  readonly type = GlBoutiqueLocationActionTypes.SEARCH_BY_LOCATION_CODE_SUCCESS;
  constructor(public payload: GlBoutiqueLocationList[]) {}
}
export class SearchByLocationCodeFailure implements Action {
  readonly type = GlBoutiqueLocationActionTypes.SEARCH_BY_LOCATION_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetGlBoutiqueDetails implements Action {
  readonly type = GlBoutiqueLocationActionTypes.RESET_GL_BOUTIQUE;
}
export type GlBoutiqueLocationActions =
  | LoadGlBoutiqueList
  | LoadGlBoutiqueListSuccess
  | LoadGlBoutiqueListFailure
  | LoadGlBoutiqueListByLocationCode
  | LoadGlBoutiqueListByLocationCodeSuccess
  | LoadGlBoutiqueListByLocationCodeFailure
  | SaveGlBoutqueLocationDetails
  | SaveGlBoutqueLocationDetailsSuccess
  | SaveGlBoutqueLocationDetailsFailure
  | EditGlBoutqueLocationDetails
  | EditGlBoutqueLocationDetailsSuccess
  | EditGlBoutqueLocationDetailsFailure
  | SearchByLocationCode
  | SearchByLocationCodeSuccess
  | SearchByLocationCodeFailure
  | ResetGlBoutiqueDetails;
