import { Action } from '@ngrx/store';
import {
  CustomErrors,
  AirpayVendorSuccessList,
  ListPayload,
  SortItem
} from '@poss-web/shared/models';

export enum AirpayConfigurationActionTypes {
  GET_AIRPAY_VENDOR_LIST = '[airpay-configuration] Get Hostname List',
  GET_AIRPAY_VENDOR_LIST_SUCCESS = '[airpay-configuration] Get Hostname List Success',
  GET_AIRPAY_VENDOR_LIST_FAILURE = '[airpay-configuration] Get Hostname List Failure',

  RESET_RESPONSE = '[airpay-host-configuration] Reset Response'
}

export class GetAirpayVendorList implements Action {
  readonly type = AirpayConfigurationActionTypes.GET_AIRPAY_VENDOR_LIST;
  constructor(
    public payload: ListPayload,
    public sortField?: SortItem,
    public locationCode?: string
  ) {}
}
export class GetAirpayVendorListSuccess implements Action {
  readonly type = AirpayConfigurationActionTypes.GET_AIRPAY_VENDOR_LIST_SUCCESS;
  constructor(public payload: AirpayVendorSuccessList) {}
}
export class GetAirpayVendorListFailure implements Action {
  readonly type = AirpayConfigurationActionTypes.GET_AIRPAY_VENDOR_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetResponse implements Action {
  readonly type = AirpayConfigurationActionTypes.RESET_RESPONSE;
}

export type AirpayConfigurationActions =
  | GetAirpayVendorList
  | GetAirpayVendorListFailure
  | GetAirpayVendorListSuccess
  | ResetResponse;
