import { Action } from '@ngrx/store';
import {
  CustomErrors,
  LoadCatchmentListingPayload,
  LoadCatchmentListingSuccessPayload,
  CatchmentDetails
} from '@poss-web/shared/models';

export enum CatchmentActionTypes {
  LOAD_CATCHMENT_LISTING = '[Load-Catchment-Listing] Load Catchment Listing',
  LOAD_CATCHMENT_LISTING_SUCCESS = '[Load-Catchment-Listing] Load Catchment Listing Success',
  LOAD_CATCHMENT_LISTING_FAILURE = '[Load-Catchment-Listing] Load Catchment Listing Failure',

  LOAD_CATCHMENT_DETAILS = '[Load-Catchment-Details] Load Catchment Details',
  LOAD_CATCHMENT_DETAILS_SUCCESS = '[Load-Catchment-Details] Load Catchment Details Success',
  LOAD_CATCHMENT_DETAILS_FAILURE = '[Load-Catchment-Details] Load Catchment Details Failure',

  SAVE_CATCHMENT_DETAILS = '[ Save-Catchment-Details ] SaveForm Details',
  SAVE_CATCHMENT_DETAILS_SUCCESS = '[ Save-Catchment-Details ] SaveForm Details Success',
  SAVE_CATCHMENT_DETAILS_FAILURE = '[ Save-Catchment-Details ] SaveForm Details Failure',

  EDIT_CATCHMENT_DETAILS = '[ Edit-Catchment-Details ] EditForm Details',
  EDIT_CATCHMENT_DETAILS_SUCCESS = '[ Edit-Catchment-Details ] EditForm Details Success',
  EDIT_CATCHMENT_DETAILS_FAILURE = '[ Edit-Catchment-Details ] EditForm Details Failure',

  SEARCH_CATCHMENT_DETAILS = '[Load-Catchment-Details] Search Catchment',
  SEARCH_CATCHMENT_DETAILS_SUCCESS = '[Load-Catchment-Details] Search Catchment Success',
  SEARCH_CATCHMENT_DETAILS_FAILURE = '[Load-Catchment-Details] Search Catchment Failure'
}

export class LoadCatchmentListing implements Action {
  readonly type = CatchmentActionTypes.LOAD_CATCHMENT_LISTING;
  constructor(public payload: LoadCatchmentListingPayload) {}
}
export class LoadCatchmentListingSuccess implements Action {
  readonly type = CatchmentActionTypes.LOAD_CATCHMENT_LISTING_SUCCESS;
  constructor(public payload: LoadCatchmentListingSuccessPayload) {}
}
export class LoadCatchmentListingFailure implements Action {
  readonly type = CatchmentActionTypes.LOAD_CATCHMENT_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCatchmentDetails implements Action {
  readonly type = CatchmentActionTypes.LOAD_CATCHMENT_DETAILS;
  constructor(public payload: string) {}
}
export class LoadCatchmentDetailsSuccess implements Action {
  readonly type = CatchmentActionTypes.LOAD_CATCHMENT_DETAILS_SUCCESS;
  constructor(public payload: CatchmentDetails) {}
}
export class LoadCatchmentDetailsFailure implements Action {
  readonly type = CatchmentActionTypes.LOAD_CATCHMENT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveCatchmentFormDetails implements Action {
  readonly type = CatchmentActionTypes.SAVE_CATCHMENT_DETAILS;
  constructor(public payload: CatchmentDetails) {}
}
export class SaveCatchmentFormDetailsSuccess implements Action {
  readonly type = CatchmentActionTypes.SAVE_CATCHMENT_DETAILS_SUCCESS;
  constructor(public payload: CatchmentDetails) {}
}
export class SaveCatchmentFormDetailsFailure implements Action {
  readonly type = CatchmentActionTypes.SAVE_CATCHMENT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditCatchmentFormDetails implements Action {
  readonly type = CatchmentActionTypes.EDIT_CATCHMENT_DETAILS;
  constructor(public payload: CatchmentDetails) {}
}
export class EditCatchmentFormDetailsSuccess implements Action {
  readonly type = CatchmentActionTypes.EDIT_CATCHMENT_DETAILS_SUCCESS;
  constructor(public payload: CatchmentDetails) {}
}
export class EditCatchmentFormDetailsFailure implements Action {
  readonly type = CatchmentActionTypes.EDIT_CATCHMENT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchCatchmentCode implements Action {
  readonly type = CatchmentActionTypes.SEARCH_CATCHMENT_DETAILS;
  constructor(public payload: string) {}
}
export class SearchCatchmentCodeSuccess implements Action {
  readonly type = CatchmentActionTypes.SEARCH_CATCHMENT_DETAILS_SUCCESS;
  constructor(public payload: LoadCatchmentListingSuccessPayload) {}
}
export class SearchCatchmentCodeFailure implements Action {
  readonly type = CatchmentActionTypes.SEARCH_CATCHMENT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type CatchmentActions =
  | LoadCatchmentListing
  | LoadCatchmentListingSuccess
  | LoadCatchmentListingFailure
  | LoadCatchmentDetails
  | LoadCatchmentDetailsSuccess
  | LoadCatchmentDetailsFailure
  | SaveCatchmentFormDetails
  | SaveCatchmentFormDetailsSuccess
  | SaveCatchmentFormDetailsFailure
  | EditCatchmentFormDetails
  | EditCatchmentFormDetailsSuccess
  | EditCatchmentFormDetailsFailure
  | SearchCatchmentCode
  | SearchCatchmentCodeSuccess
  | SearchCatchmentCodeFailure;
