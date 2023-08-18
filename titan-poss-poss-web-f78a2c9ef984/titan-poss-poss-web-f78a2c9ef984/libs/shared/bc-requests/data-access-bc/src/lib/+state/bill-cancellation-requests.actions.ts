import { Moment } from 'moment';
import { Action } from '@ngrx/store';
import {
  BillCancellationRequests,
  BillCancelStatusList,
  CashMemoDetailsRequestPayload,
  CashMemoDetailsResponse,
  CashMemoItemDetailsRequestPayload,
  CashMemoItemDetails,
  CustomErrors
} from '@poss-web/shared/models';

/**
 * The interface for Action payload
 */

export interface BillCancellationRequestsListPayload {
  approvalStatus: string;
  body: {
    dateRangeType?: string;
    docNo?: number;
    endDate?: number;
    filterParams?: {
      cashMemoNumber?: string;
      customerMobileNumber?: string;
      locationCode?: string;
    };
    fiscalYear?: number;
    startDate?: number;
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
}

export interface CancelTypePayload {
  refTxnId: string;
  subTxnType: string;
  txnType: string;
}
export interface BillCancelListPayload {
  httpMethod: string;
  relativeUrl: string;
  reqBody: {
    dateRangeType?: string;
    docNo?: number;
    endDate?: Moment;

    fiscalYear?: number;
    startDate?: Moment;
  };
  requestParams: {
    page?: number;
    size?: number;
    workflowType: string;
    approvalStatus: string;
    sort?: any;
  };
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
}
export enum BillCancellationRequestsActionsTypes {
  RESET = '[BILL CANCELLATION REQUEST] RESET ',

  LOAD_LOCATION = '[ BILL CANCELLATION REQUEST ] Load Location',
  LOAD_LOCATION_SUCCESS = '[ BILL CANCELLATION REQUEST] Load Location Success',
  LOAD_LOCATION_FAILURE = '[BILL CANCELLATION REQUEST ] Load location Failure',

  LOAD_BILL_CANCELLATION_REQUESTS = '[BILL CANCELLATION REQUEST] LOAD BILL_CANCELLATION_REQUESTS LIST',
  LOAD_BILL_CANCELLATION_REQUESTS_SUCCESS = '[BILL CANCELLATION REQUEST]LOAD BILL_CANCELLATION_REQUESTS LIST Success',
  LOAD_BILL_CANCELLATION_REQUESTS_FAILURE = '[BILL CANCELLATION REQUEST]LOAD BILL_CANCELLATION_REQUESTS LIST Failure',

  APPROVE_BILL_CANCELLATION_REQUESTS = '[BILL CANCELLATION REQUEST]  APPROVE BILL_CANCELLATION_REQUESTS',
  APPROVE_BILL_CANCELLATION_REQUESTS_SUCCESS = '[BILL CANCELLATION REQUEST] APPROVE BILL_CANCELLATION_REQUESTS Success',
  APPROVE_BILL_CANCELLATION_REQUESTS_FAILURE = '[BILL CANCELLATION REQUEST] APPROVE BILL_CANCELLATION_REQUESTS Failure',

  COUNT_BILL_CANCELLATION_REQUESTS = '[BILL CANCELLATION REQUEST] COUNT BILL_CANCELLATION_REQUESTS',
  COUNT_BILL_CANCELLATION_REQUESTS_SUCCESS = '[BILL CANCELLATION REQUEST] COUNT BILL_CANCELLATION_REQUESTS Success',
  COUNT_BILL_CANCELLATION_REQUESTS_FAILURE = '[BILL CANCELLATION REQUEST] COUNT BILL_CANCELLATION_REQUESTS  Failure',

  CANCEL_TYPE = '[BILL CANCELLATION REQUEST] CANCEL TYPE ',
  CANCEL_TYPE_SUCCESS = '[BILL CANCELLATION REQUEST] CANCEL TYPE Success',
  CANCEL_TYPE_FAILURE = '[BILL CANCELLATION REQUEST] CANCEL TYPE  Failure',

  RESET_BC_STATUS = '[BILL CANCELLATION ] RESET ',

