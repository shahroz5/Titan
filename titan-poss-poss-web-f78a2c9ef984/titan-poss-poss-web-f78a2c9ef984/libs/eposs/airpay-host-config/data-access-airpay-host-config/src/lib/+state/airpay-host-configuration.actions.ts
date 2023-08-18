import { Action } from '@ngrx/store';
import {
  CustomErrors,
  AirpayHostSuccessList,
  ListingPayload,
  SortItem
} from '@poss-web/shared/models';

/**
 * The interface for Action payload
 */
export enum AirpayHostConfigurationActionTypes {
  GET_HOSTNAME_LIST = '[airpay-host-configuration] Get Hostname List',
  GET_HOSTNAME_LIST_SUCCESS = '[airpay-host-configuration] Get Hostname List Success',
  GET_HOSTNAME_LIST_FAILURE = '[airpay-host-configuration] Get Hostname List Failure',

  RESET_RESPONSE = '[airpay-host-configuration] Reset Response'
}

export class GetHostNameList implements Action {
  readonly type = AirpayHostConfigurationActionTypes.GET_HOSTNAME_LIST;
  constructor(
    public payload: ListingPayload,
    public sortField?: SortItem,
    public locationCode?: string
  ) {}
}
export class GetHostNameListSuccess implements Action {
  readonly type = AirpayHostConfigurationActionTypes.GET_HOSTNAME_LIST_SUCCESS;
  constructor(public payload: AirpayHostSuccessList) {}
}
export class GetHostNameListFailure implements Action {
  readonly type = AirpayHostConfigurationActionTypes.GET_HOSTNAME_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetResponse implements Action {
  readonly type = AirpayHostConfigurationActionTypes.RESET_RESPONSE;
}

export type AirpayHostConfigurationActions =
  | ResetResponse
  | GetHostNameList
  | GetHostNameListFailure
  | GetHostNameListSuccess;
