import { Action } from '@ngrx/store';
import {
  LoadStatesDetailsListingSuccessPayload,
  LoadStateListingPayload,
  CustomErrors,
  StateData,
  SaveStateDetailsPayload,
  LoadCountryDetailsListingSuccessPayload
} from '@poss-web/shared/models';

export enum StateActionTypes {
  LOAD_STATE_DETAILS = '[Load-States] Load State Details',
  LOAD_STATE_DETAILS_SUCCESS = '[Load-States] Load State Details Success',
  LOAD_STATE_DETAILS_FAILURE = '[Load-States] Load State Details Failure',

  LOAD_COUNTRY_DETAILS = '[Load-Countries] Load Countries Details',
  LOAD_COUNTRY_DETAILS_SUCCESS = '[Load-Countries] Load Countries Details Success',
  LOAD_COUNTRY_DETAILS_FAILURE = '[Load-Countries] Load Countries Details Failure',

  LOAD_STATE_DETAILS_BY_CODE = '[Load-States-By-code] Load State Details By Code',
  LOAD_STATE_DETAILS_BY_CODE_SUCCESS = '[Load-States-By-code] Load State Details By Code Success',
  LOAD_STATE_DETAILS_BY_CODE_FAILURE = '[Load-States-By-code] Load State Details By Code Failure',

  RESET_STATE_DIALOG_DATA = '[Reset-State] Reset State Dialog Data',

  SAVE_STATE_DETAILS = '[Save-State-Details] Save State Details',
  SAVE_STATE_DETAILS_SUCCESS = '[Save-State-Details] Save State Details Success',
  SAVE_STATE_DETAILS_FAILURE = '[Save-State-Details] Save State Details Failure',

  EDIT_STATE_DETAILS = '[Edit-State] Edit State Details',
  EDIT_STATE_DETAILS_SUCCESS = '[Edit-State] Edit State Details Success',
  EDIT_STATE_DETAILS_FAILURE = '[Edit-State] Edit State Details Failure',

  UPDATE_IS_ACTIVE = '[State-master]  Update Is Active',
  UPDATE_IS_ACTIVE_SUCCESS = '[State-master]  Update Is Active Success',
  UPDATE_IS_ACTIVE_FAILURE = '[State-master] Update Is Active Failure',

  SEARCH_STATE_BY_CODE = '[State-Search] Search State Code',

  SEARCH_STATE_BY_CODE_SUCCESS = '[State-Search] Search State Success',
  SEARCH_STATE_BY_CODE_FAILURE = '[State-Search] Search State Failure'
}

export class UpdateIsActive implements Action {
  readonly type = StateActionTypes.UPDATE_IS_ACTIVE;
  constructor(public payload: any) {}
}

export class UpdateIsActiveSuccess implements Action {
  readonly type = StateActionTypes.UPDATE_IS_ACTIVE_SUCCESS;
  constructor(public payload: any) {}
}

export class UpdateIsActiveFailure implements Action {
  readonly type = StateActionTypes.UPDATE_IS_ACTIVE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadStateDetails implements Action {
  readonly type = StateActionTypes.LOAD_STATE_DETAILS;
  constructor(public payload: LoadStateListingPayload) {}
}

export class LoadStateDetailsSuccess implements Action {
  readonly type = StateActionTypes.LOAD_STATE_DETAILS_SUCCESS;
  constructor(public payload: LoadStatesDetailsListingSuccessPayload) {}
}
export class LoadStateDetailsFailure implements Action {
  readonly type = StateActionTypes.LOAD_STATE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCountryDetails implements Action {
  readonly type = StateActionTypes.LOAD_COUNTRY_DETAILS;
}

export class LoadCountryDetailsSuccess implements Action {
  readonly type = StateActionTypes.LOAD_COUNTRY_DETAILS_SUCCESS;
  constructor(public payload: LoadCountryDetailsListingSuccessPayload) {}
}
export class LoadCountryDetailsFailure implements Action {
  readonly type = StateActionTypes.LOAD_COUNTRY_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadStateByCode implements Action {
  readonly type = StateActionTypes.LOAD_STATE_DETAILS_BY_CODE;
  constructor(public payload: string) {}
}
export class LoadStateByCodeSuccess implements Action {
  readonly type = StateActionTypes.LOAD_STATE_DETAILS_BY_CODE_SUCCESS;
  constructor(public payload: StateData) {}
}
export class LoadStateByCodeFailure implements Action {
  readonly type = StateActionTypes.LOAD_STATE_DETAILS_BY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetStateDialog implements Action {
  readonly type = StateActionTypes.RESET_STATE_DIALOG_DATA;
}

export class SaveStateFormDetails implements Action {
  readonly type = StateActionTypes.SAVE_STATE_DETAILS;
  constructor(public payload: SaveStateDetailsPayload) {}
}

export class SaveStateFormDetailsSuccess implements Action {
  readonly type = StateActionTypes.SAVE_STATE_DETAILS_SUCCESS;
  constructor(public payload: SaveStateDetailsPayload) {}
}

export class SaveStateFormDetailsFailure implements Action {
  readonly type = StateActionTypes.SAVE_STATE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditStateDetails implements Action {
  readonly type = StateActionTypes.EDIT_STATE_DETAILS;
  constructor(public payload: SaveStateDetailsPayload) {}
}

export class EditStateDetailsSuccess implements Action {
  readonly type = StateActionTypes.EDIT_STATE_DETAILS_SUCCESS;
  constructor(public payload: SaveStateDetailsPayload) {}
}

export class EditStateDetailsFailure implements Action {
  readonly type = StateActionTypes.EDIT_STATE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchState implements Action {
  readonly type = StateActionTypes.SEARCH_STATE_BY_CODE;
  constructor(public payload: string) {}
}

export class SearchStateSuccess implements Action {
  readonly type = StateActionTypes.SEARCH_STATE_BY_CODE_SUCCESS;
  constructor(public payload: LoadStatesDetailsListingSuccessPayload) {}
}
export class SearchStateFailure implements Action {
  readonly type = StateActionTypes.SEARCH_STATE_BY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type StateActions =
  | LoadStateDetails
  | LoadStateDetailsSuccess
  | LoadStateDetailsFailure
  | LoadStateByCode
  | LoadStateByCodeSuccess
  | LoadStateByCodeFailure
  | ResetStateDialog
  | SaveStateFormDetails
  | SaveStateFormDetailsSuccess
  | SaveStateFormDetailsFailure
  | EditStateDetails
  | EditStateDetailsSuccess
  | EditStateDetailsFailure
  | SearchState
  | SearchStateSuccess
  | SearchStateFailure
  | LoadCountryDetails
  | LoadCountryDetailsSuccess
  | LoadCountryDetailsFailure
  | UpdateIsActive
  | UpdateIsActiveSuccess
  | UpdateIsActiveFailure;