  LOAD_BILL_CANCELLATION_REQUESTS_STATUS = '[BILL CANCELLATION ] LOAD BILL_CANCELLATION_REQUESTS LIST',
  LOAD_BILL_CANCELLATION_REQUESTS_STATUS_SUCCESS = '[BILL CANCELLATION ]LOAD BILL_CANCELLATION_REQUESTS LIST Success',
  LOAD_BILL_CANCELLATION_REQUESTS_STATUS_FAILURE = '[BILL CANCELLATION ]LOAD BILL_CANCELLATION_REQUESTS LIST Failure',

  APPROVE_BILL_CANCELLATION_REQUESTS_STATUS = '[BILL CANCELLATION ]  APPROVE BILL_CANCELLATION_REQUESTS',
  APPROVE_BILL_CANCELLATION_REQUESTS_STATUS_SUCCESS = '[BILL CANCELLATION ] APPROVE BILL_CANCELLATION_REQUESTS Success',
  APPROVE_BILL_CANCELLATION_REQUESTS_STATUS_FAILURE = '[BILL CANCELLATION ] APPROVE BILL_CANCELLATION_REQUESTS Failure',

  COUNT_BILL_CANCELLATION_REQUESTS_STATUS = '[BILL CANCELLATION ] COUNT BILL_CANCELLATION_REQUESTS',
  COUNT_BILL_CANCELLATION_REQUESTS_STATUS_SUCCESS = '[BILL CANCELLATION ] COUNT BILL_CANCELLATION_REQUESTS Success',
  COUNT_BILL_CANCELLATION_REQUESTS_STATUS_FAILURE = '[BILL CANCELLATION ] COUNT BILL_CANCELLATION_REQUESTS  Failure',

  LOAD_HISTORY_FILTER_DATA = '[BILL CANCELLATION] Load History  ',
  RESET_FILTER = '[BILL CANCELLATION] Reset FILTER',
  RESET_DETAIL = '[BILL CANCELLATION] Reset DATA',
  LOAD_SELECTED = '[BILL CANCELLATION] Load Selected Data ',

  LOAD_SELECTED_DATA = '[BILL CANCELLATION] Load Selected Data ',
  LOAD_SELECTED_DATA_SUCESS = '[BILL CANCELLATION] Load Selected Data Success ',
  LOAD_SELECTED_FAILURE = '[BILL CANCELLATION] Load Selected Data Failure ',

  GET_ITEM_FROM_CASH_MEMO = '[BILL CANCELLATION] Get Item from BILL CANCELLATION',
  GET_ITEM_FROM_CASH_MEMO_SUCCESS = '[BILL CANCELLATION] Get Item from BILL CANCELLATION Success',
  GET_ITEM_FROM_CASH_MEMO_FAILURE = '[BILL CANCELLATION] Get Item from BILL CANCELLATION Failure',

  VIEW_CASH_MEMO = '[BILL CANCELLATION] View BILL CANCELLATION',
  VIEW_CASH_MEMO_SUCCESS = '[BILL CANCELLATION] View BILL CANCELLATION Success',
  VIEW_CASH_MEMO_FAILURE = '[BILL CANCELLATION] View BILL CANCELLATION Failure',

  CANCEL = '[BILL CANCELLATION]  CANCELLATION',
  CANCEL_SUCCESS = '[BILL CANCELLATION] CANCELLATION Success',
  CANCEL_FAILURE = '[BILL CANCELLATION]  CANCELLATION Failure',

  DELETE = '[BILL CANCELLATION]  DELETE ',
  DELETE_SUCCESS = '[BILL CANCELLATION]  DELETE  Success',
  DELETE_FAILURE = '[BILL CANCELLATION]  DELETE  Failure',

  CONFIRM = '[BILL CONFIRMLATION] CONFIRMLATION',
  CONFIRM_SUCCESS = '[BILL CONFIRMLATION] CONFIRMLATION Success',
  CONFIRM_FAILURE = '[BILL CANCELLATION]   CONFIRMLATION  Failure'
}

export class Reset implements Action {
  readonly type = BillCancellationRequestsActionsTypes.RESET;

}
export class LoadBillCancellationRequests implements Action {
  readonly type =
    BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS;

