import { Action } from '@ngrx/store';

import {
  CustomErrors,
  LoadCustomerTownListingPayload,
  LoadCustomerTownListingSuccessPayload,
  // LoadRegionDetailsListingSuccessPayload,
  SaveTownFormDetailsPayload,
  CustomerTown,
  StateSummary
} from '@poss-web/shared/models';

export enum CustomerTownActionTypes {
  LOAD_CORPORATE_TOWN = '[Load-corporateTown] Load CustomerTown Details',
  LOAD_CORPORATE_TOWN_SUCCESS = '[Load-corporateTown] Load CustomerTown Details Success',
  LOAD_CORPORATE_TOWN_FAILURE = '[Load-corporateTown] Load CustomerTown Details Failure',

  LOAD_STATE_DETAILS = '[Load-State-Details] Load State Details',
  LOAD_STATE_DETAILS_SUCCESS = '[Load-State-Details] Load State Details Success',
  LOAD_STATE_DETAILS_FAILURE = '[Load-State-Details] Load State Details Failure',

  LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE = '[Load-town-Details-By-Town-code] Load TownDetails Details By TownCode',
  LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE_SUCCESS = '[Load-town-Details-By-Town-code] Load TownDetails Details By TownCode Success',
  LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE_FAILURE = '[Load-town-Details-By-Town-code] Load TownDetails Details By TownCode Failure',

  RESET_CORPORATE_TOWN_DIALOG_DATA = '[Load-town-Details-By-Town-code] Reset TownDetails Dialog Data',

  SAVE_CORPORATE_TOWN = '[Save-corporateTown] Save CustomerTown Details',
  SAVE_CORPORATE_TOWN_SUCCESS = '[Save-corporateTown] Save CustomerTown Details Success',
  SAVE_CORPORATE_TOWN_FAILURE = '[Save-corporateTown] Save CustomerTown Details Failure',

  EDIT_CORPORATE_TOWN = '[Edit-corporateTown] Edit CustomerTown Details',
  EDIT_CORPORATE_TOWN_SUCCESS = '[Edit-corporateTown] Edit CustomerTown Details Success',
  EDIT_CORPORATE_TOWN_FAILURE = '[Edit-corporateTown] Edit CustomerTown Details Failure'

  // LOAD_REGION_DETAILS = '[Load-Region-Details] Load Region Details',
  // LOAD_REGION_DETAILS_SUCCESS = '[Load-Region-Details] Load Region Details Success',
  // LOAD_REGION_DETAILS_FAILURE = '[Load-Region-Details] Load Region Details Failure',

  // SEARCH_CORPORATETOWN = '[Customer-listing] Search CustomerTown By Code',
  // SEARCH_CORPORATETOWN_SUCCESS = '[Customer-listing] Search CustomerTown By Code Success',
  // SEARCH_CORPORATETOWN_FAILURE = '[Customer-listing] Search CustomerTown By Code Failure'
}

