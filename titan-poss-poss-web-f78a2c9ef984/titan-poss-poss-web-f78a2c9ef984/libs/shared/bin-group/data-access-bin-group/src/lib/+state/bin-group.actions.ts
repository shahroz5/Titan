import { Action } from '@ngrx/store';

import {
  CustomErrors,
  LoadBinGroupDetailsListingPayload,
  LoadBinGroupDetailsListingSuccessPayload,
  BinGroupDetails,
  SaveBinGroupFormDetailsPayload
} from '@poss-web/shared/models';

export enum BinGroupActionTypes {
  LOAD_BIN_GROUP_DETAILS = '[Load-binGroup-Details] Load BinGroup Details',
  LOAD_BIN_GROUP_DETAILS_SUCCESS = '[Load-binGroup-Details] Load BinGroup Details Success',
  LOAD_BIN_GROUP_DETAILS_FAILURE = '[Load-binGroup-Details] Load BinGroup Details Failure',

  LOAD_BIN_GROUP_DETAILS_BY_BIN_GROUPCODE = '[Load-binGroup-Details] Load BinGroup Details By BinGroup Code',
  LOAD_BIN_GROUP_DETAILS_BY_BIN_GROUPCODE_SUCCESS = '[Load-binGroup-Details] Load BinGroup Details By BinGroup Code Success',
  LOAD_BIN_GROUP_DETAILS_BY_BIN_GROUPCODE_FAILURE = '[Load-binGroup-Details] Load BinGroup Details By BinGroup Code Failure',

  RESET_BINGROUP_DIALOG_DATA = '[Load-binGroup-Details] Reset BinGroup Dialog Data',

  SAVE_BINGROUP_FORM_DETAILS = '[ Save-binGroup-Details ] SaveForm Details',
  SAVE_BINGROUP_FORM_DETAILS_SUCCESS = '[ Save-binGroup-Details ] SaveForm Details Success',
  SAVE_BINGROUP_FORM_DETAILS_FAILURE = '[ Save-binGroup-Details ] SaveForm Details Failure',

  EDIT_BINGROUP_FORM_DETAILS = '[ Edit-binGroup-Details ] EditForm Details',
  EDIT_BINGROUP_FORM_DETAILS_SUCCESS = '[ Edit-binGroup-Details ] EditForm Details Success',
  EDIT_BINGROUP_FORM_DETAILS_FAILURE = '[ Edit-binGroup-Details ] EditForm Details Failure',

  SEARCH_BINGROUP_BY_BINGROUPCODE = '[BinGroup-listing] Search BinGroup By BinGroupCode',
  SEARCH_BINGROUP_BY_BINGROUPCODE_SUCCESS = '[BinGroup-listing] Search BinGroup By BinGroupCode Success',
  SEARCH_BINGROUP_BY_BINGROUPCODE_FAILURE = '[BinGroup-listing] Search BinGroup By BinGroupCode Failure',

  SEARCH_CLEAR = '[ BinGroup-listing ] search-clear'
}

export class LoadBinGroupDetails implements Action {
  readonly type = BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS;
  constructor(public payload: LoadBinGroupDetailsListingPayload) {}
}
export class LoadBinGroupDetailsSuccess implements Action {
  readonly type = BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS_SUCCESS;
  constructor(public payload: LoadBinGroupDetailsListingSuccessPayload) {}
}
export class LoadBinGroupDetailsFailure implements Action {
  readonly type = BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadBinGroupByBinGroupCode implements Action {
  readonly type = BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS_BY_BIN_GROUPCODE;
  constructor(public payload: string) {}
}
export class LoadBinGroupByBinGroupCodeSuccess implements Action {
  readonly type =
    BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS_BY_BIN_GROUPCODE_SUCCESS;
  constructor(public payload: BinGroupDetails) {}
}
export class LoadBinGroupByBinGroupCodeFailure implements Action {
  readonly type =
    BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS_BY_BIN_GROUPCODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetBinGroupDialog implements Action {
  readonly type = BinGroupActionTypes.RESET_BINGROUP_DIALOG_DATA;
}

export class SaveBinGroupFormDetails implements Action {
  readonly type = BinGroupActionTypes.SAVE_BINGROUP_FORM_DETAILS;
  constructor(public payload: SaveBinGroupFormDetailsPayload) {}
}

export class SaveBinGroupFormDetailsSuccess implements Action {
  readonly type = BinGroupActionTypes.SAVE_BINGROUP_FORM_DETAILS_SUCCESS;
  constructor(public payload: SaveBinGroupFormDetailsPayload) {}
}

export class SaveBinGroupFormDetailsFailure implements Action {
  readonly type = BinGroupActionTypes.SAVE_BINGROUP_FORM_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditBinGroupFormDetails implements Action {
  readonly type = BinGroupActionTypes.EDIT_BINGROUP_FORM_DETAILS;
  constructor(public payload: SaveBinGroupFormDetailsPayload) {}
}

export class EditBinGroupFormDetailsSuccess implements Action {
  readonly type = BinGroupActionTypes.EDIT_BINGROUP_FORM_DETAILS_SUCCESS;
  constructor(public payload: SaveBinGroupFormDetailsPayload) {}
}
export class EditBinGroupFormDetailsFailure implements Action {
  readonly type = BinGroupActionTypes.EDIT_BINGROUP_FORM_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchByBinGroupCode implements Action {
  readonly type = BinGroupActionTypes.SEARCH_BINGROUP_BY_BINGROUPCODE;
  constructor(public payload: string) {}
}

export class SearchByBinGroupCodeSuccess implements Action {
  readonly type = BinGroupActionTypes.SEARCH_BINGROUP_BY_BINGROUPCODE_SUCCESS;
  constructor(public payload: LoadBinGroupDetailsListingSuccessPayload) {}
}
export class SearchByBinGroupCodeFailure implements Action {
  readonly type = BinGroupActionTypes.SEARCH_BINGROUP_BY_BINGROUPCODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchClear implements Action {
  readonly type = BinGroupActionTypes.SEARCH_CLEAR;
}

export type BinGroupActions =
  | LoadBinGroupDetails
  | LoadBinGroupDetailsSuccess
  | LoadBinGroupDetailsFailure
  | LoadBinGroupByBinGroupCode
  | LoadBinGroupByBinGroupCodeSuccess
  | LoadBinGroupByBinGroupCodeFailure
  | ResetBinGroupDialog
  | SaveBinGroupFormDetails
  | SaveBinGroupFormDetailsFailure
  | EditBinGroupFormDetails
  | EditBinGroupFormDetailsSuccess
  | EditBinGroupFormDetailsFailure
  | SaveBinGroupFormDetailsSuccess
  | SearchByBinGroupCode
  | SearchByBinGroupCodeSuccess
  | SearchByBinGroupCodeFailure
  | SearchClear;
