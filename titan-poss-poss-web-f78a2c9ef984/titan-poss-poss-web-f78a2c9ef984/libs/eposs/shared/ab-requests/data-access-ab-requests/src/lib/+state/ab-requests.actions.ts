import { Moment } from 'moment';
import { Action } from '@ngrx/store';
import { CustomErrors, ABRequests } from '@poss-web/shared/models';

/**
 * The interface for Action payload
 */

export interface AbRequestsListPayload {
  approvalStatus: string;
  body: {
    dateRangeType?: string;
    docNo?: number;
    endDate?: Moment;
    filterParams?: {
      cashMemoNumber?: string;
      customerMobileNumber?: string;
      locationCode?: string;
    };
    fiscalYear?: number;
    startDate?: Moment;
  };
  page?: number;
  size?: number;
  workflowType: string;
}

export interface ApprovePayload {
  approved: string;
  body: {
    approvedData: {
      data: any;
      type: string;
    };
    approverRemarks: string;
  };
  processId: string;
  taskId: string;
  taskName: string;
  docNo?:number;
}
export interface BulkApprovePayload {
  bulkApproverRequestObjectDto: [
    {
      approved: boolean;
      approverRemarks: string;
      processId: string;
      taskId: string;
      taskName: string;
    }
  ];
}

export enum ABRequestsActionsTypes {
  RESET = '[AB  REQUESTS] RESET ',

  LOAD_LOCATION = '[ AB  REQUESTS ] Load Location',
  LOAD_LOCATION_SUCCESS = '[ AB  REQUESTS] Load Location Success',
  LOAD_LOCATION_FAILURE = '[AB  REQUESTS ] Load location Failure',

  LOAD_AB__REQUESTS = '[AB  REQUESTS] LOAD AB__REQUESTS LIST',
  LOAD_AB__REQUESTS_SUCCESS = '[AB  REQUESTS]LOAD AB__REQUESTS LIST Success',
  LOAD_AB__REQUESTS_FAILURE = '[AB  REQUESTS]LOAD AB__REQUESTS LIST Failure',

  APPROVE_AB__REQUESTS = '[AB  REQUESTS]  APPROVE AB__REQUESTS',
  APPROVE_AB__REQUESTS_SUCCESS = '[AB  REQUESTS] APPROVE AB__REQUESTS Success',
  APPROVE_AB__REQUESTS_FAILURE = '[AB  REQUESTS] APPROVE AB__REQUESTS Failure',

}

export class Reset implements Action {
  readonly type = ABRequestsActionsTypes.RESET;

}
export class LoadABRequests implements Action {
  readonly type = ABRequestsActionsTypes.LOAD_AB__REQUESTS;

  constructor(readonly payload: AbRequestsListPayload) {}
}

export class LoadABRequestsSuccess implements Action {
  readonly type = ABRequestsActionsTypes.LOAD_AB__REQUESTS_SUCCESS;
  constructor(readonly payload: ABRequests) {}
}
export class LoadABRequestsFailure implements Action {
  readonly type = ABRequestsActionsTypes.LOAD_AB__REQUESTS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ApproveABRequests implements Action {
  readonly type = ABRequestsActionsTypes.APPROVE_AB__REQUESTS;

  constructor(readonly payload: ApprovePayload) {}
}

export class ApproveABRequestsSuccess implements Action {
  readonly type = ABRequestsActionsTypes.APPROVE_AB__REQUESTS_SUCCESS;
  constructor(readonly payload: {data:any,docNo:number}) {}
}
export class ApproveABRequestsFailure implements Action {
  readonly type = ABRequestsActionsTypes.APPROVE_AB__REQUESTS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}



export class LoadLocation implements Action {
  readonly type = ABRequestsActionsTypes.LOAD_LOCATION;

}

export class LoadLocationSuccess implements Action {
  readonly type = ABRequestsActionsTypes.LOAD_LOCATION_SUCCESS;
  constructor(public payload: any[]) {}
}
export class LoadLocationFailure implements Action {
  readonly type = ABRequestsActionsTypes.LOAD_LOCATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type ABRequestsActions =
  | LoadABRequests
  | LoadABRequestsSuccess
  | LoadABRequestsFailure

  | ApproveABRequests
  | ApproveABRequestsFailure
  | ApproveABRequestsSuccess
  | Reset
  | LoadLocation
  | LoadLocationSuccess
  | LoadLocationFailure;