  constructor(readonly payload: BillCancellationRequestsListPayload) {}
}

export class LoadBillCancellationRequestsSuccess implements Action {
  readonly type =
    BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS_SUCCESS;
  constructor(readonly payload: BillCancellationRequests) {}
}
export class LoadBillCancellationRequestsFailure implements Action {
  readonly type =
    BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class CancelType implements Action {
  readonly type = BillCancellationRequestsActionsTypes.CANCEL_TYPE;

  constructor(readonly payload: CancelTypePayload) {}
}

export class CancelTypeSuccess implements Action {
  readonly type = BillCancellationRequestsActionsTypes.CANCEL_TYPE_SUCCESS;
  constructor(readonly payload: any) {}
}
export class CancelTypeFailure implements Action {
  readonly type = BillCancellationRequestsActionsTypes.CANCEL_TYPE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class ApproveBillCancellationRequests implements Action {
  readonly type =
    BillCancellationRequestsActionsTypes.APPROVE_BILL_CANCELLATION_REQUESTS;

  constructor(readonly payload: ApprovePayload) {}
}

export class ApproveBillCancellationRequestsSuccess implements Action {
  readonly type =
    BillCancellationRequestsActionsTypes.APPROVE_BILL_CANCELLATION_REQUESTS_SUCCESS;
  constructor(readonly payload: any) {}
}
export class ApproveBillCancellationRequestsFailure implements Action {
  readonly type =
    BillCancellationRequestsActionsTypes.APPROVE_BILL_CANCELLATION_REQUESTS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadCountBillCancellation implements Action {
  readonly type =
    BillCancellationRequestsActionsTypes.COUNT_BILL_CANCELLATION_REQUESTS;
  constructor(
    public payload: {
      approvalStatus: string;
      workflowType: string;
    }
  ) {}
}

export class LoadCountBillCancellationSuccess implements Action {
  readonly type =
    BillCancellationRequestsActionsTypes.COUNT_BILL_CANCELLATION_REQUESTS_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadCountBillCancellationFailure implements Action {
  BillCancellationRequestsActionsTypes;
  readonly type =
    BillCancellationRequestsActionsTypes.COUNT_BILL_CANCELLATION_REQUESTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadLocation implements Action {
  readonly type = BillCancellationRequestsActionsTypes.LOAD_LOCATION;

}

export class LoadLocationSuccess implements Action {
  readonly type = BillCancellationRequestsActionsTypes.LOAD_LOCATION_SUCCESS;
  constructor(public payload: any[]) {}
}
export class LoadLocationFailure implements Action {
  readonly type = BillCancellationRequestsActionsTypes.LOAD_LOCATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetBc implements Action {
  readonly type = BillCancellationRequestsActionsTypes.RESET_BC_STATUS;


}
export class LoadBillCancellationRequestsStatus implements Action {
  readonly type =
    BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS_STATUS;

  constructor(readonly payload: BillCancelListPayload) {}
}

export class LoadBillCancellationRequestsStatusSuccess implements Action {
  readonly type =
    BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS_STATUS_SUCCESS;
  constructor(readonly payload: BillCancelStatusList) {}
}
export class LoadBillCancellationRequestsStatusFailure implements Action {
  readonly type =
    BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS_STATUS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class GetItemfromCashMemo implements Action {
  readonly type = BillCancellationRequestsActionsTypes.GET_ITEM_FROM_CASH_MEMO;
  constructor(readonly payload: CashMemoItemDetailsRequestPayload) {}
}

export class GetItemfromCashMemoSuccess implements Action {
  readonly type =
    BillCancellationRequestsActionsTypes.GET_ITEM_FROM_CASH_MEMO_SUCCESS;
  constructor(readonly payload: CashMemoItemDetails) {}
}

export class GetItemfromCashMemoFailure implements Action {
  readonly type =
    BillCancellationRequestsActionsTypes.GET_ITEM_FROM_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class CANCELRequest implements Action {
  readonly type = BillCancellationRequestsActionsTypes.CANCEL;
  constructor(readonly payload: any) {}
}

export class CANCELRequestSuccess implements Action {
  readonly type = BillCancellationRequestsActionsTypes.CANCEL_SUCCESS;
  constructor(readonly payload: any) {}
}

export class CANCELRequestFailure implements Action {
  readonly type = BillCancellationRequestsActionsTypes.CANCEL_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class DeleteRequest implements Action {
  readonly type = BillCancellationRequestsActionsTypes.DELETE;
  constructor(readonly payload: any) {}
}

export class DeleteRequestSuccess implements Action {
  readonly type = BillCancellationRequestsActionsTypes.DELETE_SUCCESS;
  constructor(readonly payload: any) {}
}

export class DeleteRequestFailure implements Action {
  readonly type = BillCancellationRequestsActionsTypes.DELETE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class CONFIRMRequest implements Action {
  readonly type = BillCancellationRequestsActionsTypes.CONFIRM;
  constructor(readonly payload: any) {}
}

export class CONFIRMRequestSuccess implements Action {
  readonly type = BillCancellationRequestsActionsTypes.CONFIRM_SUCCESS;
  constructor(readonly payload: any) {}
}

export class CONFIRMRequestFailure implements Action {
  readonly type = BillCancellationRequestsActionsTypes.CONFIRM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class RESETFILTER implements Action {
  readonly type = BillCancellationRequestsActionsTypes.RESET_FILTER;
}

export class LoadSeltedData implements Action {
  readonly type = BillCancellationRequestsActionsTypes.LOAD_SELECTED_DATA;
  constructor(readonly payload: { processId: any; workflowType: any }) {}
}

export class LoadSelectedDataSucess implements Action {
  readonly type =
    BillCancellationRequestsActionsTypes.LOAD_SELECTED_DATA_SUCESS;
  constructor(public payload: any) {}
}
export class LoadSelectedDataFailure implements Action {
  readonly type = BillCancellationRequestsActionsTypes.LOAD_SELECTED_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class RESETDETAIL implements Action {
  readonly type = BillCancellationRequestsActionsTypes.RESET_DETAIL;
}

export class LoadHistoryFilterData implements Action {
  readonly type = BillCancellationRequestsActionsTypes.LOAD_HISTORY_FILTER_DATA;
  constructor(public payload: string) {}
}
export class LoadSelectedData implements Action {
  readonly type = BillCancellationRequestsActionsTypes.LOAD_SELECTED;
  constructor(public payload: any) {}
}

export class ViewCashMemo implements Action {
  readonly type = BillCancellationRequestsActionsTypes.VIEW_CASH_MEMO;
  constructor(readonly payload: CashMemoDetailsRequestPayload) {}
}

export class ViewCashMemoSuccess implements Action {
  readonly type = BillCancellationRequestsActionsTypes.VIEW_CASH_MEMO_SUCCESS;
  constructor(readonly payload: CashMemoDetailsResponse) {}
}

export class ViewCashMemoFailure implements Action {
  readonly type = BillCancellationRequestsActionsTypes.VIEW_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export type BillCancellationRequestsActions =
  | LoadBillCancellationRequests
  | LoadBillCancellationRequestsSuccess
  | LoadBillCancellationRequestsFailure
  | LoadCountBillCancellation
  | LoadCountBillCancellationFailure
  | LoadCountBillCancellationSuccess
  | ApproveBillCancellationRequests
  | ApproveBillCancellationRequestsFailure
  | ApproveBillCancellationRequestsSuccess
  | Reset
  | LoadLocation
  | LoadLocationSuccess
  | LoadLocationFailure
  | LoadBillCancellationRequestsStatus
  | LoadBillCancellationRequestsStatusSuccess
  | LoadBillCancellationRequestsStatusFailure
  | GetItemfromCashMemo
  | GetItemfromCashMemoFailure
  | GetItemfromCashMemoSuccess
  | ViewCashMemo
  | ViewCashMemoFailure
  | ViewCashMemoSuccess
  | ResetBc
  | RESETFILTER
  | LoadHistoryFilterData
  | LoadSelectedData
  | LoadSeltedData
  | LoadSelectedDataFailure
  | LoadSelectedDataSucess
  | RESETDETAIL
  | CONFIRMRequest
  | CONFIRMRequestFailure
  | CONFIRMRequestSuccess
  | DeleteRequest
  | DeleteRequestFailure
  | DeleteRequestSuccess
  | CANCELRequest
  | CANCELRequestFailure
  | CANCELRequestSuccess
  | CancelType
  | CancelTypeFailure
  | CancelTypeSuccess;
