import { Action } from '@ngrx/store';

import {
  SaveBinCodeFormPayload,
  LoadBinCodeDetailsListingSuccessPayload,
  LocationsByBinGroupAndBinCodePayload,
  LocationMappingPostPayload,
  LoadBinGroupDetailsListingPayload,
  BinCodeSaveModel,
  LocationList,
  LocationMappingPost,
  LoadSearchBinCodeDetails,
  BinCodeListingPayload,
  SearchBinCodePayload,
  CustomErrors
} from '@poss-web/shared/models';

export enum BinActionTypes {
  RESET_BINCODE_DIALOG_DATA = '[Reset-binCode-Details] Reset BinCode Dialog Data',

  SAVE_BINCODE_FORM_DETAILS = '[ Save-binCode-New-Details ] SaveNewForm Details',
  SAVE_BINCODE_FORM_DETAILS_SUCCESS = '[ Save-binCode-New-Details ] SaveNewForm Details Success',
  SAVE_BINCODE_FORM_DETAILS_FAILURE = '[ Save-binCode-New-Details ] SaveNewForm Details Failure',

  LOAD_BIN_CODE_DETAILS = '[Load-binCode-Details] Load BinCode Details',
  LOAD_BIN_CODE_DETAILS_SUCCESS = '[Load-binCode-Details] Load BinCode Details Success',
  LOAD_BIN_CODE_DETAILS_FAILURE = '[Load-binCode-Details] Load BinCode Details Failure',

  LOAD_BIN_CODES_BY_BIN_GROUPCODE = '[Load-binCode-Details] Load BinCode Details By BinGroup Code',
  LOAD_BIN_CODES_BY_BIN_GROUPCODE_SUCCESS = '[Load-binCode-Details] Load BinCode Details By BinGroup Code Success',
  LOAD_BIN_CODES_BY_BIN_GROUPCODE_FAILURE = '[Load-binCode-Details] Load BinCode Details By BinGroup Code Failure',

  EDIT_BINCODE_FORM_DETAILS = '[ Edit-binCode-New-Details ] EditForm Details',
  EDIT_BINCODE_FORM_DETAILS_SUCCESS = '[ Edit-binCode-New-Details ] EditForm Details Success',
  EDIT_BINCODE_FORM_DETAILS_FAILURE = '[ Edit-binCode-New-Details ] EditForm Details Failure',

  SEARCH_BIN_NAME = '[BinDetails]Search Bin Name',
  SEARCH_BIN_NAME_SUCCESS = '[BinDetails]Search Bin Name Success',
  SEARCH_BIN_NAME_FAILURE = '[BinDetails]Search Bin Name Failure',

  LOAD_LOCATIONS_BY_BINGROUP_AND_BINCODE = '[Load-location-Details] Load Location By BinGroup Code And BinCode',
  LOAD_LOCATIONS_BY_BINGROUP_AND_BINCODE_SUCCESS = '[Load-location-Details] Load Location By BinGroup Code And BinCode Success',
  LOAD_LOCATIONS_BY_BINGROUP_AND_BINCODE_FAILURE = '[Load-location-Details] Load Location By BinGroup Code And BinCode Failure',

  SAVE_LOCATION_MAPPING_DETAILS = '[ Save-Location-Mapping-Details ] Save Location Mapping Details',
  SAVE_LOCATION_MAPPING_DETAILS_SUCCESS = '[ Save-Location-Mapping-Details ] Save Location Mapping Success',
  SAVE_LOCATION_MAPPING_DETAILS_FAILURE = '[ Save-Location-Mapping-Details] Save Location Mapping Failure'
}

