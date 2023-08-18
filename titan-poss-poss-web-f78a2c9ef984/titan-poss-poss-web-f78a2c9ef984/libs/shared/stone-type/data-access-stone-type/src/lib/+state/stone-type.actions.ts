import { Action } from '@ngrx/store';

import {
  CustomErrors,
  LoadStoneTypeListingPayload,
  LoadStoneTypeListingSuccessPayload,
  SaveStoneTypeFormDetailsPayload,
  StoneTypeDetails
} from '@poss-web/shared/models';

export enum StoneTypeActionTypes {
  LOAD_STONE_TYPE_DETAILS = '[Load-StoneType-Details] Load StoneType Details',
  LOAD_STONE_TYPE_DETAILS_SUCCESS = '[Load-StoneType-Details] Load StoneType Details Success',
  LOAD_STONE_TYPE_DETAILS_FAILURE = '[Load-StoneType-Details] Load StoneType Details Failure',

  LOAD_STONE_TYPE_DETAILS_BY_STONE_TYPECODE = '[Load-StoneType-Details] Load StoneType Details By StoneType Code',
  LOAD_STONE_TYPE_DETAILS_BY_STONE_TYPECODE_SUCCESS = '[Load-StoneType-Details] Load StoneType Details By StoneType Code Success',
  LOAD_STONE_TYPE_DETAILS_BY_STONE_TYPECODE_FAILURE = '[Load-StoneType-Details] Load StoneType Details By StoneType Code Failure',

  RESET_STONE_TYPE_DIALOG_DATA = '[Load-StoneType-Details] Reset StoneType Dialog Data',

  SAVE_STONE_TYPE_FORM_DETAILS = '[ Save-StoneType-Details ] SaveForm Details',
  SAVE_STONE_TYPE_FORM_DETAILS_SUCCESS = '[ Save-StoneType-Details ] SaveForm Details Success',
  SAVE_STONE_TYPE_FORM_DETAILS_FAILURE = '[ Save-StoneType-Details ] SaveForm Details Failure',

  EDIT_STONE_TYPE_FORM_DETAILS = '[ Edit-StoneType-Details ] EditForm Details',
  EDIT_STONE_TYPE_FORM_DETAILS_SUCCESS = '[ Edit-StoneType-Details ] EditForm Details Success',
  EDIT_STONE_TYPE_FORM_DETAILS_FAILURE = '[ Edit-StoneType-Details ] EditForm Details Failure',

  SEARCH_STONE_TYPE_DETAILS = '[Load-StoneType-Details] Search StoneType-Details',
  SEARCH_STONE_TYPE_DETAILS_SUCCESS = '[Load-StoneType-Details] Search StoneType-Details Success',
  SEARCH_STONE_TYPE_DETAILS_FAILURE = '[Load-StoneType-Details] Search StoneType-Details Failure'
}

export class LoadStoneTypeDetails implements Action {
  readonly type = StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS;
  constructor(public payload: LoadStoneTypeListingPayload) {}
}
export class LoadStoneTypeDetailsSuccess implements Action {
  readonly type = StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS_SUCCESS;
  constructor(public payload: LoadStoneTypeListingSuccessPayload) {}
}
export class LoadStoneTypeDetailsFailure implements Action {
  readonly type = StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadStoneTypeByStoneTypeCode implements Action {
  readonly type =
    StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS_BY_STONE_TYPECODE;
  constructor(public payload: string) {}
}
export class LoadStoneTypeByStoneTypeCodeSuccess implements Action {
  readonly type =
    StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS_BY_STONE_TYPECODE_SUCCESS;
  constructor(public payload: StoneTypeDetails) {}
}
export class LoadStoneTypeByStoneTypeCodeFailure implements Action {
  readonly type =
    StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS_BY_STONE_TYPECODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetStoneTypeDialog implements Action {
  readonly type = StoneTypeActionTypes.RESET_STONE_TYPE_DIALOG_DATA;
}

export class SaveStoneTypeFormDetails implements Action {
  readonly type = StoneTypeActionTypes.SAVE_STONE_TYPE_FORM_DETAILS;
  constructor(public payload: SaveStoneTypeFormDetailsPayload) {}
}

export class SaveStoneTypeFormDetailsSuccess implements Action {
  readonly type = StoneTypeActionTypes.SAVE_STONE_TYPE_FORM_DETAILS_SUCCESS;
  constructor(public payload: StoneTypeDetails) {}
}

export class SaveStoneTypeFormDetailsFailure implements Action {
  readonly type = StoneTypeActionTypes.SAVE_STONE_TYPE_FORM_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditStoneTypeFormDetails implements Action {
  readonly type = StoneTypeActionTypes.EDIT_STONE_TYPE_FORM_DETAILS;
  constructor(public payload: SaveStoneTypeFormDetailsPayload) {}
}

export class EditStoneTypeFormDetailsSuccess implements Action {
  readonly type = StoneTypeActionTypes.EDIT_STONE_TYPE_FORM_DETAILS_SUCCESS;
  constructor(public payload: StoneTypeDetails) {}
}
export class EditStoneTypeFormDetailsFailure implements Action {
  readonly type = StoneTypeActionTypes.EDIT_STONE_TYPE_FORM_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchStoneTypeCode implements Action {
  readonly type = StoneTypeActionTypes.SEARCH_STONE_TYPE_DETAILS;
  constructor(public payload: string) {}
}
export class SearchStoneTypeCodeSuccess implements Action {
  readonly type = StoneTypeActionTypes.SEARCH_STONE_TYPE_DETAILS_SUCCESS;
  constructor(public payload: StoneTypeDetails[]) {}
}
export class SearchStoneTypeCodeFailure implements Action {
  readonly type = StoneTypeActionTypes.SEARCH_STONE_TYPE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type StoneTypeActions =
  | LoadStoneTypeDetails
  | LoadStoneTypeDetailsSuccess
  | LoadStoneTypeDetailsFailure
  | LoadStoneTypeByStoneTypeCode
  | LoadStoneTypeByStoneTypeCodeSuccess
  | LoadStoneTypeByStoneTypeCodeFailure
  | ResetStoneTypeDialog
  | SaveStoneTypeFormDetails
  | SaveStoneTypeFormDetailsSuccess
  | SaveStoneTypeFormDetailsFailure
  | EditStoneTypeFormDetails
  | EditStoneTypeFormDetailsSuccess
  | EditStoneTypeFormDetailsFailure
  | SearchStoneTypeCode
  | SearchStoneTypeCodeSuccess
  | SearchStoneTypeCodeFailure;
