import { Action } from '@ngrx/store';
import {
  CustomErrors,
  GLLocationPaymentList,
  SaveGlLocationPayments,
  GLLocationPaymentListPayload,
  GLLocationPaymentSuccessList,
  PaymentCodes,
  LocationCodeDetails
} from '@poss-web/shared/models';

export enum GlLocationPaymentActionTypes {
  LOAD_GL_LOCATION_PAYMENT_LIST = '[Gl-Location-Payment] Load Gl-Location-Payment List',
  LOAD_GL_LOCATION_PAYMENT_LIST_SUCCESS = '[Gl-Location-Payment] Load Gl-Location-Payment List Success',
  LOAD_GL_LOCATION_PAYMENT_LIST_FAILURE = '[Gl-Location-Payment] Load Gl-Location-Payment List Failure',

  SAVE_GL_LOCATION_PAYMENT_DETAILS = '[ Gl-Location -Payment] Save Gl-Location-Payment Details',
  SAVE_GL_LOCATION_PAYMENT_DETAILS_SUCCESS = '[ Gl-Location-Payment] Save Gl-Location-Payment Details Success',
  SAVE_GL_LOCATION_PAYMENT_DETAILS_FAILURE = '[ Gl-Location-Payment] Save Gl-Location-Payment Details Failure',

  UPDATE_GL_LOCATION_PAYMENT_DETAILS = '[ Gl-Location -Payment] Update Gl-Location-Payment Details',
  DELETE_GL_LOCATION_PAYMENT_DETAILS = '[ Gl-Location -Payment] Delete Gl-Location-Payment Details',

  LOAD_PAYMENT_CODES = '[ Gl-Location -Payment] Load Payment Codes',
  LOAD_PAYMENT_CODES_SUCCESS = '[ Gl-Location -Payment] Load Payment Codes Success',
  LOAD_PAYMENT_CODES_FAILURE = '[ Gl-Location -Payment] Load Payment Codes Failure',

  GET_LOCATIONS = '[ Gl-Location -Payment] Get Locations',
  GET_LOCATIONS_SUCCESS = '[ Gl-Location -Payment] Get Locations Success',
  GET_LOCATIONS_FAILURE = '[ Gl-Location -Payment] Get Locations Failure',

  RESET_GL_LOCATION_PAYMENT = '[ Gl-Location -Payment] Reset Payee Bank GL Code Details'
}

export class LoadGlLocationPaymentList implements Action {
  readonly type = GlLocationPaymentActionTypes.LOAD_GL_LOCATION_PAYMENT_LIST;
  constructor(
    public payload: GLLocationPaymentListPayload,
    public locationCode?: string
  ) {}
}
export class LoadGlLocationPaymentListSuccess implements Action {
  readonly type =
    GlLocationPaymentActionTypes.LOAD_GL_LOCATION_PAYMENT_LIST_SUCCESS;
  constructor(public payload: GLLocationPaymentSuccessList) {}
}
export class LoadGlLocationPaymentListFailure implements Action {
  readonly type =
    GlLocationPaymentActionTypes.LOAD_GL_LOCATION_PAYMENT_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveGlLocationPayment implements Action {
  readonly type = GlLocationPaymentActionTypes.SAVE_GL_LOCATION_PAYMENT_DETAILS;
  constructor(public payload: SaveGlLocationPayments) {}
}
export class SaveGlLocationPaymentSuccess implements Action {
  readonly type =
    GlLocationPaymentActionTypes.SAVE_GL_LOCATION_PAYMENT_DETAILS_SUCCESS;
  constructor(public payload: GLLocationPaymentList) {}
}
export class SaveGlLocationPaymentFailure implements Action {
  readonly type =
    GlLocationPaymentActionTypes.SAVE_GL_LOCATION_PAYMENT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateGlLocationPayment implements Action {
  readonly type =
    GlLocationPaymentActionTypes.UPDATE_GL_LOCATION_PAYMENT_DETAILS;
  constructor(
    public payload: { id: string; glCode: number; paymentCode: string }
  ) {}
}
export class DeleteGlLocationPayment implements Action {
  readonly type =
    GlLocationPaymentActionTypes.DELETE_GL_LOCATION_PAYMENT_DETAILS;
  constructor(public payload: string) {}
}

export class LoadPaymentCodes implements Action {
  readonly type = GlLocationPaymentActionTypes.LOAD_PAYMENT_CODES;
}
export class LoadPaymentCodesSuccess implements Action {
  readonly type = GlLocationPaymentActionTypes.LOAD_PAYMENT_CODES_SUCCESS;
  constructor(public payload: PaymentCodes[]) {}
}
export class LoadPaymentCodesFailure implements Action {
  readonly type = GlLocationPaymentActionTypes.LOAD_PAYMENT_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetLocationCodes implements Action {
  readonly type = GlLocationPaymentActionTypes.GET_LOCATIONS;

}

export class GetLocationCodesSuccess implements Action {
  readonly type = GlLocationPaymentActionTypes.GET_LOCATIONS_SUCCESS;
  constructor(public payload: LocationCodeDetails[]) {}
}

export class GetLocationCodesFailure implements Action {
  readonly type = GlLocationPaymentActionTypes.GET_LOCATIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetGlPaymentDetails implements Action {
  readonly type = GlLocationPaymentActionTypes.RESET_GL_LOCATION_PAYMENT;
}
export type GlLocationPaymentActions =
  | LoadGlLocationPaymentList
  | LoadGlLocationPaymentListSuccess
  | LoadGlLocationPaymentListFailure
  | SaveGlLocationPayment
  | SaveGlLocationPaymentSuccess
  | SaveGlLocationPaymentFailure
  | LoadPaymentCodes
  | LoadPaymentCodesSuccess
  | LoadPaymentCodesFailure
  | GetLocationCodes
  | GetLocationCodesSuccess
  | GetLocationCodesFailure
  | ResetGlPaymentDetails
  | UpdateGlLocationPayment
  | DeleteGlLocationPayment;