export class ResetBinCodeDialog implements Action {
  readonly type = BinActionTypes.RESET_BINCODE_DIALOG_DATA;
}
export class LoadBinCodeDetails implements Action {
  readonly type = BinActionTypes.LOAD_BIN_CODE_DETAILS;
  constructor(public payload: LoadBinGroupDetailsListingPayload) {}
}
export class LoadBinCodeDetailsSuccess implements Action {
  readonly type = BinActionTypes.LOAD_BIN_CODE_DETAILS_SUCCESS;
  constructor(public payload: LoadBinCodeDetailsListingSuccessPayload) {}
}
export class LoadBinCodeDetailsFailure implements Action {
  readonly type = BinActionTypes.LOAD_BIN_CODE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadBinCodesByBinGroupCode implements Action {
  readonly type = BinActionTypes.LOAD_BIN_CODES_BY_BIN_GROUPCODE;
  constructor(public payload: BinCodeListingPayload) {}
}
export class LoadBinCodesByBinGroupCodeSuccess implements Action {
  readonly type = BinActionTypes.LOAD_BIN_CODES_BY_BIN_GROUPCODE_SUCCESS;
  constructor(public payload: LoadSearchBinCodeDetails) {}
}
export class LoadBinCodesByBinGroupCodeFailure implements Action {
  readonly type = BinActionTypes.LOAD_BIN_CODES_BY_BIN_GROUPCODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveBinCodeNewFormDetails implements Action {
  readonly type = BinActionTypes.SAVE_BINCODE_FORM_DETAILS;
  constructor(public payload: SaveBinCodeFormPayload) {}
}

export class SaveBinCodeNewFormDetailsSuccess implements Action {
  readonly type = BinActionTypes.SAVE_BINCODE_FORM_DETAILS_SUCCESS;
  constructor(public payload: SaveBinCodeFormPayload) {}
}

export class SaveBinCodeNewFormDetailsFailure implements Action {
  readonly type = BinActionTypes.SAVE_BINCODE_FORM_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditBinCodeFormDetails implements Action {
  readonly type = BinActionTypes.EDIT_BINCODE_FORM_DETAILS;
  constructor(public payload: BinCodeSaveModel) {}
}

export class EditBinCodeFormDetailsSuccess implements Action {
  readonly type = BinActionTypes.EDIT_BINCODE_FORM_DETAILS_SUCCESS;
  constructor(public payload: BinCodeSaveModel) {}
}

export class EditBinCodeFormDetailsFailure implements Action {
  readonly type = BinActionTypes.EDIT_BINCODE_FORM_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchBinName implements Action {
  readonly type = BinActionTypes.SEARCH_BIN_NAME;
  constructor(public payload: SearchBinCodePayload) {}
}

export class SearchBinNameSuccess implements Action {
  readonly type = BinActionTypes.SEARCH_BIN_NAME_SUCCESS;
  constructor(public payload: LoadSearchBinCodeDetails) {}
}
export class SearchBinNameFailure implements Action {
  readonly type = BinActionTypes.SEARCH_BIN_NAME_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadLocationsByBinGroupAndBinCode implements Action {
  readonly type = BinActionTypes.LOAD_LOCATIONS_BY_BINGROUP_AND_BINCODE;
  constructor(public payload: LocationsByBinGroupAndBinCodePayload) {}
}
export class LoadLocationsByBinGroupAndBinCodeSuccess implements Action {
  readonly type = BinActionTypes.LOAD_LOCATIONS_BY_BINGROUP_AND_BINCODE_SUCCESS;
  constructor(public payload: LocationList[]) {}
}
export class LoadLocationsByBinGroupAndBinCodeFailure implements Action {
  readonly type = BinActionTypes.LOAD_LOCATIONS_BY_BINGROUP_AND_BINCODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveLocationMappingDetails implements Action {
  readonly type = BinActionTypes.SAVE_LOCATION_MAPPING_DETAILS;
  constructor(public payload: LocationMappingPostPayload) {}
}

export class SaveLocationMappingDetailsSuccess implements Action {
  readonly type = BinActionTypes.SAVE_LOCATION_MAPPING_DETAILS_SUCCESS;
  constructor(public payload: LocationMappingPost) {}
}

export class SaveLocationMappingDetailsFailure implements Action {
  readonly type = BinActionTypes.SAVE_LOCATION_MAPPING_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type BinActions =
  | SaveBinCodeNewFormDetails
  | SaveBinCodeNewFormDetailsSuccess
  | SaveBinCodeNewFormDetailsFailure
  | ResetBinCodeDialog
  | LoadBinCodeDetails
  | LoadBinCodeDetailsSuccess
  | LoadBinCodeDetailsFailure
  | LoadBinCodesByBinGroupCode
  | LoadBinCodesByBinGroupCodeSuccess
  | LoadBinCodesByBinGroupCodeFailure
  | EditBinCodeFormDetails
  | EditBinCodeFormDetailsSuccess
  | EditBinCodeFormDetailsFailure
  | SearchBinName
  | SearchBinNameSuccess
  | SearchBinNameFailure
  | LoadLocationsByBinGroupAndBinCode
  | LoadLocationsByBinGroupAndBinCodeSuccess
  | LoadLocationsByBinGroupAndBinCodeFailure
  | SaveLocationMappingDetails
  | SaveLocationMappingDetailsSuccess
  | SaveLocationMappingDetailsFailure;
