import {
  CustomErrors,
  GHSRevenuePayload,
  PaginatePayload,
  RevenueRequest,
  RevenueResponse,
  ServiceRevenuePayload,
  TodayRevenueResponse
} from '@poss-web/shared/models';
import { Action } from '@ngrx/store';

export enum RevenueActionTypes {
  LOAD_REVENUE_LIST = '[ Revenue ] Load Revenue List',
  LOAD_REVENUE_LIST_SUCCESS = '[ Revenue ] Load Revenue List Success',
  LOAD_REVENUE_LIST_FAILURE = '[ Revenue ] Load Revenue List Failure',

  GET_TODAY_REVENUE_LIST = '[ Revenue ] Get Today Revenue List',
  GET_TODAY_REVENUE_LIST_SUCCESS = '[ Revenue ] Get Today Revenue List Success',
  GET_TODAY_REVENUE_LIST_FAILURE = '[ Revenue ] Get Today Revenue List Failure',

  GET_GHS_REVENUE_LIST = '[ Revenue ] Get Ghs Revenue List',
  GET_GHS_REVENUE_LIST_SUCCESS = '[ Revenue ] Get Ghs Revenue List Success',
  GET_GHS_REVENUE_LIST_FAILURE = '[ Revenue ] Get Ghs Revenue List Failure',

  GET_SERVICE_REVENUE_LIST = '[ Revenue ] Get Service Revenue List',
  GET_SERVICE_REVENUE_LIST_SUCCESS = '[ Revenue ] Get Service Revenue List Success',
  GET_SERVICE_REVENUE_LIST_FAILURE = '[ Revenue ] Get Service Revenue List Failure',

  RESET_ERROR = '[ Revenue ] Reset Error'
}

export class LoadRevenueList implements Action {
  readonly type = RevenueActionTypes.LOAD_REVENUE_LIST;
  constructor(
    public paginatePayload: PaginatePayload,
    public readonly payload: RevenueRequest
  ) {}
}

export class LoadRevenueListSuccess implements Action {
  readonly type = RevenueActionTypes.LOAD_REVENUE_LIST_SUCCESS;
  constructor(public readonly payload: RevenueResponse) {}
}

export class LoadRevenueListFailure implements Action {
  readonly type = RevenueActionTypes.LOAD_REVENUE_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetTodayRevenueList implements Action {
  readonly type = RevenueActionTypes.GET_TODAY_REVENUE_LIST;
  constructor(public readonly payload: string) {}
}

export class GetTodayRevenueListSuccess implements Action {
  readonly type = RevenueActionTypes.GET_TODAY_REVENUE_LIST_SUCCESS;
  constructor(public readonly payload: TodayRevenueResponse) {}
}

export class ResetError implements Action {
  readonly type = RevenueActionTypes.RESET_ERROR;
}

export class GetTodayRevenueListFailure implements Action {
  readonly type = RevenueActionTypes.GET_TODAY_REVENUE_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetGhsRevenueList implements Action {
  readonly type = RevenueActionTypes.GET_GHS_REVENUE_LIST;
  constructor(public readonly payload: GHSRevenuePayload) {}
}

export class GetGhsRevenueListSuccess implements Action {
  readonly type = RevenueActionTypes.GET_GHS_REVENUE_LIST_SUCCESS;
  constructor(public readonly payload: TodayRevenueResponse) {}
}

export class GetGhsRevenueListFailure implements Action {
  readonly type = RevenueActionTypes.GET_GHS_REVENUE_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetServiceRevenueList implements Action {
  readonly type = RevenueActionTypes.GET_SERVICE_REVENUE_LIST;
  constructor(public readonly payload: ServiceRevenuePayload) {}
}

export class GetServiceRevenueListSuccess implements Action {
  readonly type = RevenueActionTypes.GET_SERVICE_REVENUE_LIST_SUCCESS;
  constructor(public readonly payload: TodayRevenueResponse) {}
}

export class GetServiceRevenueListFailure implements Action {
  readonly type = RevenueActionTypes.GET_SERVICE_REVENUE_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type RevenueActions =
  | LoadRevenueList
  | LoadRevenueListSuccess
  | LoadRevenueListFailure
  | GetTodayRevenueList
  | GetTodayRevenueListSuccess
  | GetTodayRevenueListFailure
  | GetGhsRevenueList
  | GetGhsRevenueListSuccess
  | GetGhsRevenueListFailure
  | GetServiceRevenueList
  | GetServiceRevenueListSuccess
  | GetServiceRevenueListFailure
  | ResetError;
