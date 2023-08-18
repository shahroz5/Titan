import { Action } from '@ngrx/store';
import {
  LoadRegionDetailsListingSuccessPayload,
  LoadRegionListingPayload,
  CustomErrors,
  RegionsData,
  SaveRegionDetailsPayload,
  EditRegionDetailsPayload
  // LoadRegionDetailsListingSuccessPayload
} from '@poss-web/shared/models';

export enum RegionActionTypes {
  LOAD_REGION_DETAILS = '[Load-region] Load Region Details',
  LOAD_REGION_DETAILS_SUCCESS = '[Load-region] Load Region Details Success',
  LOAD_REGION_DETAILS_FAILURE = '[Load-region] Load Region Details Failure',

  LOAD_REGION_DETAILS_BY_CODE = '[Load-region-By-code] Load Region Details By Code',
  LOAD_REGION_DETAILS_BY_CODE_SUCCESS = '[Load-region-By-code] Load Region Details By Code Success',
  LOAD_REGION_DETAILS_BY_CODE_FAILURE = '[Load-region-By-code] Load Region Details By Code Failure',

  RESET_REGION_DIALOG_DATA = '[Reset-Region] Reset Region Dialog Data',

  SAVE_REGION_DETAILS = '[Save-Region-Details] Save Region Details',
  SAVE_REGION_DETAILS_SUCCESS = '[Save-Region-Details] Save Region Details Success',
  SAVE_REGION_DETAILS_FAILURE = '[Save-Region-Details] Save Region Details Failure',

  EDIT_REGION_DETAILS = '[Edit-Region] Edit Region Details',
  EDIT_REGION_DETAILS_SUCCESS = '[Edit-Region] Edit Region Details Success',
  EDIT_REGION_DETAILS_FAILURE = '[Edit-Region] Edit Region Details Failure',

  SEARCH_REGION_BY_CODE = '[Region-Search] Search Region Code',
  SEARCH_REGION_BY_CODE_SUCCESS = '[Region-Search] Search Region Success',
  SEARCH_REGION_BY_CODE_FAILURE = '[Region-Search] Search Region Failure'
}

export class LoadRegionDetails implements Action {
  readonly type = RegionActionTypes.LOAD_REGION_DETAILS;
  constructor(public payload: LoadRegionListingPayload) {}
}
export class LoadRegionDetailsSuccess implements Action {
  readonly type = RegionActionTypes.LOAD_REGION_DETAILS_SUCCESS;
  constructor(public payload: LoadRegionDetailsListingSuccessPayload) {}
}
export class LoadRegionDetailsFailure implements Action {
  readonly type = RegionActionTypes.LOAD_REGION_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRegionByCode implements Action {
  readonly type = RegionActionTypes.LOAD_REGION_DETAILS_BY_CODE;
  constructor(public payload: string) {}
}
export class LoadRegionByCodeSuccess implements Action {
  readonly type = RegionActionTypes.LOAD_REGION_DETAILS_BY_CODE_SUCCESS;
  constructor(public payload: RegionsData) {}
}
export class LoadRegionByCodeFailure implements Action {
  readonly type = RegionActionTypes.LOAD_REGION_DETAILS_BY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetRegionDialog implements Action {
  readonly type = RegionActionTypes.RESET_REGION_DIALOG_DATA;
}

export class SaveRegionFormDetails implements Action {
  readonly type = RegionActionTypes.SAVE_REGION_DETAILS;
  constructor(public payload: SaveRegionDetailsPayload) {}
}

export class SaveRegionFormDetailsSuccess implements Action {
  readonly type = RegionActionTypes.SAVE_REGION_DETAILS_SUCCESS;
  constructor(public payload: SaveRegionDetailsPayload) {}
}

export class SaveRegionFormDetailsFailure implements Action {
  readonly type = RegionActionTypes.SAVE_REGION_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditRegionDetails implements Action {
  readonly type = RegionActionTypes.EDIT_REGION_DETAILS;
  constructor(public payload: EditRegionDetailsPayload) {}
}

export class EditRegionDetailsSuccess implements Action {
  readonly type = RegionActionTypes.EDIT_REGION_DETAILS_SUCCESS;
  constructor(public payload: SaveRegionDetailsPayload) {}
}

export class EditRegionDetailsFailure implements Action {
  readonly type = RegionActionTypes.EDIT_REGION_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchRegion implements Action {
  readonly type = RegionActionTypes.SEARCH_REGION_BY_CODE;
  constructor(public payload: string) {}
}

export class SearchRegionSuccess implements Action {
  readonly type = RegionActionTypes.SEARCH_REGION_BY_CODE_SUCCESS;
  constructor(public payload: LoadRegionDetailsListingSuccessPayload) {}
}
export class SearchRegionFailure implements Action {
  readonly type = RegionActionTypes.SEARCH_REGION_BY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type RegionActions =
  | LoadRegionDetails
  | LoadRegionDetailsSuccess
  | LoadRegionDetailsFailure
  | LoadRegionByCode
  | LoadRegionByCodeSuccess
  | LoadRegionByCodeFailure
  | ResetRegionDialog
  | SaveRegionFormDetails
  | SaveRegionFormDetailsSuccess
  | SaveRegionFormDetailsFailure
  | EditRegionDetails
  | EditRegionDetailsSuccess
  | EditRegionDetailsFailure
  | SearchRegion
  | SearchRegionSuccess
  | SearchRegionFailure;
