import { Action } from '@ngrx/store';

import {
  CustomErrors,
  LoadCorporateTownListingPayload,
  LoadCorporateTownListingSuccessPayload,
  SaveTownFormDetailsPayload,
  CorporateTown,
  StateSummary,
} from '@poss-web/shared/models';

export enum CorporateTownActionTypes {
  LOAD_CORPORATE_TOWN = '[Load-corporateTown] Load CorporateTown Details',
  LOAD_CORPORATE_TOWN_SUCCESS = '[Load-corporateTown] Load CorporateTown Details Success',
  LOAD_CORPORATE_TOWN_FAILURE = '[Load-corporateTown] Load CorporateTown Details Failure',

  LOAD_STATE_DETAILS = '[Load-State-Details] Load State Details',
  LOAD_STATE_DETAILS_SUCCESS = '[Load-State-Details] Load State Details Success',
  LOAD_STATE_DETAILS_FAILURE = '[Load-State-Details] Load State Details Failure',

  LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE = '[Load-town-Details-By-Town-code] Load TownDetails Details By TownCode',
  LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE_SUCCESS = '[Load-town-Details-By-Town-code] Load TownDetails Details By TownCode Success',
  LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE_FAILURE = '[Load-town-Details-By-Town-code] Load TownDetails Details By TownCode Failure',

  RESET_CORPORATE_TOWN_DIALOG_DATA = '[Load-town-Details-By-Town-code] Reset TownDetails Dialog Data',

  SAVE_CORPORATE_TOWN = '[Save-corporateTown] Save CorporateTown Details',
  SAVE_CORPORATE_TOWN_SUCCESS = '[Save-corporateTown] Save CorporateTown Details Success',
  SAVE_CORPORATE_TOWN_FAILURE = '[Save-corporateTown] Save CorporateTown Details Failure',

  EDIT_CORPORATE_TOWN = '[Edit-corporateTown] Edit CorporateTown Details',
  EDIT_CORPORATE_TOWN_SUCCESS = '[Edit-corporateTown] Edit CorporateTown Details Success',
  EDIT_CORPORATE_TOWN_FAILURE = '[Edit-corporateTown] Edit CorporateTown Details Failure',

  SEARCH_CORPORATETOWN = '[Corporate-listing] Search CorporateTown By Code',
  SEARCH_CORPORATETOWN_SUCCESS = '[Corporate-listing] Search CorporateTown By Code Success',
  SEARCH_CORPORATETOWN_FAILURE = '[Corporate-listing] Search CorporateTown By Code Failure'
}

export class LoadCorporateTownDetails implements Action {
  readonly type = CorporateTownActionTypes.LOAD_CORPORATE_TOWN;
  constructor(public payload: LoadCorporateTownListingPayload) {}
}
export class LoadCorporateTownDetailsSuccess implements Action {
  readonly type = CorporateTownActionTypes.LOAD_CORPORATE_TOWN_SUCCESS;
  constructor(public payload: LoadCorporateTownListingSuccessPayload) {}
}
export class LoadCorporateTownDetailsFailure implements Action {
  readonly type = CorporateTownActionTypes.LOAD_CORPORATE_TOWN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadStateDetails implements Action {
  readonly type = CorporateTownActionTypes.LOAD_STATE_DETAILS;
  constructor(public payload: string) {}
}
export class LoadStateDetailsSuccess implements Action {
  readonly type = CorporateTownActionTypes.LOAD_STATE_DETAILS_SUCCESS;
  constructor(public payload: StateSummary[]) {}
}
export class LoadStateDetailsFailure implements Action {
  readonly type = CorporateTownActionTypes.LOAD_STATE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTownDetailsByTownCode implements Action {
  readonly type =
    CorporateTownActionTypes.LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE;
  constructor(public payload: string) {}
}
export class LoadTownDetailsByTownCodeSuccess implements Action {
  readonly type =
    CorporateTownActionTypes.LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE_SUCCESS;
  constructor(public payload: CorporateTown) {}
}
export class LoadTownDetailsByTownCodeFailure implements Action {
  readonly type =
    CorporateTownActionTypes.LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetTownDetailsDialog implements Action {
  readonly type = CorporateTownActionTypes.RESET_CORPORATE_TOWN_DIALOG_DATA;
}

export class SaveTownFormDetails implements Action {
  readonly type = CorporateTownActionTypes.SAVE_CORPORATE_TOWN;
  constructor(public payload: SaveTownFormDetailsPayload) {}
}

export class SaveTownFormDetailsSuccess implements Action {
  readonly type = CorporateTownActionTypes.SAVE_CORPORATE_TOWN_SUCCESS;
  constructor(public payload: CorporateTown) {}
}

export class SaveTownFormDetailsFailure implements Action {
  readonly type = CorporateTownActionTypes.SAVE_CORPORATE_TOWN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditTownFormDetails implements Action {
  readonly type = CorporateTownActionTypes.EDIT_CORPORATE_TOWN;
  constructor(public payload: SaveTownFormDetailsPayload) {}
}

export class EditTownFormDetailsSuccess implements Action {
  readonly type = CorporateTownActionTypes.EDIT_CORPORATE_TOWN_SUCCESS;
  constructor(public payload: CorporateTown) {}
}

export class EditTownFormDetailsFailure implements Action {
  readonly type = CorporateTownActionTypes.EDIT_CORPORATE_TOWN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetTownDialog implements Action {
  readonly type = CorporateTownActionTypes.RESET_CORPORATE_TOWN_DIALOG_DATA;
}

export class SearchCorporateTownCode implements Action {
  readonly type = CorporateTownActionTypes.SEARCH_CORPORATETOWN;
  constructor(public payload: string) {}
}

export class SearchCorporateTownCodeSuccess implements Action {
  readonly type = CorporateTownActionTypes.SEARCH_CORPORATETOWN_SUCCESS;
  constructor(public payload: LoadCorporateTownListingSuccessPayload) {}
}
export class SearchCorporateTownCodeFailure implements Action {
  readonly type = CorporateTownActionTypes.SEARCH_CORPORATETOWN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type CorporateTownActions =
  | LoadCorporateTownDetails
  | LoadCorporateTownDetailsSuccess
  | LoadCorporateTownDetailsFailure
  | LoadStateDetails
  | LoadStateDetailsSuccess
  | LoadStateDetailsFailure
  | LoadTownDetailsByTownCode
  | LoadTownDetailsByTownCodeSuccess
  | LoadTownDetailsByTownCodeFailure
  | ResetTownDetailsDialog
  | SaveTownFormDetails
  | SaveTownFormDetailsSuccess
  | SaveTownFormDetailsFailure
  | EditTownFormDetails
  | EditTownFormDetailsSuccess
  | EditTownFormDetailsFailure
  | SearchCorporateTownCode
  | SearchCorporateTownCodeSuccess
  | SearchCorporateTownCodeFailure;
