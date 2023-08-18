import { Action } from '@ngrx/store';
import {
  LoadSubRegionListingPayload,
  LoadSubRegionListingSuccessPayload,
  CustomErrors,
  SubRegion,
  SaveSubRegionDetailsPayload,
  EditSubRegionDetailsPayload,
  LoadRegionDetailsListingSuccessPayload,
  SearchSubRegionPayload
} from '@poss-web/shared/models';

export enum SubRegionActionTypes {
  LOAD_REGION_DETAILS = '[Load-region-listing] Load Region Details',
  LOAD_REGION_DETAILS_SUCCESS = '[Load-region-listing] Load Region Details Success',
  LOAD_REGION_DETAILS_FAILURE = '[Load-region-listing] Load Region Details Failure',

  LOAD_SUB_REGION_DETAILS = '[Load-SubRegion] Load SubRegion Details',
  LOAD_SUB_REGION_DETAILS_SUCCESS = '[Load-SubRegion] Load SubRegion Details Success',
  LOAD_SUB_REGION_DETAILS_FAILURE = '[Load-SubRegion] Load SubRegion Details Failure',

  LOAD_SUB_REGION_DETAILS_BY_CODE = '[Load-SubRegion-By-code] Load SubRegion Details By Code',
  LOAD_SUB_REGION_DETAILS_BY_CODE_SUCCESS = '[Load-SubRegion-By-code] Load SubRegion Details By Code Success',
  LOAD_SUB_REGION_DETAILS_BY_CODE_FAILURE = '[Load-SubRegion-By-code] Load SubRegion Details By Code Failure',

  RESET_SUB_REGION_DIALOG_DATA = '[Reset-SubRegion] Reset SubRegion Dialog Data',

  SAVE_SUB_REGION_DETAILS = '[Save-SubRegion-Details] Save SubRegion Details',
  SAVE_SUB_REGION_DETAILS_SUCCESS = '[Save-SubRegion-Details] Save SubRegion Details Success',
  SAVE_SUB_REGION_DETAILS_FAILURE = '[Save-SubRegion-Details] Save SubRegion Details Failure',

  EDIT_SUB_REGION_DETAILS = '[SubRegion-Region] Edit SubRegion Details',
  EDIT_SUB_REGION_DETAILS_SUCCESS = '[SubRegion-Region] Edit SubRegion Details Success',
  EDIT_SUB_REGION_DETAILS_FAILURE = '[SubRegion-Region] Edit SubRegion Details Failure',

  SEARCH_SUB_REGION_BY_CODE = '[SubRegion-Search] Search SubRegion Code',
  SEARCH_SUB_REGION_CODE_SUCCESS = '[SubRegion-Search] Search SubRegion Success',
  SEARCH_SUB_REGION_BY_CODE_FAILURE = '[SubRegion-Search] Search SubRegion Failure'
}

export class LoadRegionDetails implements Action {
  readonly type = SubRegionActionTypes.LOAD_REGION_DETAILS;
}
export class LoadRegionDetailsSuccess implements Action {
  readonly type = SubRegionActionTypes.LOAD_REGION_DETAILS_SUCCESS;
  constructor(public payload: LoadRegionDetailsListingSuccessPayload) {}
}
export class LoadRegionDetailsFailure implements Action {
  readonly type = SubRegionActionTypes.LOAD_REGION_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSubRegionDetails implements Action {
  readonly type = SubRegionActionTypes.LOAD_SUB_REGION_DETAILS;
  constructor(public payload: LoadSubRegionListingPayload) {}
}
export class LoadSubRegionDetailsSuccess implements Action {
  readonly type = SubRegionActionTypes.LOAD_SUB_REGION_DETAILS_SUCCESS;
  constructor(public payload: LoadSubRegionListingSuccessPayload) {}
}
export class LoadSubRegionDetailsFailure implements Action {
  readonly type = SubRegionActionTypes.LOAD_SUB_REGION_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSubRegionByCode implements Action {
  readonly type = SubRegionActionTypes.LOAD_SUB_REGION_DETAILS_BY_CODE;
  constructor(public payload: string) {}
}
export class LoadSubRegionByCodeSuccess implements Action {
  readonly type = SubRegionActionTypes.LOAD_SUB_REGION_DETAILS_BY_CODE_SUCCESS;
  constructor(public payload: SubRegion) {}
}
export class LoadSubRegionByCodeFailure implements Action {
  readonly type = SubRegionActionTypes.LOAD_SUB_REGION_DETAILS_BY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetSubRegionDialog implements Action {
  readonly type = SubRegionActionTypes.RESET_SUB_REGION_DIALOG_DATA;
}

export class SaveSubRegionFormDetails implements Action {
  readonly type = SubRegionActionTypes.SAVE_SUB_REGION_DETAILS;
  constructor(public payload: SaveSubRegionDetailsPayload) {}
}

export class SaveSubRegionFormDetailsSuccess implements Action {
  readonly type = SubRegionActionTypes.SAVE_SUB_REGION_DETAILS_SUCCESS;
  constructor(public payload: SaveSubRegionDetailsPayload) {}
}

export class SaveSubRegionFormDetailsFailure implements Action {
  readonly type = SubRegionActionTypes.SAVE_SUB_REGION_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditSubRegionDetails implements Action {
  readonly type = SubRegionActionTypes.EDIT_SUB_REGION_DETAILS;
  constructor(public payload: EditSubRegionDetailsPayload) {}
}

export class EditSubRegionDetailsSuccess implements Action {
  readonly type = SubRegionActionTypes.EDIT_SUB_REGION_DETAILS_SUCCESS;
  constructor(public payload: SaveSubRegionDetailsPayload) {}
}

export class EditSubRegionDetailsFailure implements Action {
  readonly type = SubRegionActionTypes.EDIT_SUB_REGION_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchSubRegion implements Action {
  readonly type = SubRegionActionTypes.SEARCH_SUB_REGION_BY_CODE;
  constructor(public payload: SearchSubRegionPayload) {}
}

export class SearchSubRegionSuccess implements Action {
  readonly type = SubRegionActionTypes.SEARCH_SUB_REGION_CODE_SUCCESS;
  constructor(public payload: LoadSubRegionListingSuccessPayload) {}
}
export class SearchSubRegionFailure implements Action {
  readonly type = SubRegionActionTypes.SEARCH_SUB_REGION_BY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type SubRegionActions =
  | LoadRegionDetails
  | LoadRegionDetailsSuccess
  | LoadRegionDetailsFailure
  | LoadSubRegionDetails
  | LoadSubRegionDetailsSuccess
  | LoadSubRegionDetailsFailure
  | LoadSubRegionByCode
  | LoadSubRegionByCodeSuccess
  | LoadSubRegionByCodeFailure
  | ResetSubRegionDialog
  | SaveSubRegionFormDetails
  | SaveSubRegionFormDetailsSuccess
  | SaveSubRegionFormDetailsFailure
  | EditSubRegionDetails
  | EditSubRegionDetailsSuccess
  | EditSubRegionDetailsFailure
  | SearchSubRegion
  | SearchSubRegionSuccess
  | SearchSubRegionFailure;