export class LoadCustomerTownDetails implements Action {
  readonly type = CustomerTownActionTypes.LOAD_CORPORATE_TOWN;
  constructor(
    public payload: LoadCustomerTownListingPayload,
    public townName?: string
  ) {}
}
export class LoadCustomerTownDetailsSuccess implements Action {
  readonly type = CustomerTownActionTypes.LOAD_CORPORATE_TOWN_SUCCESS;
  constructor(public payload: LoadCustomerTownListingSuccessPayload) {}
}
export class LoadCustomerTownDetailsFailure implements Action {
  readonly type = CustomerTownActionTypes.LOAD_CORPORATE_TOWN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadStateDetails implements Action {
  readonly type = CustomerTownActionTypes.LOAD_STATE_DETAILS;
  constructor(public payload: string) {}
}
export class LoadStateDetailsSuccess implements Action {
  readonly type = CustomerTownActionTypes.LOAD_STATE_DETAILS_SUCCESS;
  constructor(public payload: StateSummary[]) {}
}
export class LoadStateDetailsFailure implements Action {
  readonly type = CustomerTownActionTypes.LOAD_STATE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

// export class LoadRegionDetails implements Action {
//   readonly type = CustomerTownActionTypes.LOAD_REGION_DETAILS;
//   constructor(public payload: LoadCustomerTownListingPayload) {}
// }
// export class LoadRegionDetailsSuccess implements Action {
//   readonly type = CustomerTownActionTypes.LOAD_REGION_DETAILS_SUCCESS;
//   constructor(public payload: LoadRegionDetailsListingSuccessPayload) {}
// }
// export class LoadRegionDetailsFailure implements Action {
//   readonly type = CustomerTownActionTypes.LOAD_REGION_DETAILS_FAILURE;
//   constructor(public payload: CustomErrors) {}
// }

export class LoadTownDetailsByTownCode implements Action {
  readonly type =
    CustomerTownActionTypes.LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE;
  constructor(public payload: string) {}
}
export class LoadTownDetailsByTownCodeSuccess implements Action {
  readonly type =
    CustomerTownActionTypes.LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE_SUCCESS;
  constructor(public payload: CustomerTown) {}
}
export class LoadTownDetailsByTownCodeFailure implements Action {
  readonly type =
    CustomerTownActionTypes.LOAD_CORPORATE_TOWN_DETAILS_BY_TOWNCODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetTownDetailsDialog implements Action {
  readonly type = CustomerTownActionTypes.RESET_CORPORATE_TOWN_DIALOG_DATA;
}

export class SaveTownFormDetails implements Action {
  readonly type = CustomerTownActionTypes.SAVE_CORPORATE_TOWN;
  constructor(public payload: SaveTownFormDetailsPayload) {}
}

export class SaveTownFormDetailsSuccess implements Action {
  readonly type = CustomerTownActionTypes.SAVE_CORPORATE_TOWN_SUCCESS;
  constructor(public payload: CustomerTown) {}
}

export class SaveTownFormDetailsFailure implements Action {
  readonly type = CustomerTownActionTypes.SAVE_CORPORATE_TOWN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditTownFormDetails implements Action {
  readonly type = CustomerTownActionTypes.EDIT_CORPORATE_TOWN;
  constructor(public payload: CustomerTown) {}
}

export class EditTownFormDetailsSuccess implements Action {
  readonly type = CustomerTownActionTypes.EDIT_CORPORATE_TOWN_SUCCESS;
  constructor(public payload: CustomerTown) {}
}

export class EditTownFormDetailsFailure implements Action {
  readonly type = CustomerTownActionTypes.EDIT_CORPORATE_TOWN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetTownDialog implements Action {
  readonly type = CustomerTownActionTypes.RESET_CORPORATE_TOWN_DIALOG_DATA;
}

// export class SearchCustomerTownCode implements Action {
//   readonly type = CustomerTownActionTypes.SEARCH_CORPORATETOWN;
//   constructor(public payload: string) {}
// }

// export class SearchCustomerTownCodeSuccess implements Action {
//   readonly type = CustomerTownActionTypes.SEARCH_CORPORATETOWN_SUCCESS;
//   constructor(public payload: LoadCustomerTownListingSuccessPayload) {}
// }
// export class SearchCustomerTownCodeFailure implements Action {
//   readonly type = CustomerTownActionTypes.SEARCH_CORPORATETOWN_FAILURE;
//   constructor(public payload: CustomErrors) {}
// }

export type CustomerTownActions =
  | LoadCustomerTownDetails
  | LoadCustomerTownDetailsSuccess
  | LoadCustomerTownDetailsFailure
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
  | EditTownFormDetailsFailure;
// | LoadRegionDetails
// | LoadRegionDetailsSuccess
// | LoadRegionDetailsFailure
// | SearchCustomerTownCode
// | SearchCustomerTownCodeSuccess
// | SearchCustomerTownCodeFailure;
